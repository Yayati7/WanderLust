const mongoose=require("mongoose");
const initData= require("./data.js");
const Listing= require("../Models/listing.js");
const User = require("../Models/user.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL); 
}

const initDB = async () => {
  await Listing.deleteMany({});

  const user = await User.findOne();
  if (!user) {
    console.log("❌ No user found in DB. Please register a user first.");
    return;
  }

  // Ensure geometry exists for each listing
  const validatedData = initData.data.map(obj => {
    if (!obj.geometry || !obj.geometry.coordinates) {
      console.error(`❌ Missing geometry for: ${obj.title}`);
      // Add fallback coordinates if needed
      obj.geometry = { 
        type: "Point", 
        coordinates: [0, 0] // Fallback
      };
    }
    return { 
      ...obj, 
      owner: user._id 
    };
  });

  await Listing.insertMany(validatedData);
  console.log("✅ Listings seeded with geometry data");
};




initDB();