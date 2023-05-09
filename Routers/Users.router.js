import fs from "fs";
import mongoose from "mongoose";
import _ from "lodash";
import bcrypt from "bcrypt";
import upload from "../helper/Multer.js";
import express from "express";
import Auth from "../Middlewares/Auth.middleware.js";
import {
  UserModel,
  validateUsers,
  ValidateChangePassword,
} from "../Models/Users.model.js";

const router = express.Router();

router.get("/me", Auth, async function (req, res) {
  const user = await UserModel.findById(req.user._id).select("-pin");
  // .select('-password '); this means ka reeb password ka xogta aad so celneysid
  // .select('-password -email'); email and password ka reeb xogta
  res.send(user);
});

router.get("/", Auth, async function (req, res) {
  try {
    const usersInfo = await UserModel.find().select("-pin");
    res.send({
      status: 200,
      message: "Successfull",
      Users: usersInfo,
    });
  } catch (e) {
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});

router.get("/:id", Auth, async function (req, res) {
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
      status: 500,
      message: `Error: ${e}`,
    });
  }
});

router.post("/create-user", upload.single("avatar"), async function (req, res) {
  const { error } = validateUsers(req.body);
  if (error)
    return res.send({ status: 406, message: error.details[0].message });
  const checkUsername = await UserModel.findOne({
    username: req.body.username,
  });
  if (checkUsername)
    return res.send({
      status: 406,
      message: `username: ${checkUsername.username} is already exists...`,
    });

  const chechPin = await UserModel.findOne({ pin: req.body.pin });
  if (chechPin)
    return res.send({
      status: 406,
      message: `Please make sure to put a different pin number`,
    });

  // get avatar in file
  const avatar = req.file ? req.file.path : "uploads\\default.png";

  try {
    let AccountNo = 0;
    let [respnse] = await UserModel.find({}).sort({ createdAt: -1 }).limit(1);
    if (respnse) {
      AccountNo = respnse.accountNo + 1;
    } else {
      AccountNo = 3000;
    }

    const userinfo = new UserModel({
      avatar: avatar,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
      password: req.body.password,
      pin: req.body.pin,
      accountNo: AccountNo,
    });

    const salt = await bcrypt.genSalt(10);
    userinfo.password = await bcrypt.hash(userinfo.password, salt);
    const result = await userinfo.save();

    let sendData = { ...result._doc };
    delete sendData.password;
    delete sendData.__v;

    res.send({
      status: 200,
      message: "User Registered Successfully",
      userInfo: sendData,
    });
  } catch (er) {
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});

router.delete("/:id", Auth, async function (req, res) {
  try {
    const userInfo = await UserModel.findByIdAndRemove(req.params.id);
    if (!userInfo) return res.status(404).send("ID was not found");
    res.send({
      status: 200,
      message: "Seccessfully Deleted",
    });
  } catch (e) {
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});

//
router.put("/passUpdate", Auth, async function (req, res) {
  const { phone, password } = req.body;
  const userInfo = await UserModel.findOne({
    phone: phone,
  });
  if (!userInfo)
    return res.send({
      status: 404,
      message: `your ${phone} is incorrect, please try again !`,
    });

  const { _id } = userInfo;
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt);

  const _ = await UserModel.findByIdAndUpdate(
    _id,
    {
      password: pass,
    },
    { new: true }
  );
  res.send({
    status: 200,
    message: "Your Password Updated SuccessFully",
  });
});

// updating user info without password
// router.put(
//   "/update-userinfo/:id",
//   upload.single("avatar"),
//   async (req, res) => {
//     const { error } = updateValidation(req.body);
//     if (error)
//       return res.status(404).send({ message: `${error.details[0].message}` });
//     try {
//       const id = await UserModel.findById(req.params.id);
//       if (!id) return res.status(404).send({ message: "Not Found" });

//       const checkUsername = await UserModel.findOne({
//         username: req.body.username,
//       }).lean();

//       if (checkUsername) {
//         res.send({
//           message: `username: ${checkUsername.username} is already exists...`,
//         });
//       } else {
//         // get avatar in file. check the file has path.
//         const avatar = req.file ? req.file.path : "uploads\\default.png";

//         // delete old image. if is not equal default.
//         if (id.avatar !== "uploads\\default.png") {
//           fs.unlink(id.avatar, function (err) {
//             if (err) return console.log(err);
//             // if no error, file has been deleted successfully
//             console.log("File deleted!");
//           });
//         }

//         const userdataUpdate = await UserModel.findByIdAndUpdate(
//           req.params.id,
//           {
//             avatar: avatar,
//             name: req.body.name,
//             email: req.body.email,
//             phone: req.body.phone,
//             username: req.body.username,
//           },
//           { new: true }
//         );
//         res.send({
//           status: 200,
//           message: "Updated Successfully",
//           user: userdataUpdate,
//         });
//       }
//     } catch (e) {
//       res.send({
//         status: 500,
//         message: `Error: ${e}`,
//       });
//     }
//   }
// );

router.put("/changePassword/:id", async (req, res) => {
  const { error } = ValidateChangePassword(req.body);
  if (error) res.send({ message: `${error.details[0].message}` });
  const user = await UserModel.findOne({ _id: req.params.id });
  if (!user)
    return res.status(404).send({
      status: 404,
      message: "User not found",
    });

  try {
    // check old password
    const validPass = bcrypt.compareSync(req.body.oldpassword, user.password);
    if (!validPass)
      return res.status(404).send({
        status: 404,
        message: "Old password is incorrect",
      });

    // check new password and confirm password
    if (req.body.newpassword !== req.body.confirmpassword)
      return res.status(404).send({
        status: 404,
        message: "New password and confirm password are not same",
      });

    // update new password
    const salt = await bcrypt.genSalt(10);
    const newpassword = await bcrypt.hash(req.body.newpassword, salt);
    await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        password: newpassword,
      },
      { new: true }
    );
    res.send({
      status: 200,
      message: "Password Updated Successfully",
    });
  } catch (e) {}
});

export default router;
