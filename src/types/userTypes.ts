import { Document } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: "user" | "admin",
    avatar: string,
    refreshToken: string
}