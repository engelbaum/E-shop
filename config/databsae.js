const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.URI)
    .then((conn) => {
      console.log("\n✅ Connected to MongoDB:");
      console.log(`🌐 Host: ${conn.connection.host}`);
      console.log(`📂 Database: ${conn.connection.name}\n`);
    })
    .catch((err) => {
      console.error("❌ MongoDB Connection Error:");
      console.error(`📄 Message: ${err.message}`);
      process.exit(1); // Arrête le serveur en cas d'erreur
    });
};

module.exports = dbConnect