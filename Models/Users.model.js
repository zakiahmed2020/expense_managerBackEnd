const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

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
  });
  return userValidation.validate(user);
};

const updateValidation = (user) => {
  const updateValidation = Joi.object({
    avatar: Joi.string(),
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().min(10).required(),
    username: Joi.string().required(),
  });
  return updateValidation.validate(user);
};

const validateUserLogin = (user) => {
  const loginValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
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

module.exports = {
  UserModel,
  validateUsers,
  validateUserLogin,
  updateValidation,
};
