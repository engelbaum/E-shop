

const factory = require("./handelsFctory");
const Category = require("../models/categorieModel");

//const { uploads } = require("../utils/userMulter");

/*exports.uploadImageUser = uploads.single("image");

exports.setImageURL = (req, res, next) => {
  if (req.file) {
    req.body.image = `${req.protocol}://${req.get("host")}/uploads/users/${
      req.file.filename
    }`;
  }
  next();
};*/

exports.createCategory = factory.createOne(Category);
exports.getCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
exports.updateCategory = factory.updateOne(Category);
