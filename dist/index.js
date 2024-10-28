"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db"));
const app_1 = require("./app/app");
// dotenv configure
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
// Middleware
app_1.app.use(express_1.default.json());
// Database connection
const startServer = async () => {
    try {
        // Database connection
        await (0, db_1.default)();
        app_1.app.listen(PORT, () => {
            console.log("Server running on port:", PORT);
        });
    }
    catch (err) {
        console.log("MongoDB connection failed!!", err);
    }
};
startServer();
