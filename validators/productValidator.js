const { check, validationResult } = require("express-validator");
const slugify = require("slugify");
const Subcategory = require("../models/subCategoryModel");
const Brand = require("../models/brandModel");
const Category = require("../models/categorieModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Le nom est requis.")
    .isLength({ min: 3, max: 44 })
    .withMessage("Le nom doit contenir entre 3 et 44 caractères.")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("La description est requise.")
    .isLength({ min: 20, max: 2000 })
    .withMessage("La description doit contenir entre 20 et 2000 caractères."),

  check("quantity")
    .notEmpty()
    .withMessage("La quantité est requise.")
    .isInt()
    .withMessage("La quantité doit être un entier."),
  check("price")
    .notEmpty()
    .withMessage("")
    .isFloat({ min: 1, max: 100000 })
    .withMessage("Le prix doit être un nombre entre 1 et 100000."),
  check("category")
    .notEmpty()
    .withMessage("Categorie est requis")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new Error("Categorie  introuvable.");
      }
      return true;
    }),
  check("subcategory")
    .notEmpty()
    .withMessage("Les sous-catégories sont requises.")

    .custom(async (value, { req }) => {
      const subcategories = await Subcategory.find({
        _id: { $exists: true, $in: value },
      });
      //console.log(value.length)
      //console.log(subcategories.length);
      if (subcategories.length < 1) {
        throw new Error("Aucune sous-catégorie valide trouvée.");
      }
      if (subcategories.length != value.length) {
        throw new Error("Une ou plusieurs sous-catégories sont invalides.");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const subcategorie = await Subcategory.find({
        category: req.body.category,
      });
      //console.log(subcategorie)
      const subcategoriesId = subcategorie.map((s) => s._id.toString());

      if (!value.every((v) => subcategoriesId.includes(v))) {
        throw new Error(
          "Une ou plusieurs sous-catégories ne correspondent pas à la catégorie sélectionnée."
        );
      }

      return true;
    }),

  check("brand")
    .notEmpty()
    .withMessage("La marque est requise.")
    .custom(async (value) => {
      const brand = await Brand.findById(value);
      if (!brand) {
        throw new Error("Marque introuvable.");
      }
      return true;
    }),
  check("ratingsAverage")
    .notEmpty()
    .withMessage("La note moyenne est requise.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("La note moyenne doit être entre 1 et 5."),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    next();
  },
];
