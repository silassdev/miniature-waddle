export async function submitFeedback({ rating, comment, context }: { rating: number; comment?: string; context?: string }) {
    const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, context }),
    });
    return res.json();
}
