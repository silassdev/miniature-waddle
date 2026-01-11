import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();

        if (!process.env.FLW_SECRET_KEY) {
            return NextResponse.json({ message: 'Flutterwave keys not configured' }, { status: 500 });
        }

        const tx_ref = `shepherdai_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3001';

        const body = {
            tx_ref,
            amount: String(amount || '50'),
            currency: 'NGN',
            redirect_url: `${domain}/sponsor/flutterwave-callback`,
            customer: {
                email: 'guest@shepherdai.com',
                name: 'ShepherdAI Supporter',
            },
            customizations: {
                title: 'ShepherdAI Sponsorship',
                description: 'Support ShepherdAI Mission',
                logo: `${domain}/logo.png`,
            },
        };

        const res = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (data.status !== 'success') {
            console.error("Flutterwave error:", data);
            return NextResponse.json({ message: data.message || 'Flutterwave error' }, { status: 500 });
        }

        // The checkout link is in data.data.link
        return NextResponse.json({ checkoutUrl: data.data.link });
    } catch (err: any) {
        console.error("Flutterwave API error:", err);
        return NextResponse.json({ message: err.message || 'Payment initialization failed' }, { status: 500 });
    }
}
