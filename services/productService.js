const factory = require("./handelsFctory");
const Product = require("../models/productModel");

exports.createProduct = factory.createOne(Product);
exports.getProducts = factory.getAll(Product, [
    { path: "category", select: "name" },
    { path: "brand", select: "name" },
    { path: "subcategory", select: "name" }
]);
exports.getProduct = factory.getOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.updateProduct = factory.updateOne(Product);
