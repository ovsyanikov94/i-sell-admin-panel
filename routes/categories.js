"use strict";

const express = require('express');
const router = express.Router();

const CategoryController = require('../controller/CategoryController');

router.post('/category' , CategoryController.AddCategory );

module.exports = router;
