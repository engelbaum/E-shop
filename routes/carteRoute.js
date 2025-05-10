const express = require("express");
const router = express.Router();

const {
  addProductInCart,
  getLoggedUserCartSHopping,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
} = require("../services/carteService");
const { protect, allowedTo } = require("../services/authService");

router.use(protect, allowedTo("user"));

router
  .route("/")
  .post(addProductInCart)
  .get(getLoggedUserCartSHopping)
  .delete(clearCart);
router.route("/:itemId").put(removeSpecificCartItem),
  router.route("/updateQuantity/:itemId").put(updateCartItemQuantity),
  (module.exports = router);
