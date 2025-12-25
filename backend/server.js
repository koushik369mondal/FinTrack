// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";

import transactionsRouter from "./src/routes/transactions.route.js";
import productsRouter from "./src/routes/products.route.js";

dotenv.config();

const app = express();

// Middleware 
app.use(express.json());
app.use(rateLimiter);

// Custom middleware to log request method
// app.use((req, res, next) => {
//     console.log("Hey we hit a request, the method is", req.method);
//     next();
// })

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("FinTrack Backend is running");
});

app.use("/api/transactions", transactionsRouter);
app.use("/api/products", productsRouter);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`);
    });
});
