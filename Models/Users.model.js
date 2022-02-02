const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    accountNo: {
      required: true,
      type: Number,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
function validateUsers(user) {
  const userValidation = Joi.object({
    name: Joi.string().min(3).required(),
    // accountNo:Joi.number().min(10).required(),
    phone: Joi.number().min(10).required(),
    pin: Joi.string().required(),
  });
  return userValidation.validate(user);
}
UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      phone: this.phone,
      accountNo: this.accountNo,
      isAdmin: this.isAdmin,
    },
    process.env.SECRET_ACCESS_TOKEN
  );
  return token;
};
const UserModel = mongoose.model("users", UserSchema);

exports.UserModel = UserModel;
exports.validateUsers = validateUsers;
