const Auth = require("../Middlewares/Auth.middleware");
const admin = require("../Middlewares/Admin.middleware");
const express = require("express");
const router = express.Router();
const {
  transModel,
  validateTransections,
} = require("../Models/Transactions.model");
const { userBalance } = require("./Statements.router");

// get user information by passing user id,and transection type expense or income
router.get("/usertransactions/:userID/:Transtype", async function (req, res) {
  try {
    let { userID, Transtype } = req.params;
    console.log(userID, Transtype);
    let Transection = await transModel.find({
      userID: userID,
      _id: Transtype,
    });
    res.send({
      status: 200,
      message: "Successfull",
      transaction: Transection,
    });
  } catch (e) {
    res.send({
      status: 400,
      message: `Error: ${e}`,
    });
  }
});

router.post("/usertransactions", async function (req, res) {
  // let body = {...req.body,t_name:req.body.name}
  // delete body.name
  const { error } = validateTransections(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const transInfo = new transModel({
    userID: req.body.userID,
    type: req.body.type,
    description: req.body.description,
    amount: req.body.amount,
    date: req.body.date,
  });
  //it comes from fucntion resturn it returns object;
  let balance = await userBalance(transInfo.userID);
  // object laso celiyay waxa ka mid UserBalance object distructor
  const { UserBalance } = balance;
  try {
    // check garee hadii user TotalAmunt kisa uu ka yarhay amount hada uu la baxayo
    // check gare type hadii uu expense yahay
    if (transInfo.type == "expense" && UserBalance < transInfo.amount) {
      res.json({
        message:
          "Check Your Balance, Your Expense Amount is Higher than Your Balance.",
        status: false,
      });
    } else {
      await transInfo.save();
      res.json({
        message: " successfully inserted.",
        status: 200,
        info: transInfo,
      });
    }
  } catch (error) {
    // res.send(error);
    console.log(error);
  }
});

router.put("/usertransactions/:id", async (req, res) => {
  const { id } = req.params;
  // const checkingID = await transModel.findById(id.trim());
  // if(!checkingID) return res.status(404).send("given id was not found");
  // const getTransaction = transModel.findById((c) => c._id === parseInt(id));
  // console.log(getTransaction)
  // if (!getTransaction) res.status(404).send("The transections ID was not found");

  const transInfo = {
    date: req.body.date,
    description: req.body.description,
    amount: req.body.amount,
  };

  const upData = await transModel.findByIdAndUpdate(req.params.id, transInfo, {
    new: true,
  });
  res.json({
    message: " successfully updated.",
    status: 200,
    info: upData,
  });
});

router.delete("/:id", async function (req, res) {
  try {
    const transInfo = await transModel.findByIdAndRemove(req.params.id);
    if (!transInfo) return res.status(400).send("ID was not found");
    res.send({
      status: 200,
      message: "Deleted successfully",
    });
  } catch (e) {
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});
module.exports = router;
