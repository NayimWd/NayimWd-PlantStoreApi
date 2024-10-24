import mongoose, { Schema } from "mongoose";
import { IInvoice } from "../../types/productTypes";

const invoiceSchema: Schema<IInvoice> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
      default: function () {
        // Generate unique invoice number based on timestamp or other strategy
        return `INV-${Date.now()}`;
      },
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for invoice"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: function () {
        return this.amount + this.tax - this.discount;
      },
    },
    dueDate: {
      type: Date,
      default: function () {
        const invoiceDate = this.invoiceDate || Date.now();
        return new Date(invoiceDate.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from invoice date
      },
    },
    status: {
      type: String,
      enum: ["PAID", "PENDING", "OVERDUE"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Delivery = mongoose.model<IInvoice>("Delivery", invoiceSchema);
