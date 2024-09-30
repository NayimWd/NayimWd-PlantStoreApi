import express from "express";
import appMiddleware from "./appMiddleware";
import routes from "../routes";

const app = express();

// middleware
app.use(...appMiddleware);
// routes
app.use(routes);
// not found path
app.use("*", (req, res) => {
  return res.status(404).json({ message: "router not found" });
});

export { app };
