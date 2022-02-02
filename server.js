const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const connectedToDB = require("./config/db");
const transections = require("./Routers/Transactions.router");
const statements = require("./Routers/Statements.router");
const users = require("./Routers/Users.router");
const auth = require("./Routers/Auth.router");
require("dotenv").config();

app.use(cors());
app.use(express.json());

connectedToDB();

// routes
app.use("/api/transection", transections);
app.use("/api/statements", statements.router);
statements.userBalance();
app.use("/api/users", users);
app.use("/api/auth", auth);

// listening port
const port = process.env.PORT || 4400;
app.listen(port, () => {
  console.log(`running port ${port}`);
});
