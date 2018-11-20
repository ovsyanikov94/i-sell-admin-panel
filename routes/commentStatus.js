"use strict";

const express = require('express');
const router = express.Router();

const CommentStatusController = require('../controller/CommentStatusController');

router.post('/commentStatus' , CommentStatusController.AddCommentStatus );
router.put('/commentStatus/:id',CommentStatusController.UpdateCommentStatus);
router.delete('/commentStatus/:id',CommentStatusController.DeleteCommentStatus);
router.get('/commentStatus/:id',CommentStatusController.GetCommentStatus);

module.exports = router;
