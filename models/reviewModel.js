//Review (Avis)C’est un commentaire écrit laissé par un utilisateur pour partager son opinion sur un produit.
//⭐ 2. Rating (Note)C’est une note numérique, souvent entre 1 et 5 étoiles, donnée par un utilisateur pour évaluer la qualité d’un produit.

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Le commentaire est requis."],
      trim: true,
    },
    ratings: {
      type: Number,
      min: [1, "La note minimale est 1."],
      max: [5, "La note maximale est 5."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "L'utilisateur est requis."],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Le produit est requis."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
