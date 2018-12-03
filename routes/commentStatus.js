"use strict";

const express = require('express');
const router = express.Router();

const CommentStatusController = require('../controller/Comment/CommentStatusController');

router.get('/commentStatus/list',CommentStatusController.GetCommentStatus);

module.exports = router;
