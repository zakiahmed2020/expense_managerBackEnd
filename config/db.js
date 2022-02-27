const mongoose = require("mongoose");

async function connectedToDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://xman:x_1258@cluster0.t0zb7.mongodb.net/expenseManager`
    );
    console.log("Connected to MongoDB .....");
  } catch (e) {
    console.error(`Failed To connect to MongoDB....`, e);
  }
}

module.exports = connectedToDB;
