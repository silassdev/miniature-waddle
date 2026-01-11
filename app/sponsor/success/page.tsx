"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PaymentStatusModal from "../../components/PaymentStatusModal";

export default function SponsorSuccessPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Automatically open the success modal when the page loads
        setIsModalOpen(true);
    }, []);

    const handleClose = () => {
        setIsModalOpen(false);
        router.push('/sponsor'); // Redirect back to sponsor page or home
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
            {/* Background elements can go here if needed to avoid whitespace before modal loads */}
            <PaymentStatusModal
                isOpen={isModalOpen}
                onClose={handleClose}
                type="success"
            />
        </div>
    );
}
