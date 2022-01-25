import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true, default: 'anon' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    avatar: { type: String, required: true }
}, { timestamps: true })

export const UserModel = model('User', UserSchema)