import { Document } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    address: string,
    city: string,
    phoneNumber: number,
    avatar: string,
    role: "user" | "admin",
    refreshToken: string
}