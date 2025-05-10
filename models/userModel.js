const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      minLength: [3, "Le nom  doit contenir au moins 3 caractères "],
      maxLength: [44, "Le nom ne doit pas depasser 44 caractères "],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "L'email doit être unique"],
      trim: true,
      lowercase: true,
      required: [true, "L'email est requis"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Le mot de passe  doit contenir au moins 6 caractères "],
    },
    changePasswordAt: Date,
    passwordResetCode: String,
    passwordResetVerfied: Boolean,
    passwordResetExpires: Date,
    image: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActived: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
module.exports = mongoose.model("User", userSchema);
