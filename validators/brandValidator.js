const { check, validationResult } = require("express-validator");
const slugify = require("slugify");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isLength({ min: 3, max: 44 })
    .withMessage("Le nom doit contenir entre 3 et 44 caractères."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];

exports.updateBrandValidator = [
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

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Id invalide"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Id invalide"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];
