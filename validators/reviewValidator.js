const { check, validationResult } = require("express-validator");
const Product = require("../models/productModel");
const User = require("../models/userModel");

exports.createReviewValidator = [
  check("review")
    .notEmpty()
    .withMessage("L'avis du client est requis")
    .isLength({ min: 3, max: 300 })
    .withMessage("Le commentaire doit contenir entre 3 et 300 caractères"),
  check("ratings")
    .notEmpty()
    .withMessage("La note est requise")
    .isFloat({ min: 1, max: 5 })
    .withMessage("La note doit être entre 1 et 5"),
  check("product")
    .notEmpty()
    .withMessage("Le produit est requis")
    .isMongoId()
    .withMessage("Identifiant de produit invalide")
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw new Error(
          `Le produit avec l'identifiant ${value} est introuvable.`
        );
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];
