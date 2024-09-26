import { Document } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    phoneNumber: number,
    avatar: string,
    role: "user" | "admin",
    refreshToken: string
}