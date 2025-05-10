const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const factory = require("./handelsFctory");
const User = require("../models/userModel");
const { uploads } = require("../utils/userMulter");

exports.uploadImageUser = uploads.single("image");

exports.setImageURL = (req, res, next) => {
  if (req.file) {
    req.body.image = `${req.protocol}://${req.get("host")}/uploads/users/${
      req.file.filename
    }`;
  }
  next();
};

exports.createUser = factory.createOne(User);
exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, image } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { name, email, phone, image },
    { new: true }
  );
  if (!user) {
    return res
      .status(404)
      .json({ Message: `Utilisateur avec ${id} est introuvable` });
  }
  res.status(200).json({ data: user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      changePasswordAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return res
      .status(404)
      .json({ Message: `Utilisateur avec ${id} est introuvable` });
  }
  res.status(200).json({ data: user });
});

exports.getLogerUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLogerUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      changePasswordAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return res
      .status(404)
      .json({ Message: `Utilisateur avec ${id} est introuvable` });
  }
  const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(200).json({ data: user, token });
});

exports.updateLogerUserDta = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phone,
    },
    { new: true }
  );
  if (!user) {
    return res
      .status(404)
      .json({ Message: `Utilisateur avec ${id} est introuvable` });
  }
  const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(200).json({ data: user, token });
});
