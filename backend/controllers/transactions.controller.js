export async function getTransactionsByUserId() {
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
}

export async function createTransaction(req, res) {
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
        res.status(201).json({
            message: "Transaction created successfully",
            transaction: transaction[0],
        });
    } catch (error) {
        console.log("Error creating the transaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}