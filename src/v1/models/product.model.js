import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    sku: {
      type: String,
      unique: true,
      required: [true, "SKU is required"],
      uppercase: true,
    },

    // Pricing information
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    compareAtPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= this.price;
        },
        message: "Compare price must be greater than or equal to selling price",
      },
    },
    costPerItem: {
      type: Number,
      min: [0, "Cost cannot be negative"],
    },

    // Inventory management
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },

    // Product categorization
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],

    // Media
    images: [
      {
        url: String,
        altText: String,
        isPrimary: Boolean,
      },
    ],
    videos: [
      {
        url: String,
        thumbnail: String,
      },
    ],

    // Shipping information
    weight: {
      type: Number,
      min: [0, "Weight cannot be negative"],
    },
    weightUnit: {
      type: String,
      enum: ["g", "kg", "lb", "oz"],
      default: "g",
    },

    // Variants
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        name: String,
        sku: String,
        price: Number,
        quantity: Number,
        options: [
          {
            name: String,
            value: String,
          },
        ],
      },
    ],

    // SEO and visibility
    seoTitle: String,
    seoDescription: String,
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
    // updatedBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
  return Math.round(
    ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
  );
});

// Indexes for better query performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isPublished: 1 });

// Middleware to update slug before saving
productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Middleware to update inStock status
productSchema.pre("save", function (next) {
  if (this.trackInventory) {
    this.inStock = this.quantity > 0;
  }
  next();
});

export default mongoose.model("Product", productSchema);
