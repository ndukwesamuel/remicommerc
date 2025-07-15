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
import IncomeGoalModel from "../models/goals.model.js";

const router = express.Router();

router.get("/goal", isAuth, async (req, res) => {
  try {
    const userId = req.user.userId.userId;

    // const goal = await IncomeGoalModel.findById(req.params.id);

    // 1. Get all goals for the user
    const goals = await IncomeGoalModel.find({ userId });

    // 2. Get all income entries for the user
    const incomes = await IncomeModel.find({ userId });

    // 3. Calculate progress for each goal
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        // Calculate total income amount (saved amount)
        const totalSaved = incomes.reduce((sum, income) => {
          // You might want to add additional filtering here, like:
          // - Only include incomes after goal start date
          // - Only include incomes before goal end date
          return sum + income.amount;
        }, 0);

        // Calculate progress percentage (capped at 100%)
        const progressPercentage = Math.min(
          100,
          (totalSaved / goal.targetAmount) * 100
        );

        // Calculate amount remaining
        const amountRemaining = Math.max(0, goal.targetAmount - totalSaved);

        // Calculate days remaining
        const daysRemaining = Math.ceil(
          (goal.endDate - new Date()) / (1000 * 60 * 60 * 24)
        );

        return {
          _id: goal._id,
          title: goal.title,
          targetAmount: goal.targetAmount,
          amountSaved: totalSaved,
          amountRemaining: amountRemaining,
          progressPercentage: progressPercentage.toFixed(2), // Keep 2 decimal places
          daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
          isCompleted: totalSaved >= goal.targetAmount,
          startDate: goal.startDate,
          endDate: goal.endDate,
          createdAt: goal.createdAt,
          updatedAt: goal.updatedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: goalsWithProgress,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

router.post("/goal", isAuth, async (req, res) => {
  try {
    const userId = req.user.userId.userId;
    const { title, targetAmount, endDate, startDate } = req.body;

    const newGoal = new IncomeGoalModel({
      title,
      targetAmount,
      endDate,
      userId,
      startDate,
    });

    await newGoal.save();
    res.status(201).json({
      success: true,
      data: newGoal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/income", isAuth, async (req, res) => {
  const userId = req.user.userId.userId;

  const income = new IncomeModel({
    source: req.body.source,
    amount: req.body.amount,
    date: req.body.incomeData,
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
    const { category, amount, date } = req.body;

    const userId = req.user.userId.userId;

    // Validate request body
    if (!category || !amount || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // const expense = new expenseModel({
    //   category,
    //   amount,
    //   // date: date || Date.now(),
    //   userId,
    // });

    const expenseData = {
      category,
      amount,
      userId,
    };

    // If 'date' is provided in req.body, use it. Otherwise, Mongoose default will kick in.
    if (date) {
      // It's good practice to try and parse the date if it's coming from the body
      // to ensure it's a valid date format before saving.
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res
          .status(400)
          .json({ message: "Invalid date format provided." });
      }
      expenseData.date = parsedDate;
    }
    const expense = new expenseModel(expenseData);
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

router.delete("/goal/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    const deletedGoal = await IncomeGoalModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedGoal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
