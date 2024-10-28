import { Invoice } from "../../models/paymentModel/invoice.model";
import { ApiError } from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import PDFDocument from "pdfkit";

export const downloadInvoicePDF = asyncHandler(async(req, res)=>{
    const userId = (req as any).user._id;
    if (!userId) {
      throw new ApiError(400, "Invalid token, user not found");
    }
  
    // get invoice ID
    const { invoiceId } = req.params;
    if (!invoiceId) {
      throw new ApiError(400, "Invoice Id required");
    }

    const invoices = await Invoice.findOne({_id: invoiceId, user: userId})

    if (!invoices) {
        throw new ApiError(404, "Invoice not found or you don't have access to it");
      }

    const doc = new PDFDocument();

    const fileName = `all_invoices_${userId}.pdf`;

  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  res.setHeader("Content-Type", "application/pdf");

  // Pipe the PDF to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(20).text(`All Invoices for User: ${userId}`, { align: "center" });
  doc.moveDown();

  (invoices as any).forEach((invoice: any) => {
    doc.fontSize(16).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${invoice.invoiceDate}`);
    doc.text(`Customer Name: ${invoice.userName}`);
    doc.text(`Amount: $${invoice.amount.toFixed(2)}`);
    doc.text(`Tax: $${invoice.tax.toFixed(2)}`);
    doc.text(`Discount: $${invoice.discount.toFixed(2)}`);
    doc.text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`);
    doc.text(`Due Date: ${invoice.dueDate}`);
    doc.text(`Status: ${invoice.status}`);
    doc.moveDown();
  });

  doc.end();
})