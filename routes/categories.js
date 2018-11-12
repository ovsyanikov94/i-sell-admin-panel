"use strict";

const express = require('express');
const router = express.Router();

const CategoryController = require('../controller/CategoryController');

router.get('/category/list' , CategoryController.categoriesList );
router.post('/add-category' , CategoryController.AddCategory );
router.put('/update-category' , CategoryController.updateCategory );
router.delete('/delete-category' , CategoryController.deleteCategory );

module.exports = router;
