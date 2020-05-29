const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

// @route   GET /
// @desc    Get all products
// @access  Public
router.get('/', shopController.getIndex);

// @route   GET /products
// @desc    Get all products
// @access  Public
router.get('/products', shopController.getProducts);

// @route   GET /products
// @desc    Get a certain product by id
// @access  Public
router.get('/products/:productId', shopController.getProduct);

// @route   GET /cart
// @desc    Get products added in cart by a user
// @access  Public
router.get('/cart', shopController.getCart);

// @route   POST /cart
// @desc    For users to add a product in a cart
// @access  Public
router.post('/cart', shopController.postCart);

// @route   POST /cart
// @desc    Removes a product from the cart
// @access  Public
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// @route   POST /orders
// @desc    Consolidate all products in cart to orders collection
// @access  Public
router.post('/create-order', shopController.postOrder);

// @route   GET /orders
// @desc    Get all products in orders collection by user id
// @access  Public
router.get('/orders', shopController.getOrders);

module.exports = router;
