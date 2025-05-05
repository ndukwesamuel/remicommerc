// import express from "express";
// import methodNotAllowed from "../../middlewares/methodNotAllowed.js";
// import {
//   forgotPassword,
//   getUser,
//   login,
//   register,
//   resetPassword,
//   sendOTP,
//   updateUser,
//   verifyOTP,
// } from "../controllers/auth.controller.js";
// import { isAuth } from "../../middlewares/auth.js";
// import { userValidator } from "../validators/user.validator.js";

// const router = express.Router();

// router.post(
//   "/",
//   [
//     auth,
//     admin,
//     [
//       check("name", "Product name is required").not().isEmpty(),
//       check("description", "Description is required").not().isEmpty(),
//       check("price", "Price must be a positive number").isFloat({ min: 0 }),
//       check("quantity", "Quantity must be a positive integer").isInt({
//         min: 0,
//       }),
//       check("category", "Category is required").not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       // Create product object
//       const productFields = {
//         ...req.body,
//         createdBy: req.user.id,
//         updatedBy: req.user.id,
//       };

//       // If variants exist, set hasVariants to true
//       if (req.body.variants && req.body.variants.length > 0) {
//         productFields.hasVariants = true;
//       }

//       const product = new Product(productFields);
//       await product.save();

//       res.status(201).json(product);
//     } catch (err) {
//       console.error(err.message);
//       if (err.code === 11000) {
//         return res.status(400).json({ msg: "SKU or slug already exists" });
//       }
//       res.status(500).send("Server Error");
//     }
//   }
// );

// // router
// //   .route("/")
// //   .get(isAuth, getUser)
// //   .patch(isAuth, updateUser)
// //   //   .delete(auth, deleteUser)
// //   .all(methodNotAllowed);
// // router.route("/signup").post(userValidator, register).all(methodNotAllowed);
// // router.route("/signin").post(login).all(methodNotAllowed);
// // router.route("/send-otp").post(sendOTP).all(methodNotAllowed);
// // router.route("/verify-otp").post(verifyOTP).all(methodNotAllowed);
// // router.route("/forgot-password").post(forgotPassword).all(methodNotAllowed);
// // router.route("/reset-password").post(resetPassword).all(methodNotAllowed);

// export default router;
