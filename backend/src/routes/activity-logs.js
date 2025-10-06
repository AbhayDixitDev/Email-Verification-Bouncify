const express = require('express');
const ActivityLogController = require('../controllers/backend/ActivityLogController.js');
const router = express.Router();

// Routes for fetching user activity logs
router.get("/", ActivityLogController.getUserActivityLogs);

// Routes for fetching activity log by ID
router.get("/:id", ActivityLogController.getActivityLogById);

// Routes for fetching activity statistics
router.get("/stats/overview", ActivityLogController.getActivityStats);

module.exports = router;
