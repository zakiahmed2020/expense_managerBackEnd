import Auth from "../Middlewares/Auth.middleware.js";
import express, { response } from "express";
import { transModel } from "../Models/Transactions.model.js";
import { UserModel } from "../Models/Users.model.js";
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
      select: "-_id amount",
    });
    let bal = 0;
    // data = data.map((item) => {
    //   let obj = JSON.parse(JSON.stringify(item));
    //   obj.type == "Income" ? (bal += obj.amount) : (bal -= obj.amount);
    //   obj.runBalance = bal;
    //   let newObject = { ...obj, ...obj.userID };
    //   delete newObject.userID;
    //   return newObject;
    // });
    data.forEach((item) => {
      if (item.type == "Income") {
        bal += item.amount;
      } else if (item.type == "Expense") {
        bal -= item.amount;
      }
    });
    console.log((data.runBalance = bal));
    res.send({ info: data });
    // res.send(info);
  } catch (err) {
    console.log(err);
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});
// report
router.get("/info/:id", async function (req, res) {
  const userID = req.params.id;
  try {
    let user = await userInfo(userID);
    let balance = await userBalance(userID);
    // object laso celiyay waxa ka mid userIncomes,userExpenses, UserBalance, object distructor
    const { userIncomes, userExpenses, UserBalance } = balance;
    res.send({
      status: 200,
      message: "Successfull",
      user: user,
      userincome: userIncomes,
      userExpense: userExpenses,
      balance: UserBalance,
    });
  } catch (e) {
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});

// get user info by id
const userInfo = async function (userID) {
  const user = await UserModel.findById(userID).select(
    "-_id -accountNo -phone -password -username -email -createdAt -updatedAt -__v -pin"
  );
  return user;
};

// fucntion returns totalUserIncome,totalUserExpense,currentUserBalance
const userBalance = async function (userID) {
  // get all user incomes adigo check greynayo useridinu jiro iyo type kisu yahay expense
  // wuxu soo celinya array oo ey ku jiran objects like [{...},{...}]
  const userIncome = await transModel.find({
    userID: userID,
    type: "Income",
  });
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
const userIncome = async function (userID) {
  const userIncome = await transModel.find({ userID: userID, type: "Income" });
  const userTotalIncome = userIncome.map((user) => user.amount);
  return userTotalIncome;
};

// user Income
router.get("/userIncome/:id", async function (req, res) {
  const userID = req.params.id;
  try {
    const user_Income = await userIncome(userID);
    if (isEmpty(user_Income)) {
      res.send({
        status: 200,
        message: "this user does not have any income",
        userIncome: [0],
      });
    } else {
      res.send({
        status: 200,
        message: "Successfull",
        userIncome: user_Income,
      });
    }
  } catch (e) {
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});

// Calculate user Expense using map function return array of user expense
const userExpense = async function (userID) {
  const userExpense = await transModel.find({
    userID: userID,
    type: "Expense",
  });
  const userTotalExpense = userExpense.map((user) => user.amount);
  return userTotalExpense;
};

// user Expenses
router.get("/userExpense/:id", async (req, res) => {
  const userID = req.params.id;
  try {
    const user_Expense = await userExpense(userID);
    if (isEmpty(user_Expense)) {
      res.send({
        status: 200,
        message: "this user does not have any expense",
        userExpense: [0],
      });
    } else {
      res.send({
        status: 200,
        message: "Successfull",
        userExpense: user_Expense,
      });
    }
  } catch (e) {
    res.send({
      status: 500,
      message: `Error: ${e}`,
    });
  }
});

const Statements = { router, userBalance };

export default Statements;
