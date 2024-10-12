import { Document } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    phoneNumber: string,
    role: "user" | "admin",
    avatar: string,
    refreshToken: string,
    resetPasswordToken?: string,
  resetPasswordExpire?: Date,
    // for mathods
  isPasswordCorrect(password: string): Promise<boolean>,
  generateAccessToken(): Promise<string>,
  generateRefreshToken(): Promise<string>,
  generatePasswordResetToken():string,
  
}