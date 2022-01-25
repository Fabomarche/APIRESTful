import mongoose from "mongoose";
const {Schema, model} = mongoose

export const ChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String, required: true}
}, {timestamp: true})

export const ChatModel = model('Chat', ChatSchema)

