"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentStatusModal from "../../components/PaymentStatusModal";

export default function SponsorSuccessPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
        router.push('/sponsor');
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            <PaymentStatusModal
                isOpen={isModalOpen}
                onClose={handleClose}
                type="success"
            />
        </div>
    );
}
