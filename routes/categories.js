"use strict";

const express = require('express');
const router = express.Router();

const CategoryController = require('../controller/Lot/CategoryController');

const AccessController = require('../controller/User/AccessController');

// router.use( AccessController.CheckAccess );

router.get( '/category/list' , CategoryController.categoriesList );
router.post('/add-category' , CategoryController.AddCategory );
router.put('/update-category' , CategoryController.updateCategory );
router.delete('/delete-category/:id' , CategoryController.deleteCategory );

module.exports = router;
