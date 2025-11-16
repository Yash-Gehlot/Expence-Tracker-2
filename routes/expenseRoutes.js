const express = require("express");
const router = express.Router();
const { addExpense, getExpenses } = require("../controllers/expenseController");
const authenticateToken = require("../middleware/auth");

router.post("/addExpense", authenticateToken, addExpense);
router.get("/getExpense", authenticateToken, getExpenses);

module.exports = router;
