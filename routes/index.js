const userRoute = require("../routes/userRoute");
const authRoute = require("../routes/authRoute");
const categoryRoute = require("../routes/categoryRoute");
const subcategorRoute = require("../routes/subCategoryRoute");
const brandRoute = require("../routes/brandRoute");
const productRoute = require("../routes/productRoute");
const carteRoute = require("../routes/carteRoute");
const orderRoute = require("../routes/orderRoute");







const mount = (app) => {
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subCategories", subcategorRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/carts", carteRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mount;
