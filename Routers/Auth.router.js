import _ from "lodash";
import bcrypt from "bcrypt";
import express from "express";
import {
  UserModel,
  validateUserLogin,
  validateUserPin,
} from "../Models/Users.model.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Allow user to login with username or email
  const userInfo = await UserModel.findOne({
    $or: [
      { username: req.body.userCredential },
      { email: req.body.userCredential },
    ],
  });

  if (!userInfo)
    return res.send({
      status: 401,
      message: "Invalid username or email",
    });
  const validatePassword = bcrypt.compareSync(
    req.body.password,
    userInfo.password
  );
  if (!validatePassword)
    return res.send({
      status: 401,
      message: "Invalid password",
    });
  try {
    // Generate Token and pass though header
    const token = await userInfo.generateAuthToken();
    res.header("authorization", token).json({
      status: 200,
      message: "Successfull Login",
      user: userInfo._id,
      access_token: token,
    });
  } catch (error) {
    res.send({
      status: 401,
      message: `Error: ${error}`,
    });
  }
});

router.post("/pin", async (req, res) => {
  const { error } = validateUserPin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const userInfo = await UserModel.findOne({ pin: req.body.pin });
    if (!userInfo)
      return res.send({
        status: 401,
        message: "Invalid Pin",
      });
    // Generate Token and pass though header
    const token = await userInfo.generateAuthToken();
    res.header("authorization", token).json({
      status: 200,
      message: "Successfull Login",
      user: userInfo._id,
      access_token: token,
    });
  } catch (error) {
    res.send({
      status: 404,
      message: `Error: ${error}`,
    });
  }
});

export default router;
