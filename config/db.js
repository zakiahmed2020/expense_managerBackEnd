import mongoose from "mongoose";

async function connectedToDB() {
  let db = process.env.Mongodb_LocalServer;
  try {
    await mongoose.connect(db);
    console.log("Connected to MongoDB .....");
  } catch (e) {
    console.error(`Failed To connect to MongoDB....`);
  }
}

export default connectedToDB;
