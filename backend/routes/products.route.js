import express from 'express';
import { sql } from '../config/db.js';

const router = express.Router();

router.post("/", async (req, res) => {
    //user_id, name, price, category, quantity
    try {
        const { user_id, name, price, category, quantity } = req.body;

        if (!user_id || !name || !price || !category) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const product = await sql`
            INSERT INTO products (user_id, name, price, category, quantity)
            VALUES (${user_id}, ${name}, ${price}, ${category}, ${quantity || 1})
            RETURNING *
        `;

        console.log("Product created:", product[0]);
        res.status(201).json({
            message: "Product created successfully",
            product: product[0],
        });
    } catch (error) {
        console.log("Error creating the product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const products = await sql`
            SELECT * FROM products
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
        `;
        res.status(200).json(products);
    } catch (error) {
        console.log("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        const result = await sql`
            DELETE FROM products 
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product deleted successfully",
            product: result[0],
        });
    } catch (error) {
        console.log("Error deleting the product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/summary/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const totalProductsResult = await sql`
            SELECT COUNT(*) AS total_products
            FROM products
            WHERE user_id = ${userId}
        `

        const totalValueResult = await sql`
            SELECT COALESCE(SUM(price * quantity), 0) AS total_value
            FROM products
            WHERE user_id = ${userId}
        `

        const categoryBreakdownResult = await sql`
            SELECT category, COUNT(*) AS count, COALESCE(SUM(price * quantity), 0) AS value
            FROM products
            WHERE user_id = ${userId}
            GROUP BY category
            ORDER BY value DESC
        `

        res.status(200).json({
            totalProducts: totalProductsResult[0].total_products,
            totalValue: totalValueResult[0].total_value,
            categoryBreakdown: categoryBreakdownResult
        });

    } catch (error) {
        console.log("Error fetching product summary:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
