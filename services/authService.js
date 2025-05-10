const crypto = require("crypto");

const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const sendEmail = require("../config/sendEmail");

exports.signup = asynchandler(async (req, res) => {
  const { name, slug, email, password } = req.body;
  const user = await User.create({ name, slug, email, password });
  const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});

exports.login = asynchandler(async (req, res) => {
  let token;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ Message: "L'utlisateur introuvable" });
  }
  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isCorrectPassword) {
    return res.status(404).json({ message: "Le mot de passe est incorrecte" });
  }

  token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  res.status(200).json({ data: user, token });
});

exports.protect = asynchandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json({ Message: "Accès non autorisé. Token manquant." });
  }

  const deocded = jwt.verify(token, process.env.PRIVATE_KEY);
  const currentUser = await User.findById(deocded.userId);
  if (!currentUser) {
    return res.status(404).json({ Message: "Utilisateur non trouvé" });
  }

  if (currentUser.changePasswordAt) {
    const changePasswordAtMs = Math.floor(
      currentUser.changePasswordAt.getTime() / 1000
    );

    if (changePasswordAtMs > deocded.iat) {
      return res.status(401).json({
        Message:
          "L'utilisateur a récemment changé son mot de passe. Veuillez vous reconnecter.",
      });
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...rolles) =>
  asynchandler(async (req, res, next) => {
    if (!rolles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Accès interdit. Vous n'avez pas les autorisations nécessaires.",
      });
    }
    next();
  });

exports.forgotPassword = asynchandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  //console.log(resetCode);
  //console.log(hashResetCode);
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerfied = false;
  user.save();

  await sendEmail({
    email: user.email,
    subject: "🔐 Réinitialisation de votre mot de passe (valable 10 minutes)",
    message: `Bonjour ${user.name} Vous avez demandé la réinitialisation de votre mot de passe.

Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe (valable 10 minutes) :

${resetCode}

Si vous n'avez pas fait cette demande, vous pouvez ignorer cet e-mail.

Cordialement,
L’équipe support `,
  });

  res.status(200).json({
    status: "success",
    message: "Un lien de réinitialisation a été envoyé à votre adresse e-mail.",
  });
});

exports.verifyResetCode = asynchandler(async (req, res, next) => {
  const hashresetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashresetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Le lien de réinitialisation est invalide ou a expiré.",
    });
  }
  user.passwordResetVerfied = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

exports.resetPassword = asynchandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(401)
      .json({ message: "Cet email ne correspond à aucun compte." });
  }
  if (!user.passwordResetVerfied) {
    return res
      .status(401)
      .json({ Message: "Veuillez vérifier votre code de réinitialisation." });
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerfied = undefined;
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(200).json({ token });
});
