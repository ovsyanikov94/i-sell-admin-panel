"use strict";

const express = require('express');
const router = express.Router();

const CategoryController = require('../controller/CategoryController');

router.get('/category/list' , CategoryController.categoriesList );
router.post('/category' , CategoryController.AddCategory );
router.put('/category/:id' , CategoryController.updateCategory );
router.delete('/category/:id' , CategoryController.deleteCategory );

module.exports = router;
