const express = require("express");
const router = express.Router();

const {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("../services/brandService");

const {
  createBrandValidator,
  getBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require("../validators/brandValidator");
const { protect, allowedTo } = require("../services/authService");

router.get("/", getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand);

router.use(protect, allowedTo("user", "admin"));

router.route("/").post(createBrandValidator, createBrand);
router.route("/:id").delete(deleteBrandValidator, deleteBrand);

module.exports = router;
