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

const router = express.Router();

// router
//   .route("/")
//   .get(isAuth, getUser)
//   .patch(isAuth, updateUser)
//   //   .delete(auth, deleteUser)
//   .all(methodNotAllowed);
// router.route("/signup").post(userValidator, register).all(methodNotAllowed);
// router.route("/signin").post(login).all(methodNotAllowed);
// router.route("/send-otp").post(sendOTP).all(methodNotAllowed);
// router.route("/verify-otp").post(verifyOTP).all(methodNotAllowed);
// router.route("/forgot-password").post(forgotPassword).all(methodNotAllowed);
// router.route("/reset-password").post(resetPassword).all(methodNotAllowed);

// // router.route("/test1").post(resetPassword).all(methodNotAllowed);

// // Route to create default categories with images
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

// // Route to create sample phones
// router.post("/create-sample-phones", async (req, res) => {
//   try {
//     // Find the Phones category
//     const phoneCategory = await categoryModel.findOne({ name: "Phones" });

//     if (!phoneCategory) {
//       return res.status(404).json({
//         message: "Phones category not found. Create categories first.",
//       });
//     }

//     const samplePhones = [
//       {
//         name: "iPhone 15 Pro",
//         description: "Latest iPhone with A17 Pro chip and titanium design",
//         sku: "IPH19PRO256",
//         price: 999,
//         compareAtPrice: 1099,
//         costPerItem: 750,
//         quantity: 100,
//         category: phoneCategory._id,
//         tags: ["apple", "premium", "new"],
//         images: [
//           {
//             url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009279096",
//             altText: "iPhone 15 Pro Titanium",
//             isPrimary: true,
//           },
//         ],
//         weight: 187,
//         weightUnit: "g",
//         seoTitle: "Buy iPhone 15 Pro - Latest Apple Smartphone",
//         seoDescription:
//           "Get the new iPhone 15 Pro with titanium design, A17 Pro chip, and advanced camera system.",
//         isPublished: true,
//       },
//       {
//         name: "Samsung Galaxy S24 Ultra",
//         description: "Premium Android phone with S Pen and 200MP camera",
//         sku: "SGS24ULTRA512",
//         price: 1299,
//         compareAtPrice: 1399,
//         costPerItem: 950,
//         quantity: 85,
//         category: phoneCategory._id,
//         tags: ["samsung", "android", "premium"],
//         images: [
//           {
//             url: "https://images.samsung.com/us/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-kv.jpg",
//             altText: "Samsung Galaxy S24 Ultra",
//             isPrimary: true,
//           },
//         ],
//         weight: 233,
//         weightUnit: "g",
//         seoTitle: "Samsung Galaxy S24 Ultra - Best Android Phone",
//         seoDescription:
//           "Experience the power of Galaxy S24 Ultra with S Pen and 200MP camera.",
//         isPublished: true,
//       },
//       {
//         name: "Google Pixel 8 Pro",
//         description: "Google's flagship with Tensor G3 and AI features",
//         sku: "GPIX8PRO256",
//         price: 999,
//         compareAtPrice: 1099,
//         costPerItem: 800,
//         quantity: 60,
//         category: phoneCategory._id,
//         tags: ["google", "android", "camera"],
//         images: [
//           {
//             url: "https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/Pixel_8_Pro_Hazel__1_.jpg",
//             altText: "Google Pixel 8 Pro",
//             isPrimary: true,
//           },
//         ],
//         weight: 213,
//         weightUnit: "g",
//         seoTitle: "Google Pixel 8 Pro - Best Camera Phone",
//         seoDescription:
//           "Pixel 8 Pro with Tensor G3 chip and advanced AI camera features.",
//         isPublished: true,
//       },
//       {
//         name: "OnePlus 12",
//         description: "Flagship killer with Snapdragon 8 Gen 3",
//         sku: "OP12RAM16",
//         price: 799,
//         compareAtPrice: 899,
//         costPerItem: 650,
//         quantity: 120,
//         category: phoneCategory._id,
//         tags: ["oneplus", "android", "performance"],
//         images: [
//           {
//             url: "https://image01.oneplus.net/ebp/202312/07/1-m00-57-2b-rb8lbw1s0z-af5vkaaqz0yapmwm036.png",
//             altText: "OnePlus 12",
//             isPrimary: true,
//           },
//         ],
//         weight: 220,
//         weightUnit: "g",
//         seoTitle: "OnePlus 12 - High Performance Phone",
//         seoDescription:
//           "OnePlus 12 with Snapdragon 8 Gen 3 and Hasselblad camera.",
//         isPublished: true,
//       },
//       {
//         name: "Xiaomi 14 Pro",
//         description: "Chinese flagship with Leica camera system",
//         sku: "XM14PRO512",
//         price: 899,
//         compareAtPrice: 999,
//         costPerItem: 700,
//         quantity: 75,
//         category: phoneCategory._id,
//         tags: ["xiaomi", "android", "leica"],
//         images: [
//           {
//             url: "https://i01.appmifile.com/webfile/globalimg/products/pc/xiaomi-14-pro/specs-header.jpg",
//             altText: "Xiaomi 14 Pro",
//             isPrimary: true,
//           },
//         ],
//         weight: 225,
//         weightUnit: "g",
//         seoTitle: "Xiaomi 14 Pro - Leica Camera Phone",
//         seoDescription: "Xiaomi 14 Pro with Leica co-engineered camera system.",
//         isPublished: true,
//       },
//     ];
//     // Generate slugs for each product before insertion
//     const productsWithSlugs = samplePhones.map((phone) => {
//       const slug = phone.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)/g, "");
//       return { ...phone, slug };
//     });

