const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');
const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Create payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

// Get user payment history
router.get('/history', paymentController.getUserPayments);

// Admin only routes
router.use(authController.restrictTo('admin'));

// Process refunds
router.post('/refund', paymentController.createRefund);

// Special route for Stripe webhooks - not protected by auth middleware
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

module.exports = router; 