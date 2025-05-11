const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Appelle la fonction qui crée une commande à partir de la session
    await createOrder(session);
  }

  res.status(200).json({ received: true });
};

async function createOrder(session) {
  const cartId = session.client_reference_id;
  const customerEmail = session.customer_email;

  const cart = await Cart.findById(cartId);
  if (!cart) return;

  await Order.create({
    user: cart.user,
    cartItems: cart.cartItems,
    shippingAddress: cart.shippingAddress,
    totalOrderPrice: cart.totalCartPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: "card",
  });

  console.log("✅ Commande créée avec succès !");
}
