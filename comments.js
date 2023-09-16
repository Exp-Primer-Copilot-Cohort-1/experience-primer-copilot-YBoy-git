// create web server
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// POST /comments
router.post('/', commentsController.create);

// DELETE /comments/:id
router.delete('/:id', commentsController.destroy);

module.exports = router;
