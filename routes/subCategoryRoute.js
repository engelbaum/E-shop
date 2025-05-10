const express = require("express");
const router = express.Router();

const {
  createSubCategory,
  getSubCategory,
  getSubCategorys,
  updateCSubCategory,
  deleteSubcategory,
} = require("../services/subcategoryService");
const { protect, allowedTo } = require("../services/authService");

const {
  createsubCategoryValidator,
  deletesubCategoryValidator,
  updatesubCategoryValidator,
  getsubCategoryValidator,
} = require("../validators/subcategoryValidator");

router.use(protect, allowedTo("user", "admin"));

router
  .route("/")
  .post(createsubCategoryValidator, createSubCategory)
  .get(getSubCategorys);
router
  .route("/:id")
  .get(getsubCategoryValidator, getSubCategory)
  .put(updatesubCategoryValidator, updateCSubCategory)
  .delete(deletesubCategoryValidator, deleteSubcategory);

module.exports = router;
