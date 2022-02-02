const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { UserModel, validateUsers } = require("../Models/Users.model");

router.post("/login", async (req, res) => {
  const { error } = validateUsers(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const userInfo = await UserModel.findOne({ pin: req.body.pin });
    if (!userInfo) return res.status(404).send({ message: "Invalid pin" });
    const validatePin = await bcrypt.compare(req.body.pin, userInfo.pin);
    if (!validatePin) return res.send({ message: "Invalid Pin" });
    // Generate Token and pass though header
    const token = await userInfo.generateAuthToken();
    res.header("authorization", token).json({
      success: 200,
      userInfo: userInfo,
      token: token,
    });
  } catch (error) {
    res.send({
      status: 404,
      message: `Error: ${error}`,
    });
  }
});

// router.post("/", async (req, res) => {
//   const { error } = validateUsers(req.body);
//   if (error) return res.status(400).send(error.details[0].message);
//   // get user Email from database
//   const userinfo = await UserModel.findOne({ pin: req.body.pin });
//   // compare 2 plain Pin and hash Pin
//   const validatepin = await bcrypt.compare(req.body.pin, userinfo.pin);
//   if (!validatepin)
//     return res.send({
//       status: 404,
//       message: "Invalid pin",
//     });
//   // all conditions checked then send a response to the client
//   const token = await userinfo.generateAuthToken();
//   res.header("authorization", token).send({
//     status: 200,
//     message: "correct",
//     token: token,
//   });
// });

// function validate(req) {
//   const userValidation = Joi.object({
//     pin: Joi.string().min(4).required(),
//   });
//   return userValidation.validate(req);
// }

module.exports = router;
