import 'express-serve-static-core';
import 'multer'; // Import Multer types

declare global {
  namespace Express {
    // Use the existing Multer.File type instead of redefining
    interface Request {
      files?: {
        [fieldname: string]: Multer.File[]; // Use Multer's built-in File type
      } | Multer.File[]; // Allow for both an array of files or a map of file arrays
    }
  }
}