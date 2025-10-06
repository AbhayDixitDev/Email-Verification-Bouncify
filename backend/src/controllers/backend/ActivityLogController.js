const Logs = require('../../utils/logs-util.js');
const Response = require('../../utils/response-util.js');
const ActivityLog = require('../../models/ActivityLog.js');
const { body, validationResult } = require('express-validator');

module.exports = {
    /**
     * Get user activity logs with pagination and filtering
     * @param {*} req 
     * @param {*} res 
     */
    getUserActivityLogs: async (req, res) => {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const moduleName = req.query.module || '';
            const action = req.query.action || '';
            const eventSource = req.query.source || '';

            // Build filter criteria
            const filterCriteria = { user_id: userId };

            if (moduleName) {
                filterCriteria.module_name = { $regex: moduleName, $options: 'i' };
            }

            if (action) {
                filterCriteria.action = action.toUpperCase();
            }

            if (eventSource) {
                filterCriteria.event_source = eventSource.toLowerCase();
            }

            // Get total count for pagination
            const total = await ActivityLog.countDocuments(filterCriteria);
            const totalPages = Math.ceil(total / limit);

            // Get paginated results
            const activityLogs = await ActivityLog.find(filterCriteria)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            // Get action counts for stats
            const actionCounts = await ActivityLog.aggregate([
                { $match: { user_id: userId } },
                { $group: { _id: "$action", count: { $sum: 1 } } }
            ]);

            // Get module counts for stats
            const moduleCounts = await ActivityLog.aggregate([
                { $match: { user_id: userId } },
                { $group: { _id: "$module_name", count: { $sum: 1 } } }
            ]);

            const response = {
                success: true,
                message: "Activity logs fetched successfully",
                data: {
                    activityLogs,
                    total,
                    page,
                    limit,
                    totalPages,
                    stats: {
                        actionCounts: actionCounts.reduce((acc, { _id, count }) => {
                            acc[_id] = count;
                            return acc;
                        }, {}),
                        moduleCounts: moduleCounts.reduce((acc, { _id, count }) => {
                            acc[_id] = count;
                            return acc;
                        }, {})
                    }
                }
            };

            res.status(200).json(response);

        } catch (error) {
            Logs.error("Error fetching activity logs:", error);
            res.status(500).json(Response.error("Internal Server Error"));
        }
    },

    /**
     * Get activity log by ID
     * @param {*} req 
     * @param {*} res 
     */
    getActivityLogById: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const activityLog = await ActivityLog.findOne({
                _id: id,
                user_id: userId
            }).lean();

            if (!activityLog) {
                return res.status(404).json(Response.error("Activity log not found"));
            }

            res.status(200).json(Response.success("Activity log fetched successfully", activityLog));

        } catch (error) {
            Logs.error("Error fetching activity log:", error);
            res.status(500).json(Response.error("Internal Server Error"));
        }
    },

    /**
     * Get activity log statistics
     * @param {*} req 
     * @param {*} res 
     */
    getActivityStats: async (req, res) => {
        try {
            const userId = req.user.id;
            const days = parseInt(req.query.days) || 30;

            // Calculate date range
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Get activity counts by day
            const dailyActivity = await ActivityLog.aggregate([
                {
                    $match: {
                        user_id: userId,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            day: { $dayOfMonth: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                }
            ]);

            // Get action distribution
            const actionDistribution = await ActivityLog.aggregate([
                {
                    $match: {
                        user_id: userId,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: "$action",
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Get module distribution
            const moduleDistribution = await ActivityLog.aggregate([
                {
                    $match: {
                        user_id: userId,
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: "$module_name",
                        count: { $sum: 1 }
                    }
                }
            ]);

            res.status(200).json(Response.success("Activity stats fetched successfully", {
                dailyActivity,
                actionDistribution,
                moduleDistribution,
                period: { days, startDate, endDate }
            }));

        } catch (error) {
            Logs.error("Error fetching activity stats:", error);
            res.status(500).json(Response.error("Internal Server Error"));
        }
    }
};
