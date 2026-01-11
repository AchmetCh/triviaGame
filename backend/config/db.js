const mongoose = require("mongoose");
require('dotenv').config();

const URI = process.env.MONGO_URL;

async function main() {
  // Check if URI exists to prevent defaulting to localhost
  if (!URI) {
    throw new Error("MONGO_URL environment variable is missing!");
  }

  await mongoose.connect(URI, {
    // This forces the connection to use IPv4 instead of IPv6
    family: 4, 
    // This ensures Mongoose doesn't try to find a replica set
    directConnection: true 
  });
}

main()
  .then(() => console.log("DB connected successfully to local MongoDB"))
  .catch((err) => {
    console.error("Database connection failed:");
    console.error(err);
  });

module.exports = main;