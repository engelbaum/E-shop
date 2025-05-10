const { check } = require("express-validator");
const { ValidationResult } = require("../middlewares/validationResult");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.validatorCreateUser = [
  check("name").notEmpty().withMessage("Le nom est requis"),
  check("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("L'email doit être valide")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("L'email doit etre unique");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères")
    .custom((value, { req }) => {
      if (value != req.body.passwordConfirmation) {
        throw new Error(
          "Le mot de passe doit etre identique avec la confirmation"
        );
      }
      return true;
    }),

  check("passwordConfirmation")
    .notEmpty()
    .withMessage("La confirmation de mot de passe est requis"),
  check("phone").isMobilePhone("fr-BE").withMessage("Numero invalide"),

  ValidationResult,
];

exports.validatorUpdateUser = [
  check("name").notEmpty().withMessage("Le nom est requis"),
  check("email")
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("L'email doit être valide"),
  check("phone").isMobilePhone("fr-BE").withMessage("Numero invalide"),

  ValidationResult,
];

exports.validatorChangePassword = [
  check("id").isMongoId().withMessage("Identifiant invalide"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Le mot de passe courant est requis"),
  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères")
    .custom((value, { req }) => {
      if (value != req.body.passwordConfirmation) {
        throw new Error(
          "Le mot de passe doit etre identique avec la confirmation"
        );
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Le mot de passe courrent est pas correct");
      }
      return true;
    }),

  check("passwordConfirmation")
    .notEmpty()
    .withMessage("La confirmation de mot de passe est requis"),

  ValidationResult,
];
