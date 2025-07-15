import mongoose from "mongoose";

const { Schema } = mongoose;

const incomeGoalSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [0, "Target amount cannot be negative"],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          // Compare with current date if startDate isn't set yet
          const comparisonDate = this.startDate || new Date();
          return value > comparisonDate;
        },
        message: "End date must be after start date/current date",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model("IncomeGoal", incomeGoalSchema);