//     // // Check if any products with these SKUs already exist
//     // const existingProducts = await productModel.find({
//     //   sku: { $in: samplePhones.map((phone) => phone.sku) },
//     // });

//     // Check if any products with these SKUs already exist
//     const existingProducts = await productModel.find({
//       $or: [
//         { sku: { $in: productsWithSlugs.map((phone) => phone.sku) } },
//         { slug: { $in: productsWithSlugs.map((phone) => phone.slug) } },
//       ],
//     });

//     if (existingProducts.length > 0) {
//       const existingSkus = existingProducts.map((prod) => prod.sku);
//       return res.status(400).json({
//         message: "Some products already exist",
//         existingSkus: existingSkus,
//       });
//     }

//     // Create products
//     // const createdProducts = await productModel.insertMany(samplePhones);

//     // Create products
//     const createdProducts = await productModel.insertMany(productsWithSlugs);

//     res.status(201).json({
//       message: "Sample phones created successfully",
//       products: createdProducts,
//     });
//   } catch (error) {
//     console.error("Error creating sample phones:", error);
//     res.status(500).json({
//       message: "Error creating sample phones",
//       error: error.message,
//     });
//   }
// });

// // Route to create sample laptops
// router.post("/create-sample-laptops", async (req, res) => {
//   try {
//     // Find the Laptops category
//     const laptopCategory = await categoryModel.findOne({ name: "Laptops" });

//     if (!laptopCategory) {
//       return res.status(404).json({
//         message: "Laptops category not found. Create categories first.",
//       });
//     }

