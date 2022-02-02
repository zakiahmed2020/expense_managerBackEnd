const mongoose = require("mongoose");

const DB = "expenseManager";
async function connectedToDB() {
  try {
    await mongoose.connect(`mongodb://localhost:27017/${DB}`);
    console.log("Connected to MongoDB .....");
  } catch (e) {
    console.error(`Failed To connect to MongoDB....`);
  }
}

module.exports = connectedToDB;
