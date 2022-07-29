import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectedToDB from "./config/db.js";
import auth from "./Routers/Auth.router.js";
import users from "./Routers/Users.router.js";
import transections from "./Routers/Transactions.router.js";
import statements from "./Routers/Statements.router.js";
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

connectedToDB();

app.get("/", function (req, res) {
  res.send("Welcome to the API");
});

// routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/transactions", transections);
app.use("/api/v1/statements", statements.router);
statements.userBalance();

// listening port
const port = process.env.PORT || 4400;
app.listen(port, () => {
  console.log(`running port ${port}`);
});