//     const sampleLaptops = [
//       {
//         name: "MacBook Pro 16-inch M3 Max",
//         description:
//           "Apple's professional laptop with M3 Max chip and Liquid Retina XDR display",
//         sku: "MBP16M3MAX",
//         price: 3499,
//         compareAtPrice: 3699,
//         costPerItem: 2800,
//         quantity: 50,
//         category: laptopCategory._id,
//         tags: ["apple", "premium", "professional"],
//         images: [
//           {
//             url: "https://www.apple.com/v/macbook-pro-14-and-16/b/images/overview/hero/hero_intro_endframe__e6khcva4hkeq_large.jpg",
//             altText: "MacBook Pro 16-inch",
//             isPrimary: true,
//           },
//         ],
//         weight: 2.1,
//         weightUnit: "kg",
//         seoTitle: "MacBook Pro 16-inch M3 Max - Professional Laptop",
//         seoDescription:
//           "Powerful MacBook Pro with M3 Max chip, 16-inch Liquid Retina XDR display, and up to 96GB unified memory.",
//         isPublished: true,
//       },
//       {
//         name: "Dell XPS 15 (2024)",
//         description:
//           "Premium Windows laptop with OLED display and Intel Core i9",
//         sku: "DLLXPS15I9",
//         price: 2499,
//         compareAtPrice: 2699,
//         costPerItem: 2000,
//         quantity: 75,
//         category: laptopCategory._id,
//         tags: ["dell", "windows", "premium"],
//         images: [
//           {
//             url: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notebook-xps-9530-nt-blue-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4000&hei=4000&qlt=100,1&resMode=sharp2&size=4000,4000&chrss=full",
//             altText: "Dell XPS 15",
//             isPrimary: true,
//           },
//         ],
//         weight: 1.8,
//         weightUnit: "kg",
//         seoTitle: "Dell XPS 15 (2024) - Premium Windows Laptop",
//         seoDescription:
//           'Dell XPS 15 with Intel Core i9 processor, 15.6" 4K OLED display, and premium aluminum chassis.',
//         isPublished: true,
//       },
//       {
//         name: "HP Spectre x360 14",
//         description:
//           "Convertible laptop with 2.8K OLED touch display and Intel Evo platform",
//         sku: "HPSPX36014",
//         price: 1699,
//         compareAtPrice: 1899,
//         costPerItem: 1400,
//         quantity: 60,
//         category: laptopCategory._id,
//         tags: ["hp", "2-in-1", "touchscreen"],
//         images: [
//           {
//             url: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08284748.png",
//             altText: "HP Spectre x360",
//             isPrimary: true,
//           },
//         ],
//         weight: 1.4,
//         weightUnit: "kg",
//         seoTitle: "HP Spectre x360 14 - Convertible Laptop",
//         seoDescription:
//           "Versatile HP Spectre x360 with 2.8K OLED touch display, Intel Evo platform, and 360-degree hinge.",
//         isPublished: true,
//       },
//       {
//         name: "Lenovo ThinkPad X1 Carbon Gen 11",
//         description:
//           "Business ultrabook with Intel vPro and MIL-STD-810H durability",
//         sku: "LNVX1C11",
//         price: 2199,
//         compareAtPrice: 2399,
//         costPerItem: 1800,
//         quantity: 90,
//         category: laptopCategory._id,
//         tags: ["lenovo", "business", "ultrabook"],
//         images: [
//           {
//             url: "https://www.lenovo.com/medias/lenovo-laptops-thinkpad-x1-carbon-gen11-subseries-hero.png?context=bWFzdGVyfHJvb3R8MTQ3NTY5fGltYWdlL3BuZ3xoYzIvaDkzLzE0MDYzMjQwNTQ1OTUwLnBuZ3xlYzU0YjY0YzQ5YjU1YjY1YjIxYzI3YzY0Y2UxNzY1Y2Y4Y2Y5YzQ0Y2Y1YjU4YzY1ZTBkYjQ4YjQxYjY1",
//             altText: "Lenovo ThinkPad X1 Carbon",
//             isPrimary: true,
//           },
//         ],
//         weight: 1.1,
//         weightUnit: "kg",
//         seoTitle: "ThinkPad X1 Carbon Gen 11 - Business Ultrabook",
//         seoDescription:
//           'Legendary ThinkPad durability with Intel vPro processor, 14" WUXGA display, and best-in-class keyboard.',
//         isPublished: true,
//       },
//       {
//         name: "ASUS ROG Zephyrus G14",
//         description: "Gaming laptop with AMD Ryzen 9 and NVIDIA RTX 4090",
//         sku: "ASUSG14R9",
//         price: 2599,
//         compareAtPrice: 2799,
//         costPerItem: 2200,
//         quantity: 40,
//         category: laptopCategory._id,
//         tags: ["asus", "gaming", "performance"],
//         images: [
//           {
//             url: "https://dlcdnwebimgs.asus.com/gain/4E7F8F8B-9F0A-4A40-9BDF-33DFCF6D6BAF/w1000/h732",
//             altText: "ASUS ROG Zephyrus G14",
//             isPrimary: true,
//           },
//         ],
//         weight: 1.7,
//         weightUnit: "kg",
//         seoTitle: "ASUS ROG Zephyrus G14 - Premium Gaming Laptop",
//         seoDescription:
//           'Powerful 14" gaming laptop with AMD Ryzen 9, NVIDIA RTX 4090, and AniMe Matrix LED display.',
//         isPublished: true,
//       },
//     ];

