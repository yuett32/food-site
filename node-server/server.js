const express = require('express');
const Stripe = require('stripe');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const serviceAccount = require(process.env.FIREBASE_ADMIN_SDK_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred.';

    if (error.type === 'StripeCardError') {
      // A declined card error
      statusCode = 400;
      errorMessage = `Your card was declined. ${error.message}`;
    } else if (error.type === 'StripeRateLimitError') {
      // Too many requests made to the API too quickly
      statusCode = 429;
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.type === 'StripeInvalidRequestError') {
      // Invalid parameters were supplied to Stripe's API
      statusCode = 400;
      errorMessage = `Invalid request. ${error.message}`;
    } else if (error.type === 'StripeAPIError') {
      // An error occurred internally with Stripe's API
      errorMessage = 'An error occurred with the payment system. Please try again later.';
    } else if (error.type === 'StripeConnectionError') {
      // Some kind of error occurred during the HTTPS communication
      errorMessage = 'A network error occurred. Please try again.';
    } else if (error.type === 'StripeAuthenticationError') {
      // You probably used an incorrect API key
      statusCode = 401;
      errorMessage = 'Authentication with payment system failed. Please contact support.';
    }

    res.status(statusCode).send({ error: errorMessage });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
