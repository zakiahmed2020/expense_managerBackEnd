const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { UserModel, validateUserLogin } = require("../Models/Users.model");

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

module.exports = router;
