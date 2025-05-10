const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  setImageURL,
  uploadImageUser,
  changePassword,
  getLogerUserData,
  updateLogerUserPassword,
  updateLogerUserDta
} = require("../services/userService");

const {
  validatorCreateUser,
  validatorUpdateUser,
  validatorChangePassword,
} = require("../validators/usersValidator");

const { protect } = require("../services/authService");

router.get("/getMe", protect, getLogerUserData, getUser);
router.put("/updateLogerUserPassword", protect,updateLogerUserPassword);
router.put("/updateLogerUserData", protect,updateLogerUserDta);

router
  .route("/")
  .post(uploadImageUser, setImageURL, validatorCreateUser, createUser)
  .get(getUsers);
router
  .route("/:id")
  .get(getUser)
  .put(validatorUpdateUser, updateUser)
  .delete(deleteUser);

router.put("/changePassword/:id", validatorChangePassword, changePassword);

module.exports = router;
