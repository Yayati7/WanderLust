if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const Listing = require("./Models/listing"); // adjust path if needed
const { data } = require("./Init/data"); // your sample listings
const dbUrl = process.env.ATLASDB_URL;

async function seedDB() {
  try {
    await mongoose.connect(dbUrl); // ✅ no extra options needed
    console.log("✅ Connected to MongoDB Atlas");

    await Listing.deleteMany({});
    console.log("🗑️ Existing listings cleared");

    await Listing.insertMany(data);
    console.log("🌱 Sample listings inserted");

  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from DB");
  }
}

seedDB();
