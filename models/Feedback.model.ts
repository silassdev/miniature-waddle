import mongoose, { Document, Model } from "mongoose";

export interface IFeedback extends Document {
    userId?: string | null;
    userEmail?: string | null;
    rating: number;
    comment?: string;
    context?: string;
    createdAt: Date;
    status: "new" | "reviewed" | "actioned" | "dismissed";
}

const FeedbackSchema = new mongoose.Schema<IFeedback>({
    userId: { type: String, default: null },
    userEmail: { type: String, default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    context: { type: String, default: "" },
    createdAt: { type: Date, default: () => new Date() },
    status: { type: String, default: "new", enum: ["new", "reviewed", "actioned", "dismissed"] },
});

// Avoid model overwrite in dev HMR
const Feedback: Model<IFeedback> = (mongoose.models?.Feedback as Model<IFeedback>) || mongoose.model<IFeedback>("Feedback", FeedbackSchema);

export default Feedback;
