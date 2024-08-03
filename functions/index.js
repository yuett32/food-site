/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions');
const stripe = require('stripe')('your-secret-key');

exports.createPayment = functions.https.onRequest(async (req, res) => {
  const { token } = req.body;

  try {
    const charge = await stripe.charges.create({
      amount: 1000, // Amount in cents
      currency: 'usd',
      source: token,
      description: 'Sample Charge'
    });

    res.status(200).send({ success: charge });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
