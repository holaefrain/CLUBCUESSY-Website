require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// IMPORTANT: Replace with your actual Stripe secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(__dirname));

// Create Payment Intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, email, name } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: {
        customer_email: email,
        customer_name: name
      },
      // Optional: Add receipt email
      receipt_email: email,
      description: 'CLUBCUESSY Event Ticket Purchase'
    });

    // Send the client secret to the client
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment success webhook (optional but recommended)
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // Replace with your webhook secret from Stripe Dashboard
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Here you can:
      // - Send confirmation email
      // - Update database
      // - Generate ticket
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Serve payment page
app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'Payment/payment.html'));
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Payment page: http://localhost:${PORT}/payment`);
});