//     // Generate slugs for each laptop before insertion
//     const laptopsWithSlugs = sampleLaptops.map((laptop) => {
//       const slug = laptop.name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, "-")
//         .replace(/(^-|-$)/g, "");
//       return { ...laptop, slug };
//     });

//     // Check for existing products
//     const existingProducts = await productModel.find({
//       $or: [
//         { sku: { $in: laptopsWithSlugs.map((laptop) => laptop.sku) } },
//         { slug: { $in: laptopsWithSlugs.map((laptop) => laptop.slug) } },
//       ],
//     });

//     if (existingProducts.length > 0) {
//       const existing = existingProducts.map((prod) => ({
//         sku: prod.sku,
//         slug: prod.slug,
//         name: prod.name,
//       }));
//       return res.status(400).json({
//         message: "Some laptops already exist",
//         existing,
//       });
//     }

//     // Create laptops
//     const createdLaptops = await productModel.insertMany(laptopsWithSlugs);

//     res.status(201).json({
//       message: "Sample laptops created successfully",
//       products: createdLaptops,
//     });
//   } catch (error) {
//     console.error("Error creating sample laptops:", error);
//     res.status(500).json({
//       message: "Error creating sample laptops",
//       error: error.message,
//     });
//   }
// });

// // Route to get all categories with product counts
// router.get("/categories-with-counts", async (req, res) => {
//   try {
//     // Get all categories
//     const categories = await categoryModel.find({});

//     // Get product counts for each category
//     const categoriesWithCounts = await Promise.all(
//       categories.map(async (category) => {
//         const productCount = await productModel.countDocuments({
//           category: category._id,
//         });
//         return {
//           _id: category._id,
//           name: category.name,
//           description: category.description,
//           image: category.image,
//           createdAt: category.createdAt,
//           updatedAt: category.updatedAt,
//           productCount: productCount,
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       count: categoriesWithCounts.length,
//       data: categoriesWithCounts,
//     });
//   } catch (error) {
//     console.error("Error fetching categories with counts:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching categories with counts",
//       error: error.message,
//     });
//   }
// });

// // Route to get all products or filter by category
// router.get("/products", async (req, res) => {
//   try {
//     const { category } = req.query;

//     // Build the query object
//     const query = {};

//     // If category query parameter exists and is valid
//     if (category && mongoose.Types.ObjectId.isValid(category)) {
//       query.category = new mongoose.Types.ObjectId(category);
//     } else if (category) {
//       // If category ID is provided but invalid
//       return res.status(400).json({
//         success: false,
//         message: "Invalid category ID format",
//       });
//     }

//     // Get products with optional category filter
//     const products = await productModel
//       .find(query)
//       .populate("category", "name description image") // Include category details
//       .sort({ createdAt: -1 }); // Sort by newest first

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       data: products,
//     });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching products",
//       error: error.message,
//     });
//   }
// });

export default router;
