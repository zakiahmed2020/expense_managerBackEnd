import path from "path";
import url from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectedToDB from "./config/db.js";
import auth from "./Routers/Auth.router.js";
import users from "./Routers/Users.router.js";
import transections from "./Routers/Transactions.router.js";
import statements from "./Routers/Statements.router.js";
const app = express();
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectedToDB();

app.get("/", function (req, res) {
  res.send({
    message: "Welcome to Express API",
  });
});

app.get("/api", function (req, res) {
  res.send("Express API is running");
});

// routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/transactions", transections);
app.use("/api/v1/statements", statements.router);
statements.userBalance();
// get user image with path => http://localhost:4400/uploads/IMG_42871662105881035.jpeg
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// listening port
const port = process.env.PORT || 4400;
app.listen(port, () => {
  console.log(`running port ${port}`);
});
