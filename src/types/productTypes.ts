import mongoose, { Document } from "mongoose";
// product type
export interface Iproduct extends Document {
  title: string;
  description: string;
  category: mongoose.Types.ObjectId;
  size: "S" | "M" | "L" | "XL" | "standard";
  price: number;
  stock: number;
  isActive: boolean;
  photo: string;
}
// review type
export interface IReview extends Document {
  ratingBy: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: number;
  numberOfRatings: number;
  averageRating: number;
  comment: string;
}

// category type
export interface ICategory extends Document {
  name: "Flower" | "Fruit" | "Herb" | "Indoor" | "Garden";
}
// product category type
export interface IProductCategory extends Document {
  productId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
}

export interface IWishlist extends Document {
  listedBy: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
}

export interface ICart_Item extends Document {
  productId: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface ICart extends Document {
  addedBy: mongoose.Types.ObjectId;
  cartItems: [mongoose.Types.ObjectId];
  numberOfItem: number;
  totalPrice: number;
}

export interface IShippingInfo extends Document {
  contactNumber: number;
  city: string;
  street: string;
  zipCode: number;
  description?: string;
}

export interface IOrderItem extends Document {
  productId: mongoose.Types.ObjectId;
  price: Number;
  qty: Number;
  totalPrice: Number;
}

export interface IOrder extends Document {
  orderdBy: mongoose.Types.ObjectId;
  orderItems: [IOrderItem];
  subTotal: number;
  shippingCharge: number;
  total: number;
  shippingInfo: mongoose.Types.ObjectId;
  OrderStatus: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
}

export interface IPayment extends Document {
  price: number;
  orderId: mongoose.Types.ObjectId;
  paymentBy: mongoose.Types.ObjectId;
}

export interface IInvoice extends Document {
  user: mongoose.Types.ObjectId;
  OrderId: mongoose.Types.ObjectId;
  invoiceDate: Date;
  amount: number;
  dueDate: Date;
}
