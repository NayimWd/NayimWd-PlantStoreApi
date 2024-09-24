import express from "express";
import appMiddleware from "./appMiddleware";

const app = express();

// middleware
app.use(appMiddleware)

export { app };
