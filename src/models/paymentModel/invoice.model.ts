import mongoose, { Schema } from "mongoose";
import { IInvoice } from "../../types/productTypes";

const invoiceSchema: Schema<IInvoice> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    OrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, "amount is required for invoice"],
    },
    dueDate: {
      type: Date,
      default: function () {
        // Set due date 3 days after the invoice date
        const invoiceDate = this.invoiceDate || Date.now();
        return new Date(invoiceDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);

export const Delivery = mongoose.model<IInvoice>("Delivery", invoiceSchema);
