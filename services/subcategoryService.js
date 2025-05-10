const factory = require("./handelsFctory");
const Subcategory = require("../models/subCategoryModel");

exports.createSubCategory = factory.createOne(Subcategory);
exports.getSubCategorys = factory.getAll(Subcategory);
exports.getSubCategory = factory.getOne(Subcategory);
exports.deleteSubcategory = factory.deleteOne(Subcategory);
exports.updateCSubCategory = factory.updateOne(Subcategory);
