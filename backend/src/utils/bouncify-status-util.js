const BouncifyStatus = {
    "preparing": "UNPROCESSED",      // Preparing the job, not started yet
    "ready": "PROCESSING",            // Ready to start or just started processing
    "verifying": "PROCESSING",        // Verification in progress
    "completed": "COMPLETED",         // Verification finished successfully
    "failed": "FAILED"                // Verification failed
};


module.exports = BouncifyStatus