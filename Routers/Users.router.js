const fs = require("fs");
const mongoose = require("mongoose");
const _ = require("lodash");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
// const auth = require("../Middlewares/Auth.middleware");
const { UserModel, validateUsers } = require("../Models/Users.model");
const upload = require("../Utils/Multer");

router.get("/me", async function (req, res) {
  const user = await UserModel.findById(req.user._id).select("-pin");
  // .select('-password '); this means ka reeb password ka xogta aad so celneysid
  // .select('-password -email'); email and password ka reeb xogta
  res.send(user);
});

router.get("/", async function (req, res) {
  try {
    const usersInfo = await UserModel.find().select("-pin");
    res.send({
      status: 200,
      message: "Successfull",
      Users: usersInfo,
    });
  } catch (e) {
    res.send({
      status: 404,
      message: `Error: ${e}`,
    });
  }
});

router.get("/:id", async function (req, res) {
  try {
    const userinfo = await UserModel.findById(req.params.id);
    if (!userinfo)
      return res.status(404).send({
        status: 404,
        message: "User not found",
      });
    res.send({
      status: 200,
      message: "S",
    });
  } catch (e) {
    res.send({
      status: 404,
      message: `Error: ${e}`,
    });
  }
});

router.post("/create-user", upload.single("avatar"), async function (req, res) {
  const { error } = validateUsers(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const checkUsername = await UserModel.findOne({
    username: req.body.username,
  });
  
  // get avatar in file
  const avatar = req.file ? req.file.path : "uploads\\default.png";

  if (checkUsername)
    return res.send({
      message: "This username alreday exists..",
      status: false,
    });
  try {
    let AccountNo = 0;
    let [respnse] = await UserModel.find({}).sort({ createdAt: -1 }).limit(1);
    if (respnse) {
      console.log(respnse);
      AccountNo = respnse.accountNo + 1;
    } else {
      AccountNo = 3000;
    }

    const userinfo = new UserModel({
      name: req.body.name,
      phone: req.body.phone,
      username: req.body.username,
      pin: req.body.pin,
      accountNo: AccountNo,
      avatar: avatar,
    });
    const salt = await bcrypt.genSalt(10);
    userinfo.pin = await bcrypt.hash(userinfo.pin, salt);
    const result = await userinfo.save();
    res.send({
      message: "User Registered Successfully",
      status: 200,
      result: result,
    });
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", async function (req, res) {
  try {
    const expenseInfo = await UserModel.findByIdAndRemove(req.params.id);
    if (!expenseInfo) return res.status(400).send("ID was not found");
    res.send({
      status: 200,
      message: "Seccessfully Deleted",
    });
  } catch (e) {
    res.send({
      status: false,
      message: `Error: ${e}`,
    });
  }
});

// updating user's password only (forgetpassword)
// "/:userID/:Transtype"
router.put("/passUpdate", async function (req, res) {
  const { phone, pin } = req.body;
  const userInfo = await UserModel.findOne({
    phone: phone,
  });
  if (!userInfo)
    return res.send({
      status: 404,
      message: "your phone is incorrect, please try again !",
    });
  // res.send(userInfo)

  const { _id } = userInfo;
  const salt = await bcrypt.genSalt(10);
  const pcript_pin = await bcrypt.hash(pin, salt);
  // res.send(pcript_pin)

  const pinUpdate = await UserModel.findByIdAndUpdate(
    _id,
    {
      pin: pcript_pin,
    },
    { new: true }
  );
  res.send({
    status: 200,
    message: "Your Password Updated SuccessFully",
  });
});

router.put("/update-user/:id", upload.single("avatar"), async (req, res) => {
  const { error } = validateUsers(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    console.log(req.body);
    const id = await UserModel.findById(req.params.id);
    if (!id) return res.status(400).send({ message: "ID was not found" });

    // get avatar in file. check the file has path.
    const avatar = req.file ? req.file.path : "uploads\\default.png";

    // delete old image. if is not equal default.
    if (id.avatar !== "uploads\\default.png") {
      fs.unlink(id.avatar, function (err) {
        if (err) return console.log(err);
        // if no error, file has been deleted successfully
        // console.log("File deleted!");
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = bcrypt.hashSync(req.body.password, salt);
    console.log(hashPass);
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        username: req.body.username,
        password: hashPass,
        avatar: avatar,
      },
      { new: true }
    );
    res.send({
      status: 200,
      message: "Successfully Updated",
      updateUser: updateUser,
    });
  } catch (e) {
    res.send({
      status: 400,
      message: `Error: ${e}`,
    });
  }
});
module.exports = router;
