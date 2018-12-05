"use strict";

const express = require('express');
const router = express.Router();

const CommentController = require('../controller/Comment/CommentController');
const AccessController = require('../controller/User/AccessController');

router.use( AccessController.CheckAccess );

router.post('/comment' , CommentController.AddComment );
router.put('/updateComment/:id',CommentController.UpdateComment);
router.delete('/deleteComment/:id',CommentController.DeleteComment);
router.get('/comment/list',CommentController.GetComments);

module.exports = router;

