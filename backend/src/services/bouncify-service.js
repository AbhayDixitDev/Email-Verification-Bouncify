const axios = require('axios');
require('dotenv').config();
const mongoose = require("mongoose");
const EmailList = require('../models/EmailList.js');
const EmailValidation = require('../models/EmailValidation.js');

const BOUNCIFY_API_URL = process.env.BOUNCIFY_API_URL
const BOUNCIFY_API_KEY = process.env.BOUNCIFY_API_KEY


// Validate Email Using Bouncify API
const verifySingleEmail = async (email) => {
    try {
        const response = await axios.get(
            `${BOUNCIFY_API_URL}/verify?apikey=${BOUNCIFY_API_KEY}&email=${email}`
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(
                `Bouncify API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown Error'}`
            );
        }
        throw new Error('Unexpected Error During Email Validation');
    }
};

// Upload CSV File In Bouncify Server
const uploadFile = async (formData) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${BOUNCIFY_API_URL}/bulk`,
            params: {
                apikey: BOUNCIFY_API_KEY
            },
            data: formData,
            headers: {
                ...formData.getHeaders()
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(
                `Bouncify API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown Error'}`
            );
        }
        throw new Error('Unexpected Error During List Upload');
    }
};

// Validate Bulk Email Using Bouncify API
const startBulkEmailVerification = async (jobId) => {
    try {
        const response = await axios.patch(
            `${BOUNCIFY_API_URL}/bulk/${jobId}?apikey=${BOUNCIFY_API_KEY}`,
            { action: 'start' },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            const apiMsg = error.response.data?.message || error.response.data?.result || 'Unknown Error';
            throw new Error(
                `Bouncify API Error: ${error.response.status} - ${apiMsg}`
            );
        }
        throw new Error('Unexpected Error During Bulk Email Validation');
    }
}

// Get Status Of Bulk Email List
const getBulkStatus = async (jobId) => {
    try {
        const response = await axios.get(`${BOUNCIFY_API_URL}/bulk/${jobId}?apikey=${BOUNCIFY_API_KEY}`)
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(
                `Bouncify API Error: ${error.response.status} - ${error.response.data?.result || 'Unknown Error'}`
            );
        }
        throw new Error('Unexpected Error Occurred While Retrieving Bulk Email List Status');
    }
}

// Delete The Bulk Email List
const removeBulkEmailList = async (jobId) => {
    try {
        const response = await axios.delete(`${BOUNCIFY_API_URL}/bulk/${jobId}?apikey=${BOUNCIFY_API_KEY}`)
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(
                `Bouncify API Error: ${error.response.status} - ${error.response.data?.result || 'Unknown Error'}`
            );
        }
        throw new Error('Unexpected Error Occurred While Deleting the Bulk Email List ');
    }
}

// download BulkEmailList fron bouncify server
const downloadBulkEmailList = async (jobId) => {
    try {
        const response = await axios.post(`${BOUNCIFY_API_URL}/download/jobId=${jobId}?apikey=${BOUNCIFY_API_KEY}`)
        return response.data
    } catch (error) {
        if (error.response) {
            throw new Error(
                `Bouncify API Error: ${error.response.status} - ${error.response.data?.result || 'Unknown Error'}`
            );
        }
        throw new Error('Unexpected Error Occurred While Deleting the Bulk Email List ');
    }
}

// Get The Stats Of The  Bulk Email List
const calculateStats = async (userId) => {
    try {
        const [aggregateStats, uploadedListsCount, singleValidationsCount] = await Promise.all([
            EmailList.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalEmails: { $sum: "$totalEmails" },
                        deliverable: { $sum: "$report.results.deliverable" },
                        undeliverable: { $sum: "$report.results.undeliverable" },
                        acceptAll: { $sum: "$report.results.accept_all" },
                        unknown: { $sum: "$report.results.unknown" }
                    }
                },
            ]),
            EmailList.countDocuments({ userId: new mongoose.Types.ObjectId(userId) }),
            EmailValidation.countDocuments({ userId: new mongoose.Types.ObjectId(userId) })
        ]);

        const base = aggregateStats[0] || {
            totalEmails: 0,
            deliverable: 0,
            undeliverable: 0,
            acceptAll: 0,
            unknown: 0
        };

        return {
            ...base,
            totalLists: uploadedListsCount,
            totalSingleValidations: singleValidationsCount,
            totalListsCombined: uploadedListsCount + singleValidationsCount
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    verifySingleEmail,
    uploadFile,
    startBulkEmailVerification,
    getBulkStatus,
    removeBulkEmailList,
    calculateStats,
    downloadBulkEmailList
};
