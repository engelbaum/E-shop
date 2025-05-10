require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");

const factory = require("../services/handelsFctory");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    return res.status(404).json({
      message: `panier untrouvavle : ${req.params.id}`,
    });
  }

  const cartPrice = cart.totalAfterDiscount
    ? cart.totalAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    taxPrice,
    shippingPrice,
    totalOrderPrice,
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption);
    await Cart.findByIdAndDelete(req.params.id);
  }
  res.status(201).json({ status: "Success", data: order });
});

exports.findAllorders = factory.getAll(Order, [
  { path: "user", select: "name" },
]);

exports.getAllOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders || orders.length === 0) {
    return res
      .status(404)
      .json({ message: "Aucune commande trouvée pour cet utilisateur." });
  }

  res.status(200).json({ data: orders });
});

//جلسة الدفع (Checkout Session) هي مرحلة وسيطة بين سلة التسوق والدفع الفعلي
exports.checkoutsession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    return res.status(404).json({
      message: `panier untrouvavle : ${req.params.id}`,
    });
  }

  const cartPrice = cart.totalAfterDiscount
    ? cart.totalAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: String(req.user?.name || "Client"), // Sécurisé
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cancel`,
    customer_email: String(req.user?.email || "test@example.com"),
    client_reference_id: String(cart._id),
  });
  res.status(201).json({ message: "Success", session });
});
