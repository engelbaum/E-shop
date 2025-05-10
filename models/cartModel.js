const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: [true, "La quantitée est requis"],
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "L'utilsateur est requis"],
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
