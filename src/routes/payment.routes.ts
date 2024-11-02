import express, { Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware";
import { createPaymentIntent } from "../controllers/payment/payment.controller";
import { handleStripeWebhook } from "../controllers/payment/handleStripeWebhook";

const router = Router();

interface IPayment {
    create_payment: "/payment_intents",
    stripe_web_hook: "/stripe-webhook"
}

const payment_routes: IPayment = {
    create_payment: "/payment_intents",
    stripe_web_hook: "/stripe-webhook"
}

// create payment
router.route(payment_routes.create_payment).post(createPaymentIntent)
router.route(payment_routes.stripe_web_hook).post( express.raw({ type: 'application/json' }), handleStripeWebhook)


export default router;