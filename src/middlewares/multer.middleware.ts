import multer, { StorageEngine } from "multer";
import { Request } from "express";
import { Callback } from "mongoose";
// multer file upload
const storage: StorageEngine = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: Callback
  ) {
    cb(null, "./public/temp");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Callback) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
