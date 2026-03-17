const mongoose = require("mongoose");
require('dotenv').config();

const URI = process.env.MONGO_URL;

async function main() {
  if (!URI) {
    throw new Error("MONGO_URL environment variable is missing!");
  }

  await mongoose.connect(URI, {
    family: 4
  });
}

main()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:");
    console.error(err);
  });

module.exports = main;