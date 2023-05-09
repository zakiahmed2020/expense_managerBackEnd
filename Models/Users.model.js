import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";

const UserSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pin: {
      type: Number,
      required: true,
    },
    accountNo: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const validateUsers = (user) => {
  const userValidation = Joi.object({
    avatar: Joi.string(),
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().min(10).required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    pin: Joi.number().required(),
  });
  return userValidation.validate(user);
};

const updateValidation = (user) => {
  const updateValidation = Joi.object({
    avatar: Joi.string(),
    name: Joi.string().min(3),
    email: Joi.string().email().required(),
    phone: Joi.number().min(10).required(),
    username: Joi.string().required(),
  });
  return updateValidation.validate(user);
};

const validateUserLogin = (user) => {
  const loginValidation = Joi.object({
    userCredential: Joi.string().required(),
    password: Joi.string().required(),
  });
  return loginValidation.validate(user);
};

const validateUserPin = (user) => {
  const loginValidation = Joi.object({
    pin: Joi.number().required(),
  });
  return loginValidation.validate(user);
};

const ValidateChangePassword = (user) => {
  const loginValidation = Joi.object({
    oldpassword: Joi.string().min(6).required(),
    newpassword: Joi.string().min(6).required(),
    confirmpassword: Joi.string().min(6).required(),
  });
  return loginValidation.validate(user);
};

UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRET_ACCESS_TOKEN
  );
  return token;
};

const UserModel = mongoose.model("users", UserSchema);

export {
  UserModel,
  validateUsers,
  validateUserPin,
  validateUserLogin,
  ValidateChangePassword,
  updateValidation,
};
