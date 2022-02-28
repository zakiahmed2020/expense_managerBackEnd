const mongoose = require("mongoose");

async function connectedToDB() {
  let db = process.env.Mongodb_LocalServer_URL;
  try {
    await mongoose.connect(db);
    console.log("Connected to MongoDB .....");
  } catch (e) {
    console.error(`Failed To connect to MongoDB....`);
  }
}

module.exports = connectedToDB;
