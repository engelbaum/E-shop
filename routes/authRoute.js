const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
} = require("../validators/authValidator");

router.route("/").post(signupValidator, signup);
router.route("/login").get(loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetCode", verifyResetCode);
router.post("/reintialiser", resetPassword);
module.exports = router;
