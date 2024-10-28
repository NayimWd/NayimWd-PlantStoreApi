import { Invoice } from "../../models/paymentModel/invoice.model";
import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";

export const getSingleInvoice = asyncHandler(async (req, res) => {
  const userId = (req as any).user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid token, user not found");
  }

  // get invoice ID
  const { invoiceId } = req.params;
  if (!invoiceId) {
    throw new ApiError(400, "Invoice Id required");
  }

  // find invoice by invoice id and user id
  const invoice = await Invoice.findOne({ _id: invoiceId, user: userId });
  if (!invoice) {
    throw new ApiError(404, "No invoice found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, invoice, "Invoice fund successfully"));
});

// get all invoice of user
export const getAllInvoice = asyncHandler(async (req, res) => {
  const userId = (req as any).user._id;
  if (!userId) {
    throw new ApiError(400, "Invalid token, user not found");
  }

  // get invoice by user id
  const invoice = await Invoice.find({ user: userId });

  if (!invoice || invoice.length === 0) {
    throw new ApiError(404, "No invoice found for this user");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        count: invoice.length,
        invoice,
      },
      "Invoice found successfully"
    )
  );
});
