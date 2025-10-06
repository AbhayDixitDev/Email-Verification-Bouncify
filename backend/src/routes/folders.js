const express = require('express');
const router = express.Router();
const FolderController = require('../controllers/backend/FolderController.js');

// Route for getting All Folders
router.get('/', FolderController.getAll);

// Route for creating a new Folder
router.post('/', FolderController.create);

// Route for renaming a Folder
router.patch('/:id', FolderController.rename);

// Route for deleting a Folder
router.delete('/:id', FolderController.remove);

module.exports = router;


