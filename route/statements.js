const admin = require("../middleware/admin");
const Auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
// router.use(Auth)
const {transModel, validateTransections,} = require("../models/transectionsModel");

// get user transection by populating user and it transections
router.get("/:id", async function (req, res) {
    const userID = req.params.id;
    let data;
    try {
      data = await transModel.find({ userID: userID }).populate({
        path: "userID",
        model: "users",
        select: "-_id name accountNo phone amount email",
      });
      let bal = 0;
      data = data.map((item) => {
        let obj = JSON.parse(JSON.stringify(item));
       obj.type == "income" ? (bal += obj.amount) : (bal -= obj.amount);
       obj.runBalance =bal;
        let newObject = {...obj, ...obj.userID };
        delete newObject.userID;
        return newObject;
      });
    
      // console.log("from data" + data);
      
      res.json({info:data});
      // res.send(info);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, msg: err });
    }
  });
  // report
  router.get("/info/:id", async function (req, res) {
    const userID  = req.params.id;
    //it comes from fucntion resturn it returns object;
    let balance = await userBalance(userID);
    // object laso celiyay waxa ka mid userIncomes,userExpenses, UserBalance, object distructor
    const { userIncomes, userExpenses, UserBalance } = balance;
  
    res.json({
      userincome: userIncomes,
      userExpense: userExpenses,
      balance: UserBalance,
    });
  });
  // fucntion returns totalUserIncome,totalUserExpense,currentUserBalance

  let userBalance = async function (userID) {
    // get all user incomes adigo check greynayo useridinu jiro iyo type kisu yahay expense
    // wuxu soo celinya array oo ey ku jiran objects like [{...},{...}]
    const userIncome = await transModel.find({ userID: userID, type: "income" });
    const userExpense = await transModel.find({
      userID: userID,
      type: "expense",
    });
    // make total by a user add
    //all user incomes it returns like summary Total:300 like that
    const userTotalIncome = userIncome.reduce(
      (total, item) => total + item.amount,
      0
    );
    const userTotalExpense = userExpense.reduce(
      (total, item) => total + item.amount,
      0
    );
    let balance = userTotalIncome - userTotalExpense;
    const userlistInfo = {
      userIncomes: userTotalIncome,
      userExpenses: userTotalExpense,
      UserBalance: balance,
    };
    return userlistInfo;
  };

  
module.exports = { 
    router:router,
    userBalance:userBalance
  }