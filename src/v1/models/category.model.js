import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    image: {
      type: String,
      default:
        "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
