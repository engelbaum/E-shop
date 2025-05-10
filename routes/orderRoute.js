const express = require("express");
const router = express.Router();

const {
  createCashOrder,
  findAllorders,
  getAllOrdersForLoggedUser,
  checkoutsession,
} = require("../services/orderService");

const { protect, allowedTo } = require("../services/authService");



router.use(protect, allowedTo("user", "admin"));

router.get("/checkout-session/:id", checkoutsession);

router.post("/:id", createCashOrder);
router.get("/", findAllorders);
router.get("/getspecificOrder", getAllOrdersForLoggedUser);

module.exports = router;
