import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types/userTypes";
import bctypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (vemail: string) {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            vemail
          );
        },
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "number is required"],
      trim: true,
      minLength: 5,
      maxLength: 12,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String, // cloudinary url
      required: [true, "avatar is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// encrypting password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bctypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bctypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function (): Promise<string> {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = async function (): Promise<string> {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {};

export const User = mongoose.model<IUser>("User", userSchema);
