"use strict";

const express = require('express');
const router = express.Router();

const CommentController = require('../controller/CommentController');

router.post('/comment' , CommentController.AddComment );
router.put('/updateComment/:id',CommentController.UpdateComment);
router.delete('/deleteComment/:id',CommentController.DeleteComment);
router.get('/comment/list',CommentController.GetComments);

module.exports = router;
