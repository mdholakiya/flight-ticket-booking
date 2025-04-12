import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual publishable key from Stripe dashboard
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const stripePromise = loadStripe(stripePublicKey);

export const STRIPE_CONFIG = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#2563eb',
    },
  },
}; 