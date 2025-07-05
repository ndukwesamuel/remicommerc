import express from "express";
import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
import {
  forgotPassword,
  getUser,
  login,
  register,
  resetPassword,
  sendOTP,
  updateUser,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { isAuth } from "../../middlewares/auth.js";
import { userValidator } from "../validators/user.validator.js";
import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import IncomeModel from "../models/Income.model.js";
import expenseModel from "../models/expense.model.js";

const router = express.Router();

router.get("/income", isAuth, async (req, res) => {
  try {
    const userId = req.user.userId.userId;
    const incomes = await IncomeModel.find({ userId: userId });

    res.status(201).json({
      message: "Default categories created successfully",
      incomes,
    });
  } catch (error) {
    console.error("Error creating default categories:", error);
    res.status(500).json({
      message: "Error creating default categories",
      error: error.message,
    });
  }
});

router.post("/income", isAuth, async (req, res) => {
  const userId = req.user.userId.userId;

  const income = new IncomeModel({
    source: req.body.source,
    amount: req.body.amount,
    userId: userId, // In real app, get from auth
  });

  try {
    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/exp", isAuth, async (req, res) => {
  try {
    const { category, amount } = req.body;

    const userId = req.user.userId.userId;

    // Validate request body
    if (!category || !amount || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const expense = new expenseModel({
      category,
      amount,
      // date: date || Date.now(),
      userId,
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all expenses for a specific user
router.get("/exp", isAuth, async (req, res) => {
  try {
    const userId = req.user.userId.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const expenses = await expenseModel.find({ userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an expense
router.delete("/exp/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const deletedExpense = await expenseModel.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/income/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const deletedExpense = await IncomeModel.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Income deleted successfully", id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
