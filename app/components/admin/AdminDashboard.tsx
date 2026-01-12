"use client";
import { useEffect, useState } from "react";

type FeedbackItem = {
    _id: string;
    userEmail?: string;
    rating: number;
    comment?: string;
    context?: string;
    createdAt: string;
    status: string;
};

export default function AdminDashboard() {
    const [items, setItems] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/admin/feedback");
        const j = await res.json();
        setItems(j.items || []);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    async function updateStatus(id: string, status: string) {
        await fetch("/api/admin/feedback", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        load();
    }

    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Feedback</h1>
            {loading ? <div>Loading…</div> : null}
            <div className="space-y-4">
                {items.map((it) => (
                    <div key={it._id} className="card p-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm text-[var(--muted)]">
                                    {new Date(it.createdAt).toLocaleString()} • {it.userEmail ?? "anonymous"}
                                </div>
                                <div className="mt-2">
                                    <strong>Rating:</strong> {it.rating} / 5
                                </div>
                                {it.comment ? <p className="mt-2">{it.comment}</p> : null}
                                {it.context ? <pre className="mt-2 text-xs bg-[var(--card)] p-2 rounded">{it.context}</pre> : null}
                            </div>

                            <div className="flex flex-col gap-2">
                                <select defaultValue={it.status} onChange={(e) => updateStatus(it._id, e.target.value)}>
                                    <option value="new">new</option>
                                    <option value="reviewed">reviewed</option>
                                    <option value="actioned">actioned</option>
                                    <option value="dismissed">dismissed</option>
                                </select>
                                <button onClick={() => navigator.clipboard.writeText(it._id)} className="text-xs">Copy ID</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
