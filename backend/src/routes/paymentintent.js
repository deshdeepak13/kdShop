import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import authMiddleware from "../middlewares/verifyTokenMiddleware.js";
// import cors from 'cors';
import Stripe from 'stripe';

dotenv.config();

const app = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
app.post('/create-payment-intent',authMiddleware, async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).send({
            error: error.message,
        });
    }
});

export default app;
