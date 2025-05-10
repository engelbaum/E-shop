const multer = require("multer");
const { v4: uuid4 } = require("uuid");

const storageMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `users-${uuid4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées !"), false); // Rejette le fichier
  }
};

exports.uploads = multer({
  storage: storageMulter,
  fileFilter: multerFilter,
});

