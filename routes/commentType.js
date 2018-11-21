"use strict";

const express = require('express');
const router = express.Router();

const CommentTypeController = require('../controller/CommentTypeController');

router.get('/commentType/list',CommentTypeController.GetCommentsType);

module.exports = router;
