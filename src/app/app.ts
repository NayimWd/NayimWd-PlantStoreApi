import express, { Request, Response } from "express";
import appMiddleware from "./appMiddleware";
import routes from "../routes";

const app = express();

// middleware
app.use(...appMiddleware);

// routes
app.use(routes);
// not found path
app.use("*", (req: Request, res: Response) => {
  return res.status(404).json({ message: "router not found" });
});

export { app };
