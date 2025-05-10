const { check } = require("express-validator");
const slugify = require("slugify");
const { ValidationResult } = require("../middlewares/validationResult");
const User = require("../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("Le nom es requis")
    .isLength({ min: 3 })
    .withMessage("Le nom doit contenir au moins 3 caractères")
    .isLength({ max: 44 })
    .withMessage("Le nom ne doit pas dépasser 44 caractères")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("L'email est invalide"),
  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moin 6 caractère")
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirmation) {
        throw new Error(
          "Le mot de passe doit etre identique avec la confirmation de mot de passe "
        );
      }
      return true;
    }),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("La confirmation de mot de passe est requis"),

  ValidationResult,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("L'email est invalide"),
  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moin 6 caractère"),

  ValidationResult,
];
