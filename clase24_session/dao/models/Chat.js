import mongoose from "mongoose";
const {Schema, model} = mongoose

export const ChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String, required: true}
}, {timestamps: true})


export const ChatModel = model('Chat2', ChatSchema)

