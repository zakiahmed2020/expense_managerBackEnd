const mongoose = require("mongoose");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");
const { UserModel, validateUsers } = require(".././models/userModel");

router.get("/me", auth, async function (req, res) {
  const user = await UserModel.findById(req.user._id).select("-password");
  // .select('-password '); this means ka reeb password ka xogta aad so celneysid
  // .select('-password -email'); email and password ka reeb xogta
  res.send(user);
});
router.get("/", async function (req, res) {
  try {
    const userInfo = await UserModel.find();
    // res.send(userInfo);
    res.send(userInfo)

  } catch (error) {
    res.send(error);
  }
});
router.get("/:id", async function (req, res) {
  const userInfo = await UserModel.findById(req.params.id);
  res.send(userInfo);
});
router.post("/", async function (req, res) {
  const { error } = validateUsers(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const checkUsername = await UserModel.findOne({ username: req.body.username });
  if (checkUsername) return res.json({
    message: "This username alreday exists..",
    status: false,
  })
  try {
    let AccountNo = 0;
    let [respnse]=await UserModel.find({})
      .sort({ createdAt: -1 })
      .limit(1)
      if(respnse){
        console.log(respnse);
        AccountNo = respnse.accountNo+1;
        
      }else{
        AccountNo=3000;

      }
    const userinfo = new UserModel({
      name: req.body.name,
      phone: req.body.phone,
      username: req.body.username,
      password: req.body.password,
      accountNo: AccountNo,
    });
    const salt = await bcrypt.genSalt(10);
    userinfo.password = await bcrypt.hash(userinfo.password, salt);
    await userinfo.save();
    res.json({
      message: "User Registered Successfully",
      status: true,
    });
  } catch (err) {
    console.error(err);
  }
});
router.delete("/:id", async function (req, res) {
  const expenseInfo = await UserModel.findByIdAndRemove(req.params.id);
  if (!expenseInfo) return res.status(400).send("ID was not found");
  res.send(expenseInfo);
});


// updating user's password only (forgetpassword)
// "/:userID/:Transtype"
router.put("/passUpdate", async function (req, res) {
  const {username,phone,password}=req.body
  const userInfo = await UserModel.findOne({username:username,phone:phone});
  if (!userInfo) return res.json({status:false,message:"username or phone is incorrect, please try again !"});
  // res.send(userInfo)

  const {_id}=userInfo
  const salt = await bcrypt.genSalt(10);
  const pcript_password = await bcrypt.hash(password, salt);
  // res.send(pcript_password)
  
  const passwordUpdate = await UserModel.findByIdAndUpdate(_id,
    { 
      password: pcript_password,
    },
    { new: true }
  );
  res.json({status:true,message:"Your Password Updated SuccessFully"});
});
module.exports = router;
