import mongoose, { Schema, model, models } from 'mongoose';

const ChatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'New Conversation' },
    messages: [
        {
            role: { type: String, enum: ['user', 'ai'], required: true },
            text: { type: String, required: true },
            timestamp: { type: Number, default: Date.now },
        }
    ],
}, { timestamps: true });

export const Chat = models.Chat || model('Chat', ChatSchema);
