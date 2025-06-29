import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    // firstName: {
    //   type: String,
    //   required: [true, "Please provide a first name"],
    // },
    // lastName: {
    //   type: String,
    //   required: [true, "Please provide a last name"],
    // },
    email: {
      type: String,
      // required: [true, "Please provide an email"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please provide a valid email",
      ],
      unique: [true, "User with this email already exists"],
    },
    // phoneNumber: {
    //   type: String,
    //   required: [true, "Please provide a phone number"],
    //   unique: [true, "User with this phone number already exists"],
    //   match: [
    //     /^\+?[1-9]\d{1,14}$/,
    //     "Please provide a valid phone number in international format",
    //   ],
    // },

    // phoneNumber: {
    //   type: String,
    //   unique: [true, "User with this phone number already exists"],
    //   match: [
    //     /^\+?[1-9]\d{1,14}$/,
    //     "Please provide a valid phone number in international format",
    //   ],
    //   sparse: true, // Allows unique constraint to be ignored when the field is not set
    // },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
    // roles: {
    //   type: [String],
    //   enum: ["user", "admin"],
    //   default: ["user"],
    // },
    // isEmailVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // image: {
    //   type: String,
    //   default:
    //     "https://res.cloudinary.com/demmgc49v/image/upload/v1695969739/default-avatar_scnpps.jpg",
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
