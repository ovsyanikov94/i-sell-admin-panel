"use strict";

const express = require('express');
const router = express.Router();

const CategoryController = require('../controller/CategoryController');

//const AccessController = require('../controller/AccessController');

// router.use( AccessController.CheckAccess );

router.get( '/category/list' , CategoryController.categoriesList );
router.post('/add-category' , AccessController.CheckAccess, CategoryController.AddCategory );
router.put('/update-category' ,AccessController.CheckAccess, CategoryController.updateCategory );
router.delete('/delete-category/:id' ,AccessController.CheckAccess, CategoryController.deleteCategory );

module.exports = router;
