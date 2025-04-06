const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const db = require('../db');
const logger = require('../utils/logger');

/**
 * Create a payment intent for property booking deposit
 */
exports.createPaymentIntent = catchAsync(async (req, res, next) => {
  const { amount, propertyId, currency = 'gbp', paymentType } = req.body;
  const userId = req.user.id;

  if (!amount || !propertyId || !paymentType) {
    return next(new AppError('Amount, property ID, and payment type are required', 400));
  }

  // Create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents/pence
    currency,
    metadata: {
      propertyId,
      userId,
      paymentType // 'deposit', 'rent', etc.
    }
  });

  // Store payment intent in database
  await db('payments').insert({
    user_id: userId,
    property_id: propertyId,
    payment_type: paymentType,
    amount,
    currency,
    stripe_payment_intent_id: paymentIntent.id,
    status: 'pending'
  });

  res.status(200).json({
    status: 'success',
    clientSecret: paymentIntent.client_secret
  });
});

/**
 * Handle Stripe webhook events
 */
exports.handleWebhook = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error(`Webhook error: ${err.message}`);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle specific events
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

/**
 * Process successful payments
 */
const handleSuccessfulPayment = async (paymentIntent) => {
  const { propertyId, userId, paymentType } = paymentIntent.metadata;
  
  try {
    // Update payment status in database
    await db('payments')
      .where({ stripe_payment_intent_id: paymentIntent.id })
      .update({ 
        status: 'completed',
        completed_at: db.fn.now()
      });

    // If this was a deposit payment, update property booking status
    if (paymentType === 'deposit') {
      await db('bookings')
        .where({ 
          property_id: propertyId,
          user_id: userId,
          status: 'pending_payment'
        })
        .update({ 
          status: 'deposit_paid',
          updated_at: db.fn.now()
        });
    }
    
    // If this was a rent payment, record it
    if (paymentType === 'rent') {
      await db('rent_payments').insert({
        property_id: propertyId,
        user_id: userId,
        payment_id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert back from cents/pence
        payment_date: db.fn.now()
      });
    }

    logger.info(`Payment succeeded: ${paymentIntent.id}`);
  } catch (error) {
    logger.error(`Error processing successful payment: ${error.message}`);
  }
};

/**
 * Process failed payments
 */
const handleFailedPayment = async (paymentIntent) => {
  try {
    await db('payments')
      .where({ stripe_payment_intent_id: paymentIntent.id })
      .update({ 
        status: 'failed',
        updated_at: db.fn.now()
      });
    
    logger.warn(`Payment failed: ${paymentIntent.id}`);
  } catch (error) {
    logger.error(`Error processing failed payment: ${error.message}`);
  }
};

/**
 * Get payment history for a user
 */
exports.getUserPayments = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  
  const payments = await db('payments')
    .where({ user_id: userId })
    .join('properties', 'payments.property_id', 'properties.id')
    .select(
      'payments.*',
      'properties.title as property_title',
      'properties.address'
    )
    .orderBy('payments.created_at', 'desc');
  
  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: {
      payments
    }
  });
});

/**
 * Create refund for a payment
 */
exports.createRefund = catchAsync(async (req, res, next) => {
  const { paymentId, amount, reason } = req.body;
  
  // Admin only
  if (req.user.role !== 'admin') {
    return next(new AppError('Only administrators can process refunds', 403));
  }
  
  const payment = await db('payments')
    .where({ id: paymentId })
    .first();
  
  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }
  
  if (payment.status !== 'completed') {
    return next(new AppError('Only completed payments can be refunded', 400));
  }
  
  // Process refund through Stripe
  const refund = await stripe.refunds.create({
    payment_intent: payment.stripe_payment_intent_id,
    amount: amount ? Math.round(amount * 100) : undefined, // Optional partial refund
    reason: reason || 'requested_by_customer'
  });
  
  // Record refund in database
  await db('refunds').insert({
    payment_id: paymentId,
    amount: amount || payment.amount,
    reason,
    stripe_refund_id: refund.id,
    status: refund.status,
    created_by: req.user.id
  });
  
  // Update payment status
  await db('payments')
    .where({ id: paymentId })
    .update({ 
      status: amount && amount < payment.amount ? 'partially_refunded' : 'refunded',
      updated_at: db.fn.now()
    });
  
  res.status(200).json({
    status: 'success',
    data: {
      refund
    }
  });
}); 