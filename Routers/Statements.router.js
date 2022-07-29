import Auth from "../Middlewares/Auth.middleware.js";
import express from "express";
import { transModel } from "../Models/Transactions.model.js";
const router = express.Router();

router.use(Auth);

// Check if the arry item is empty
function isEmpty(array) {
  return array.length == 0;
}

// get user transection by populating user and it transections
router.get("/:id", async function (req, res) {
  const userID = req.params.id;
  let data;
  try {
    data = await transModel.find({ userID: userID }).populate({
      path: "userID",
      model: "users",
      select: "-_id avatar name accountNo phone amount email",
    });
    let bal = 0;
    data = data.map((item) => {
      let obj = JSON.parse(JSON.stringify(item));
      obj.type == "income" ? (bal += obj.amount) : (bal -= obj.amount);
      obj.runBalance = bal;
      let newObject = { ...obj, ...obj.userID };
      delete newObject.userID;
      return newObject;
    });

    res.send({ info: data });
    // res.send(info);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err });
  }
});
// report
router.get("/info/:id", async function (req, res) {
  const userID = req.params.id;
  //it comes from fucntion resturn it returns object;
  let balance = await userBalance(userID);
  // object laso celiyay waxa ka mid userIncomes,userExpenses, UserBalance, object distructor
  const { userIncomes, userExpenses, UserBalance } = balance;
  res.send({
    status: 200,
    message: "Successfull",
    userincome: userIncomes,
    userExpense: userExpenses,
    balance: UserBalance,
  });
});

// fucntion returns totalUserIncome,totalUserExpense,currentUserBalance
let userBalance = async function (userID) {
  // get all user incomes adigo check greynayo useridinu jiro iyo type kisu yahay expense
  // wuxu soo celinya array oo ey ku jiran objects like [{...},{...}]
  const userIncome = await transModel.find({ userID: userID, type: "Income" });
  const userExpense = await transModel.find({
    userID: userID,
    type: "Expense",
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

// Calculate user Income using map function
let userIncome = async (userID) => {
  const userIncome = await transModel.find({ userID: userID, type: "Income" });
  const userTotalIncome = userIncome.map((user) => user.amount);
  return userTotalIncome;
};

// user Income 
router.get("/userIncome/:id", async function (req, res) {
  const userID = req.params.id;
  const user_Income = await userIncome(userID);
  if (isEmpty(user_Expense)) {
    res.send({
      status: 200,
      userIncome: 0,
    });
  } else {
    res.send({
      status: 200,
      message: "Successfull",
      userIncome: user_Income,
    });
  }
});

// Calculate user Expense using map function return array of user expense
let userExpense = async (userID) => {
  const userExpense = await transModel.find({
    userID: userID,
    type: "Expense",
  });
  const userTotalExpense = userExpense.map((user) => user.amount);
  return userTotalExpense;
};

router.get("/userExpense/:id", async (req, res) => {
  const userID = req.params.id;
  const user_Expense = await userExpense(userID);
  if (isEmpty(user_Expense)) {
    res.send({
      status: 200,
      userExpense: 0,
    });
  } else {
    res.send({
      status: 200,
      userExpense: user_Expense,
    });
  }
});

const Statements = { router, userBalance };

export default Statements;
