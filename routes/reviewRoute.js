const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview
} = require("../services/reviewService");


const{createReviewValidator}=require("../validators/reviewValidator")

const { protect, allowedTo } = require("../services/authService");

router.use(protect, allowedTo("user", "admin"));

router.route("/").post(createReviewValidator,createReview).get(getReviews);
router.route("/:id").get(getReview).put(updateReview).delete(deleteReview);

module.exports = router;
