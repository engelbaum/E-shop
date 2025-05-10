const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis."],
      trim: true,
      minLength: [3, "Le nom doit contenir au moins 3 caractères."],
      maxLength: [44, "Le nom ne peut pas dépasser 44 caractères."],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie parente est requise."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);
