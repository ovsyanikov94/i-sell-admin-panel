"use strict";

const express = require('express');
const router = express.Router();

const CommentTypeController = require('../controller/CommentTypeController');

router.post('/commentType' , CommentTypeController.AddCommentType );
router.put('/commentType/:id',CommentTypeController.UpdateCommentType);
router.delete('/commentType/:id',CommentTypeController.DeleteCommentType);
router.get('/commentType/:id',CommentTypeController.GetCommentsType);

module.exports = router;
