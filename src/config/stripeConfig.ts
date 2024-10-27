import Stripe from "stripe";

// initialize stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-09-30.acacia',
})


