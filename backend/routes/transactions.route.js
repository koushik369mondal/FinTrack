import express from 'express';
import { sql } from '../config/db.js';
import { createTransaction, getTransactionsByUserId } from '../controllers/transactions.controller.js';

const router = express.Router();

router.get("/:userId", getTransactionsByUserId);

router.post("/", createTransaction);

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid transaction ID" });
        }

        const result = await sql`
            DELETE FROM transactions 
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({
            message: "Transaction deleted successfully",
            transaction: result[0],
        });
    } catch (error) {
        console.log("Error deleting the transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/summary/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance
            FROM transactions
            WHERE user_id = ${userId}
        `

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income
            FROM transactions
            WHERE user_id = ${userId} AND amount > 0
        `

        const expenseResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses
            FROM transactions
            WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses
        });

    } catch (error) {
        console.log("Error fetching transaction summary:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;