import { Router } from "express";
import { veryfyJWT } from "../middlewares/auth.middleware";
import { downloadInvoicePDF, getAllInvoice, getSingleInvoice } from "../controllers/invoice";

const router = Router();

interface IInvoiceRoutes {
    get_single_invoice : "/get_single_invoice",
    get_all_invoice: "/get_all_invoice",
    download_invoice: "/download_invoice"
}

const InvoiceRoutes: IInvoiceRoutes = {
    get_single_invoice: "/get_single_invoice",
    get_all_invoice: "/get_all_invoice",
    download_invoice: "/download_invoice"
}

// get single invoice
router.route(InvoiceRoutes.get_single_invoice).get(veryfyJWT, getSingleInvoice);
// get all invoice
router.route(InvoiceRoutes.get_all_invoice).get(veryfyJWT, getAllInvoice);
// download invoice
router.route(InvoiceRoutes.download_invoice).get(veryfyJWT, downloadInvoicePDF)

export default router;