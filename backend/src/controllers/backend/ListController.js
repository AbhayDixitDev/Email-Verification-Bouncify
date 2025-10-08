const Logs = require('../../utils/logs-util.js');
const Response = require('../../utils/response-util.js');
const { verifySingleEmail, uploadFile, getBulkStatus, startBulkEmailVerification, removeBulkEmailList, calculateStats, } = require('../../services/bouncify-service.js');
const EmailList = require('../../models/EmailList.js');
const FormData = require('form-data');
const EmailValidation = require('../../models/EmailValidation.js');
const { body, validationResult } = require('express-validator');
const CreditService = require('../../services/credit-service.js');
const BouncifyStatus = require('../../utils/bouncify-status-util.js');
const axios = require('axios');
require('dotenv').config();


const Status = {
    "uploading": "UNPROCESSED",      
    "Unverified": "UNPROCESSED",        
    "processing": "PROCESSING",    
    "verified": "COMPLETED",     
    "failed": "FAILED"            
}

module.exports = {

    /**
      * Get All The List Of Uploaded File
      * @param {*} req 
      * @param {*} res 
      */
    getAllList: async (req, res) => {
        const userId = req?.user?.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const statusParam = req.query.status;
        const status = Status[statusParam] || ""; // Map UI status to backend or empty string for all
        const skip = (page - 1) * limit;
      
        try {
          const baseFilterCriteria = { userId };
      
          const emailListSearchCriteria = { ...baseFilterCriteria };
          const emailValidationSearchCriteria = { ...baseFilterCriteria };
      
          if (search) {
            emailListSearchCriteria.listName = { $regex: search, $options: "i" };
            emailValidationSearchCriteria.email = { $regex: search, $options: "i" };
          }
      
          // Only add status filter if status is provided and not "all"
          if (statusParam && statusParam !== "all" && status) {
            emailListSearchCriteria.status = status.toUpperCase();
            emailValidationSearchCriteria.status = status.toUpperCase();
          }
      
          // Fetch data from both collections based on filters
          const [emailListData, emailValidationData] = await Promise.all([
            EmailList.find(emailListSearchCriteria).sort({ createdAt: -1 }).lean(),
            EmailValidation.find(emailValidationSearchCriteria).sort({ createdAt: -1 }).lean()
          ]);
      
          // Transform EmailValidation data to match EmailList structure
          const transformedEmailValidationData = emailValidationData.map((item) => ({
            _id: item._id,
            userId: item.userId,
            listName: `Single: ${item.email}`,
            jobId: `single_${item._id}`,
            totalEmails: 1,
            status: "COMPLETED",
            report: {
              status: item.status || '',
              total: 1,
              verified: item.status === 'COMPLETED' ? 1 : 0,
              pending: item.status === 'PROCESSING' ? 1 : 0,
              analysis: {},
              results: {
                deliverable: (item.result?.result === "deliverable") ? 1 : 0,
                undeliverable: (item.result?.result === "undeliverable") ? 1 : 0,
                accept_all: 0,
                unknown: item.result?.unknown || 0
              }
            },
            createdAt: item.createdAt,
            __v: item.__v,
            isSingleEmail: true // Mark to differentiate single emails
          }));
      
          // Combine both datasets for unified list
          const combinedData = [...emailListData, ...transformedEmailValidationData];
      
          // Sort combined data by creation date descending
          combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
          // Pagination calculation
          const total = combinedData.length;
          const totalPages = Math.ceil(total / limit);
          const listData = combinedData.slice(skip, skip + limit);
      
          // Calculate counts per status from combinedData for tabs stats
          const statusCounts = combinedData.reduce((acc, item) => {
            const stat = item.status || 'UNPROCESSED';
            acc[stat] = (acc[stat] || 0) + 1;
            return acc;
          }, {});
      
          // Total Emails calculation
          const totalEmails = combinedData.reduce((sum, item) => sum + (item.totalEmails || 0), 0);
      
          // Total Credits calculation considering single emails
          const totalCreditsUsed = combinedData.reduce((sum, item) => {
            if (item.isSingleEmail) {
              return sum + (item.status === 'COMPLETED' ? 1 : 0);
            }
            return sum + (item.report?.verified || 0);
          }, 0);
      
          res.status(200).json({
            success: true,
            message: "Email lists fetched successfully",
            data: {
              listData,
              total,
              page,
              limit,
              totalPages,
              stats: {
                ...statusCounts,
                totalEmails,
                totalCreditsUsed
              }
            }
          });
      
        } catch (error) {
          console.error("Error fetching email lists:", error);
          res.status(500).json({
            success: false,
            message: "There was an error while fetching email lists",
            error: error.message
          });
        }
      },
      

    /**
    * Get The Single List 
    * @param {*} req 
    * @param {*} res 
    */
    getListById: async (req, res) => {
        try {
            const file = await EmailList.findById(req.params.listId);
            if (!file) {
                return res.status(404).json(Response.error("File Not Found"));
            }
            return res.status(200).json(Response.success("data fetch successfully", file));
        } catch (error) {
            Logs.error('unable to get data:', error);
            res.status(500).json(Response.error("Internal Server Error", error));
        }
    },


    

    /**
   * Download  The Verified  List 
   * @param {*} req 
   * @param {*} res 
   */
    download: async (req, res) => {
        // Check if list id is provided
        const downloadType = req.query.type;
        console.log(downloadType)
        if (!req.params.jobId) {
            res.status(400).send(Response.error("List id is required", {}));
            return;
        }
        try {
            // Download verification result using bouncify api
            const response = await axios({
                method: "POST",
                url: `${process.env.BOUNCIFY_API_URL}/download?jobId=${req.params.jobId}&apikey=${process.env.BOUNCIFY_API_KEY}`,
                responseType: "stream",
                body:
                     { filterResult: [downloadType] },
            });

            console.log(response)
            // Check if response was successful
            if (response.data.success === false) {
                res
                    .status(400)
                    .send(Response.error("Failed to download verification result", {}));
                return;
            }
            res.setHeader(
                "Content-Disposition",
                'attachment; filename="Verification_Result.csv"'
            );
            res.setHeader("Content-Type", "text/csv");
            response.data.pipe(res);
        } catch (err) {
            Logs.error(err);
            res
                .status(400)
                .send(
                    Response.error("There is some  error while downloading report", {})
                );
        }
    },

    /**
     * Validate Single Email Using Bouncify API
     * @param {*} req 
     * @param {*} res 
     */
    validateSingleEmail: async (req, res) => {
        try {
            //  Validation Rules For Request Body
            const validationRules = [
                body('email', 'Email is required').notEmpty().escape(),
                body('email', 'Invalid email format').isEmail(),
            ];

            // Run Validation Rules
            await Promise.all(validationRules.map(async (rule) => await rule.run(req)));
            const errors = validationResult(req);

            // Handle Validation Errors
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error('Invalid Email', errors.array()));
            }
            const { email } = req.body;

            if (!email) {
                return res.status(400).json(Response.error('Email is required'));
            }

            // Check User Has Enough Credit Or NOt
            // console.log(req?.session?.passport?.user);
            const hasCredits = await CreditService.hasEnoughCredits(req?.session?.passport?.user.id, 1);
            if (!hasCredits) {
                return res.status(400).json(Response.error("Insufficient credits"));
            }

            // Call The Service To Validate A Single Email
            const result = await verifySingleEmail(email);
            // const result = false
            // console.log(result);
            // Deduct credits After verification Completed and store the entry
            if (result) {
                await CreditService.deductCredits(
                    req.user.id,
                    1,
                    `Used In Verifying Email: ${email}`,
                    "VERIFIED_EMAIL"
                );

                // Persist single validation entry
                try {
                    await EmailValidation.create({
                        userId: req.user.id,
                        email,
                        status: result?.result || result?.status || '',
                        provider: 'bouncify',
                        usedCredits: 1,
                        result
                    });
                } catch (persistErr) {
                    Logs.error('Error saving EmailValidation entry:', persistErr);
                }
            }

            return res.status(200).json(Response.success('Email validation result', result));
        } catch (err) {
            console.log(err);
            Logs.error("Single Email Verify Error: ", err);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },

    /**
      * Upload The CSV File On Server As Well As IN Bouncify
      * @param {*} req 
      * @param {*} res 
      */
    uploadList: async (req, res) => {
        try {
            const { file } = req;
            if (!file) {
                return res.status(400).json(Response.error(""))
            }
            if (file.size > 10 * 1024 * 1024) { // Limit file size to 10MB
                return res.status(400).json(Response.error("File size exceeds 5MB limit"));
            }
            const formData = new FormData();
            formData.append('local_file', file.buffer, {
                filename: file.originalname,
                contentType: 'text/csv'
            });
            // Upload To Bouncify 
            const bouncifyResponse = await uploadFile(formData);

            // Calculate Total Emails In The File
            const fileContent = file.buffer.toString();
            const totalEmails = (fileContent.match(/@/g) || []).length;

            // Create File Document
            const fileDoc = await EmailList.create({
                userId: req.user.id,
                filename: file.filename,
                listName: file.originalname,
                totalEmails,
                size: file.size,
                status: 'UNPROCESSED',
                uploadedAt: new Date(),
                jobId: bouncifyResponse?.job_id,

            });

            return res.status(201).json(Response.success("File uploaded successfully", fileDoc));

        } catch (error) {
            Logs.error('File upload error:', error);
            return res.status(500).json(Response.error("Internal Server Error"))
        }
    },

    /**
   * Validate Bulk Email Using Bouncify API
    * @param {*} req 
    * @param {*} res 
    */
    validateBulkEmail: async (req, res) => {
        try {
            const { jobId } = req.body;

            if (!jobId) {
                return res.status(400).json(Response.error("Job ID is required"));
            }

            // Check For Valid Job Id
            const existingJob = await EmailList.findOne({ jobId });
            if (!existingJob) {
                return res.status(404).json(Response.error("File Not Found"));
            }

            // Check User Has Enough Credit Or NOt
            const requiredCredits = existingJob.totalEmails
            const hasCredits = await CreditService.hasEnoughCredits(req?.session?.passport?.user.id, requiredCredits);
            if (!hasCredits) {
                return res.status(400).json(Response.error("Insufficient credits"));
            }

            // Ensure job is ready before starting verification
            const currentStatus = await getBulkStatus(jobId);
            if (currentStatus?.status !== 'ready') {
                return res.status(400).json(Response.error("Job is not ready for verification. Please try again when status is 'ready'"));
            }

            // Start Bulk Email Verification
            const result = await startBulkEmailVerification(jobId);

            // Get The Status Of File  
            const listStatus = BouncifyStatus[result.status];

            // Update The File Status In The Database
            const fileDoc = await EmailList.findOneAndUpdate(
                { jobId },
                { status: listStatus },
                { new: true }
            );
            return res.status(200).json(Response.success("verification Started", fileDoc))

        } catch (err) {
            console.log(err)
            Logs.error("Bulk Verification Error: ", err);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },

    /**
    * Get The Status Of Bulk Email List
    * @param {*} req 
    * @param {*} res 
    */
    getStatus: async (req, res) => {
        try {
            const { jobId } = req.query;
            const existingJob = await EmailList.findOne({ jobId: jobId });
            if (!existingJob) {
                Logs.error(`jobId not found in database: ${jobId}`);
                return res.status(404).json(Response.error("File Not Found"));
            }
    
            const response = await getBulkStatus(jobId);
            if (!response || !response.status) {
                Logs.error(`Status not found for jobId: ${jobId}`);
                return res.status(404).json(Response.error("Status not found"));
            }
    
            const updatedStatus = BouncifyStatus[response.status.toLowerCase()] || "UNPROCESSED";
    
            // Deduct credits only when COMPLETED (avoid duplication)
            if (updatedStatus === "COMPLETED" && existingJob.status !== "COMPLETED") {
                await CreditService.deductCredits(
                    req.user.id,
                    response?.verified || 0,
                    `Used In Verifying "${existingJob?.listName}" List`,
                    "VERIFIED_LIST"
                );
            }
    
            const updatedReport = {
                report: {
                    status: response?.status,
                    total: response?.total || 0,
                    verified: response?.verified || 0,
                    pending: response?.pending || 0,
                    analysis: {
                        common_isp: response?.analysis?.common_isp || 0,
                        role_based: response?.analysis?.role_based || 0,
                        disposable: response?.analysis?.disposable || 0,
                        spamtrap: response?.analysis?.spamtrap || 0,
                        syntax_error: response?.analysis?.syntax_error || 0
                    },
                    results: {
                        deliverable: response?.results?.deliverable || 0,
                        undeliverable: response?.results?.undeliverable || 0,
                        accept_all: response?.results?.accept_all || 0,
                        unknown: response?.results?.unknown || 0
                    }
                }
            };
    
            // Update the status and report in DB only if there is a change
            if (updatedStatus !== existingJob.status) {
                const updatedEmailList = await EmailList.findOneAndUpdate(
                    { jobId },
                    {
                        $set: {
                            status: updatedStatus,
                            ...updatedReport
                        }
                    },
                    { new: true }
                );
    
                if (!updatedEmailList) {
                    Logs.error(`Failed to update document for jobId: ${jobId}`);
                    return res.status(404).json(Response.error("Failed to update document"));
                }
                return res.status(200).json(Response.success("Data Fetched Successfully", updatedEmailList));
            } else {
                // If no status change, return existing document info
                return res.status(200).json(Response.success("Data Fetched Successfully", existingJob));
            }
        } catch (error) {
            Logs.error("Error In Fetching List Status: ", error);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },
    /**
     * Get The Status Of Bulk Email List for all entries
     * @param {*} req 
     * @param {*} res 
     */
    bulkGetStatus: async (req, res) => {
        const userId = req?.user?.id;
      
        try {
          // Fetch all email lists for this user - only necessary fields for performance
          const emailLists = await EmailList.find({ userId }, { jobId: 1, status: 1, listName: 1, report: 1 }).lean();
      
          // Process all lists concurrently - await Promise.all
          const results = await Promise.all(
            emailLists.map(async (list) => {
              try {
                const response = await getBulkStatus(list.jobId);
                if (!response || !response.status) {
                  throw new Error(`Status not found for jobId: ${list.jobId}`);
                }
      
                const updatedStatus = BouncifyStatus[response.status.toLowerCase()] || "UNPROCESSED";

                
      
                // Deduct credits only once when status changes to COMPLETED
                if (updatedStatus === "COMPLETED" && list.status !== "COMPLETED") {
                  await CreditService.deductCredits(
                    userId,
                    response?.verified || 0,
                    `Used In Verifying "${list.listName}" List`,
                    "VERIFIED_LIST"
                  );
                }
      
                const updatedReport = {
                    report: {
                        status: response?.status,
                        total: response?.total || 0,
                        verified: response?.verified || 0,
                        pending: response?.pending || 0,
                        analysis: {
                            common_isp: response?.analysis?.common_isp || 0,
                            role_based: response?.analysis?.role_based || 0,
                            disposable: response?.analysis?.disposable || 0,
                            spamtrap: response?.analysis?.spamtrap || 0,
                            syntax_error: response?.analysis?.syntax_error || 0
                        },
                        results: {
                            deliverable: response?.results?.deliverable || 0,
                            undeliverable: response?.results?.undeliverable || 0,
                            accept_all: response?.results?.accept_all || 0,
                            unknown: response?.results?.unknown || 0
                        }
                    }
                };

            
      
                // Update DB if status has changed
                // if (updatedStatus !== list.status) {
                //   const updatedDoc = await EmailList.findOneAndUpdate(
                //     { jobId: list.jobId },
                //     { $set: { status: updatedStatus, ...updatedReport } },
                //     { new: true }
                //   );
                //   return updatedDoc || list;
                // }
                if (updatedStatus !== list.status) {
                    const updatedDoc = await EmailList.findOneAndUpdate(
                        { jobId: list.jobId },
                        {
                            $set: {
                                status: updatedStatus,
                                ...updatedReport
                            }
                        },
                        { new: true }
                    );
                    return updatedDoc || list;                   
                     }
                return list; // No change, return existing
      
              } catch (error) {
                Logs.error(`Failed to update status for jobId ${list.jobId}: ${error.message}`);
                return { jobId: list.jobId, error: error.message };
              }
            })
          );
      
          res.status(200).json(Response.success("Bulk email list statuses updated", results));
      
        } catch (error) {
          Logs.error("Error in bulkGetStatus:", error);
          res.status(500).json(Response.error("Internal Server Error"));
        }
      },


    /**
     * Delete The  Bulk Email List
     * @param {*} req 
     * @param {*} res 
     */
    deleteBulkEmailList: async (req, res) => {
        try {
            // Validation Rule for jobId
            await body('jobId')
                .notEmpty()
                .withMessage('jobId is required')
                .isString()
                .withMessage('jobId must be a valid string')
                .run(req);

            // Check Validation Result
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error('Validation failed', errors.array()));
            }
            const { jobId } = req.body;
            const userId = req?.user?.id || req?.session?.passport?.user?.id;

            // Check if it's a single email validation (starts with 'single_')
            if (jobId.startsWith('single_')) {
                const emailValidationId = jobId.replace('single_', '');
                
                // Check if the email validation exists and belongs to the user
                const emailValidation = await EmailValidation.findOne({
                    _id: emailValidationId,
                    userId: userId
                });

                if (!emailValidation) {
                    return res.status(404).json(Response.error("Email validation not found"));
                }

                // Delete the email validation from database
                await EmailValidation.findByIdAndDelete(emailValidationId);

                return res.status(200).json(Response.success("Email validation deleted successfully"));
            } else {
                // Handle bulk email list deletion
                const list = await EmailList.findOne({
                    jobId: jobId,
                    userId: userId
                });

                if (!list) {
                    return res.status(404).json(Response.error("List not found"));
                }

                // Delete List From Bouncify Server
                const response = await removeBulkEmailList(jobId);
                if (!response || !response.success) {
                    return res.status(404).json(Response.error("Status not found"));
                }
                
                // Delete the list From DataBase
                await EmailList.findByIdAndDelete(list?._id);

                return res.status(200).json(Response.success("List deleted successfully"));
            }

        } catch (error) {
            Logs.error("Error in deleting list: ", error);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },

    /**
     * Move an Email List to a Folder
     */
    moveToFolder: async (req, res) => {
        try {
            await body('jobId').notEmpty().withMessage('jobId is required').run(req);
            await body('folderId').notEmpty().withMessage('folderId is required').run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error('Validation failed', errors.array()));
            }
            const { jobId, folderId } = req.body;
            const userId = req.user.id;

            // Check if it's a single email validation (starts with 'single_')
            if (jobId.startsWith('single_')) {
                const emailValidationId = jobId.replace('single_', '');
                
                // Update the email validation folder
                const updated = await EmailValidation.findOneAndUpdate(
                    { _id: emailValidationId, userId },
                    { folderId },
                    { new: true }
                );
                
                if (!updated) {
                    return res.status(404).json(Response.error('Email validation not found'));
                }

                return res.status(200).json(Response.success('Email validation moved to folder', updated));
            } else {
                // Handle bulk email list
                const updated = await EmailList.findOneAndUpdate(
                    { jobId, userId },
                    { folderId },
                    { new: true }
                );
                
                if (!updated) {
                    return res.status(404).json(Response.error('List not found'));
                }

                return res.status(200).json(Response.success('List moved to folder', updated));
            }
        } catch (error) {
            Logs.error('Error moving list to folder: ', error);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },

    /**
    * Get The Stats Of The  Bulk Email List
    * @param {*} req 
    * @param {*} res 
    */
    getStats: async (req, res) => {
        try {
            const stats = await calculateStats(req.user.id);
            return res.status(200).json(Response.success("Stats fetched successfully", stats));
        } catch (error) {
            Logs.error("Error in fetching stats: ", error);
            return res.status(500).json(Response.error("Error fetching stats"));
        }
    }

};