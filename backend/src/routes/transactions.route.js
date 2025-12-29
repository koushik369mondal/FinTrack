import express from 'express';
import { sql } from '../config/db.js';
import { createTransaction, deleteTransaction, getTransactionsByUserId, getTransactionSummary } from '../controllers/transactions.controller.js';

const router = express.Router();

router.post("/", createTransaction);
router.get("/summary/:userId", getTransactionSummary);
router.get("/:userId", getTransactionsByUserId);
router.delete("/:id", deleteTransaction);

export default router;