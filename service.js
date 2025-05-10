const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const compression = require("compression");

const dbConnect = require("./config/databsae");
const mount = require("./routes");

dotenv.config();
const app = express();
app.use(cors());
app.use(compression());

app.use(express.json());

if (process.env.NODE_ENV === "devlopment") {
  console.log(`mode : ${process.env.NODE_ENV}`);
  app.use(morgan("dev"));
}

//🧠 Alternative sans extension : raccourci Mac natif
//Appuie sur : ^ + ⌘ + Espace
//(Ctrl + Cmd + Espace)
//Un sélecteur d’emojis s’ouvre → choisis 🚀 ou autre → ça le colle directement dans ton code.

dbConnect();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Dans app.js ou server.js
app.get("/orders", (req, res) => {
  res.send("<h1>Paiement réussi</h1><p>Merci pour votre commande.</p>");
});

app.get("/cancel", (req, res) => {
  res.send(
    "<h1>Paiement annulé</h1><p>Votre commande n'a pas été finalisée.</p>"
  );
});

mount(app);

// Route 404 (à mettre avant app.use((err,...)...)
// Route 404 si aucune route ne correspond

app.use((err, req, res, next) => {
  console.error(err.stack); // Affiche l'erreur dans la console (optionnel)
  res.status(404).json({
    status: "error",
    message: err.message || "Erreur interne du serveur",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 ❤️ Server running at http://localhost:${process.env.PORT}`);
});
