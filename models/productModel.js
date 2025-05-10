const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis."],
      trim: true,
      minLength: [3, "Le titre doit contenir au moins 3 caractères."],
      maxLength: [44, "Le titre ne peut pas dépasser 44 caractères."],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est requise."],
      minLength: [44, "La description doit contenir au moins 44 caractères."],
      maxlength: [444, "La description ne peut pas dépasser 444 caractères."],
    },
    quantity: {
      type: Number,
      required: [true, "La quantité est requise"],
    },
    sold: {
      type: Number,
     default:0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Le prix est requis."],
      max: [100000, "Le prix ne peut pas dépasser 100000."],
      min: [1, "Le prix doit être supérieur à 0."],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    image: String,
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "La catégorie est requise."],
    },
    subcategory: [
      {
        type: mongoose.Schema.ObjectId,
        required: [true, "La sous-catégorie est requise."],
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      required: [true, "La marque est requise."],
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "La note minimale est 1"],
      max: [5, "La note maximale est 5."],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
