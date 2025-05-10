const { check, validationResult } = require("express-validator");
const slugify = require("slugify");
const Category = require("../models/categorieModel");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isLength({ min: 3, max: 44 })
    .withMessage("Le nom doit contenir entre 3 et 44 caractères.")

    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    })
    .custom(async (value, { req }) => {
      const category = await Category.findOne({ name: value });
      if (category) {
        throw new Error("Le nom de la category doit estre unique");
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

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Id invalide"),
  check("name")
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isLength({ min: 3, max: 44 })
    .withMessage("Le nom doit contenir entre 3 et 44 caractères.")

    .custom((value, { req }) => {
      req.body.slug = slugify(value);
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

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Id invalide"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Id invalide"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];
