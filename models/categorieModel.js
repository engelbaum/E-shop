const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      unique: [true, "Le nom doit être unique"],
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
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.name) {
    update.slug = slugify(update.name, { lower: true });
    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("Category", categorySchema);
