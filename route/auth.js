const config = require("config");
const _=require('lodash');
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { UserModel, validateUsers } = require(".././models/userModel");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // get user Email from database
  const userinfo = await UserModel.findOne({ username: req.body.username });
  // check email if exists in database
  if (!userinfo) return res.json({status:false,message:"invalid username or password"});
  // compare 2 plain password and hash password
  const validatePassword = await bcrypt.compare(
    req.body.password,
    userinfo.password
  );
  if (!validatePassword)
    return res.json({status:false,message:"invalid username or password"});
  // all conditions checked then send a response to the client
  const token= await userinfo.generateAuthToken();
        res.header("x-auth-token",token).json({status:true,message:"correct",token:token});
  // const token= await userinfo.generateAuthToken();

  // res.send(token)

  // res.json({
  //   message: "sucessfully logged",
  //   success: true,
  //   data:userinfo
  // });
});

function validate(req) {
  const userValidation = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().required(),
  });
  return userValidation.validate(req);
}

module.exports = router;
