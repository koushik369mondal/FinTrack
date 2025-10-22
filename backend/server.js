// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Custom middleware to log request method
// app.use((req, res, next) => {
//     console.log("Hey we hit a request, the method is", req.method);
//     next();
// })

const PORT = process.env.PORT || 5000;

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`
        // DECIMAL(10, 2) means = 10 digits total, 2 after decimal like 99999999.99

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1); // status code 1 means failure, 0 means success
    }
}

app.get("/", (req, res) => {
    res.send("FinTrack Backend is running");
})

app.get("/api/transactions/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await sql`
            SELECT * FROM transactions
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;
        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error fetching transactions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

app.post("/api/transactions", async (req, res) => {
    //user_id, title, amount, category
    try {
        const { user_id, title, amount, category } = req.body;

        if (!user_id || !title || !amount || !category === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;

        console.log("Transaction created:", transaction[0]);
        res.status(201).json({ message: "Transaction created successfully", transaction: transaction[0] });

    } catch (error) {
        console.log("Error creating the transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete("/api/transactions/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await sql`
            DELETE FROM transactions 
            WHERE id = ${id}
            RETURNING *
        `
        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
    } catch (error) {
        console.log("Error deleting the transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT:${PORT}`);
    });
});