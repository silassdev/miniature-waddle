"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentStatusModal from "../../components/PaymentStatusModal";

function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'success' | 'failure' | null>(null);

    useEffect(() => {
        const statusParam = searchParams.get('status');

        if (statusParam === 'successful' || statusParam === 'completed') {
            setStatus('success');
        } else {
            setStatus('failure');
        }
    }, [searchParams]);

    const handleClose = () => {
        if (status === 'success') {
            router.push('/');
        } else {
            router.push('/sponsor');
        }
    };

    if (!status) return <div className="min-h-screen bg-[var(--background)]" />;

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <PaymentStatusModal
                isOpen={true}
                onClose={handleClose}
                type={status}
            />
        </div>
    );
}

export default function FlutterwaveCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
            <CallbackContent />
        </Suspense>
    );
}
