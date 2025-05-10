const asyncHnadler = require("express-async-handler");
const Cart = require("../models/cartModel");

const Product = require("../models/productModel");

const calacTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((product) => {
    totalPrice = totalPrice + product.quantity * product.price;
    cart.totalCartPrice = totalPrice;
  });
  return totalPrice;
};

exports.addProductInCart = asyncHnadler(async (req, res, next) => {
  const { productId, quantity, color } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable." });
  }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          quantity,
          color,
          price: product.price,
        },
      ],
    });
    console.log("Nouveau panier créé et produit ajouté.");
  } else {
    const productExists = cart.cartItems.findIndex(
      (item) => item.product == productId && item.color == color
    );
    console.log("Produit déjà présent : quantité mise à jour.");
    if (productExists > -1) {
      const cartItem = cart.cartItems[productExists];
      cartItem.quantity += 1;
      cart.cartItems[productExists] = cartItem;
      //console.log(cartItem);
    } else {
      cart.cartItems.push({
        product: productId,
        quantity,
        color,
        price: product.price,
      });
      console.log("Produit ajouté au panier.");
    }
  }
  calacTotalPrice(cart);

  await cart.save();
  res.status(201).json({
    message: "Produit ajouté au panier avec succès.",
    data: cart,
  });
});

exports.getLoggedUserCartSHopping = asyncHnadler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: `L'utilisateur ${req.user.name} connecté ne possède pas encore de panier d'achat.`,
    });
  }
  res.status(200).json({
    message: "Panier récupéré avec succès.",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.removeSpecificCartItem = asyncHnadler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: itemId } },
    },
    {
      new: true,
    }
  );
  if (!cart) {
    return res.status(404).json({
      message: `L'utilisateur ${req.user.name} connecté ne possède pas encore de panier d'achat.`,
    });
  }
  calacTotalPrice(cart);
  cart.save();
  res
    .status(200)
    .json({ message: "Article supprimé du panier avec succès.", data: cart });
});

exports.clearCart = asyncHnadler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: `L'utilisateur connecté "${req.user.name}" ne possède pas encore de panier d'achat.`,
    });
  }

  res.status(200).json({ message: "Panier supprimé  avec succès." });
});

exports.updateCartItemQuantity = asyncHnadler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: `L'utilisateur connecté "${req.user.name}" ne possède pas encore de panier d'achat.`,
    });
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() == req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
  }

  calacTotalPrice(cart);
  await cart.save();

  res.status(200).json({ message: "Article modifié avec succès.", data: cart });
});
