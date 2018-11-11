"use strict";

const express = require('express');
const router = express.Router();

const CommentController = require('../controller/CommentController');

router.post('/comment' , CommentController.AddComment );
router.update('/comment/:id',CommentController.UpdateComment);
router.delete('/comment/:id',CommentController.DeleteComment);
router.get('/comment/:id',CommentController.GetComments);

module.exports = router;
