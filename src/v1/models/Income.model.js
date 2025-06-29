import mongoose from "mongoose";

const { Schema } = mongoose;

const incomeSchema = new Schema(
  {
    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Income", incomeSchema);
