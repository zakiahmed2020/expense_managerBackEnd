import mongoose from "mongoose";
import Joi from "joi";

const transectionsSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    type: {
      required: true,
      type: String,
      enum: ["Expense", "Income"],
    },

    title: {
      required: true,
      type: String,
    },

    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

function validateTransections(user) {
  const userValidation = Joi.object({
    userID: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    amount: Joi.number().required(),
  });
  return userValidation.validate(user);
}
const transModel = mongoose.model("transection", transectionsSchema);

export { transModel, validateTransections };
