const express = require("express");
const router = express.Router();

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
} = require("../services/productService");

const { createProductValidator } = require("../validators/productValidator");
const { protect, allowedTo } = require("../services/authService");

router.get("/", getProducts);


router.use(protect, allowedTo("user", "admin"));
router.route("/:id").delete(deleteProduct).get(getProduct).put(updateProduct);

router.route("/").post(createProductValidator, createProduct);

module.exports = router;
