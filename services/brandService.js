const factory = require("./handelsFctory");
const Brand = require("../models/brandModel");

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

exports.createBrand = factory.createOne(Brand);
exports.getBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
