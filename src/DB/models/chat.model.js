

import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    messages: [{
        body: { type: String, required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        sentAt: { type: Date, default: Date.now }
    }]
}, 
{ timestamps: true });

export const chatmodel=mongoose.models.chat||mongoose.model('chat',chatSchema)