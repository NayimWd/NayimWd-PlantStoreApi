import { IUser } from "./userTypes";

declare global {
    namespace Express {
      interface Request {
        user?: IUser; // Optional typing for the user object
      }
    }
  }