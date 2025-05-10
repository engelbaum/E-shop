const { check, validationResult } = require("express-validator");
const slugify = require("slugify");
const Category = require("../models/categorieModel");

exports.createsubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isLength({ min: 3, max: 44 })
    .withMessage("Le nom doit contenir entre 3 et 44 caractères.")

    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("")
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("La catégorie spécifiée est introuvable.");
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

exports.updatesubCategoryValidator = [
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
  check("category")
    .notEmpty()
    .withMessage("")
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("La catégorie spécifiée est introuvable.");
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

exports.getsubCategoryValidator = [
  check("id").isMongoId().withMessage("Id invalide"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];


exports.deletesubCategoryValidator = [
    check("id").isMongoId().withMessage("Id invalide"),
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      }
      next();
    },
  ];
  