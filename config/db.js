const mongoose = require("mongoose");

async function connectedToDB() {
  let URL = process.env.mongodb_URL;
  try {
    await mongoose.connect(`${URL}`);
    console.log("Connected to MongoDB .....");
  } catch (e) {
    console.error(`Failed To connect to MongoDB....`, e);
  }
}

module.exports = connectedToDB;
