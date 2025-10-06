const Logs = require('../../utils/logs-util.js');
const Response = require('../../utils/response-util.js');
const Folder = require('../../models/Folder.js');
const { body, validationResult, param } = require('express-validator');

module.exports = {
    getAll: async (req, res) => {
        try {
            const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: -1 });
            return res.status(200).json(Response.success('Folders fetched', folders));
        } catch (error) {
            Logs.error('Error fetching folders:', error);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },

    create: async (req, res) => {
        try {
            await body('name').notEmpty().withMessage('name is required').run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error('Validation failed', errors.array()));
            }
            const { name, parentId } = req.body;
            const folder = await Folder.create({ userId: req.user.id, name, parentId: parentId || null });
            return res.status(201).json(Response.success('Folder created', folder));
        } catch (error) {
            Logs.error('Error creating folder:', error);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },

    rename: async (req, res) => {
        try {
            await param('id').notEmpty().run(req);
            await body('name').notEmpty().run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error('Validation failed', errors.array()));
            }
            const { id } = req.params;
            const { name } = req.body;
            const updated = await Folder.findOneAndUpdate({ _id: id, userId: req.user.id }, { name }, { new: true });
            if (!updated) return res.status(404).json(Response.error('Folder not found'));
            return res.status(200).json(Response.success('Folder renamed', updated));
        } catch (error) {
            Logs.error('Error renaming folder:', error);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },

    remove: async (req, res) => {
        try {
            await param('id').notEmpty().run(req);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(Response.error('Validation failed', errors.array()));
            }
            const { id } = req.params;
            const deleted = await Folder.findOneAndDelete({ _id: id, userId: req.user.id });
            if (!deleted) return res.status(404).json(Response.error('Folder not found'));
            return res.status(200).json(Response.success('Folder deleted', deleted));
        } catch (error) {
            Logs.error('Error deleting folder:', error);
            return res.status(500).json(Response.error('Internal Server Error'));
        }
    },
};


