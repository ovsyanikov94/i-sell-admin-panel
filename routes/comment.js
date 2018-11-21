"use strict";

const express = require('express');
const router = express.Router();

const CommentController = require('../controller/CommentController');

router.post('/comment' , CommentController.AddComment );
router.put('/comment/:id',CommentController.UpdateComment);
router.delete('/comment/:id',CommentController.DeleteComment);
router.get('/comment/list',CommentController.GetComments);

module.exports = router;
