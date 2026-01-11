import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' // Use a recent API version
});

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        // Validate amount
        if (!amount) {
            return NextResponse.json({ message: 'Amount is required' }, { status: 400 });
        }

        // amount expected in USD (string or number). Convert to cents.
        // Ensure it's a valid number
        const numAmount = parseFloat(String(amount));
        if (isNaN(numAmount) || numAmount <= 0) {
            return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
        }

        const unitAmount = Math.round(numAmount * 100);

        const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3001';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'ShepherdAI Sponsorship',
                            description: 'Support the mission of ShepherdAI'
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${domain}/sponsor/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domain}/sponsor`, // Redirect back to sponsor page on cancel
        });

        return NextResponse.json({
            sessionId: session.id,
            publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            url: session.url
        });
    } catch (err: any) {
        console.error("Stripe checkout error:", err);
        return NextResponse.json({ message: err.message || 'Stripe error' }, { status: 500 });
    }
}
