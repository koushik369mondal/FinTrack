// const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRouter from "./routes/transactions.route.js";
import productsRouter from "./routes/products.route.js";

import job from "./config/cron.js";

dotenv.config();

const app = express();

// Start the cron job
if(process.env.NODE_ENV === "production") job.start();

// Middleware 
app.use(express.json());
app.use(rateLimiter);

// Custom middleware to log request method
// app.use((req, res, next) => {
//     console.log("Hey we hit a request, the method is", req.method);
//     next();
// })

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "FinTrack API is healthy" });
})

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
