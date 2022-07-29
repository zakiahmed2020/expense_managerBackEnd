import mongoose from "mongoose";
import _ from "lodash";
import jwt from "jsonwebtoken";
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
  try {
    const userInfo = await UserModel.findOne({ username: req.body.username });
    if (!userInfo) return res.status(406).send({ message: "Invalid username" });
    const validatePassword = bcrypt.compareSync(
      req.body.password,
      userInfo.password
    );
    if (!validatePassword) return res.send({ message: "Invalid password" });
    // Generate Token and pass though header
    const token = await userInfo.generateAuthToken();
    res.header("authorization", token).json({
      success: 200,
      userInfo: userInfo._id,
      access_token: token,
    });
  } catch (error) {
    res.send({
      status: 404,
      message: `Error: ${error}`,
    });
  }
});

router.post("/loginWithPin", async (req, res) => {
  const { error } = validateUserPin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const userInfo = await UserModel.findOne({ pin_Number: req.body.pin_Number });
    if (!userInfo) return res.status(406).send({ message: "Invalid Pin" });
    // Generate Token and pass though header
    const token = await userInfo.generateAuthToken();
    res.header("authorization", token).json({
      success: 200,
      userInfo: userInfo._id,
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
