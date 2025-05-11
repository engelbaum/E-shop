const asynHandler = require("express-async-handler");
const Review = require("../models/reviewModel");

exports.createReview = asynHandler(async (req, res) => {
  const { review, ratings, product } = req.body;

  // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
  const existingReview = await Review.findOne({
    user: req.user._id, //,et comme on dit et donc les deux conditions doivent etre satisfaire
    product,
  });

  if (existingReview) {
    return res.status(400).json({
      message: "Vous avez déjà évalué ce produit.",
    });
  }

  const newReview = await Review.create({
    review,
    ratings,
    user: req.user._id,
    product,
  });

  res.status(201).json({ data: newReview });
});

exports.getReviews = asynHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const reviews = await Review.find({})
    .skip(skip)
    .limit(limit)
    .populate([
      { path: "product", select: "title" },
      { path: "user", select: "name" },
    ]);
  res.status(200).json({ Resault: reviews.length, page, data: reviews });
});

exports.getReview = asynHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ message: "Avis introuvable" });
  }
  res.status(200).json({ data: review });
});

exports.updateReview = asynHandler(async (req, res) => {
  const { id } = req.params;

  const { ratings, product, review } = req.body;

  const reviews = await Review.findByIdAndUpdate(
    id,
    {
      ratings,
      product,
      review,
      user: req.user._id,
    },

    { new: true }
  );
  if (!reviews) {
    return res.status(404).json({ message: "Avis introuvable" });
  }
  res.status(200).json({ data: reviews });
});

exports.deleteReview = asynHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return res.status(404).json({ message: "Avis introuvable" });
  }
  res.status(204).send();
});
