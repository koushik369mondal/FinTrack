// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello from Kaushik');
});

console.log("My port:", PORT)

app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
});