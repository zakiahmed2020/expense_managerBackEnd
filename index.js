const config=require('config');
const mongoose=require('mongoose');
const express=require('express');
const app= express();
const cors = require("cors")

const transections=require('./route/transectionsRoute')
const statements=require('./route/statements')
const users=require('./route/userRoute');
const auth=require('./route/auth');
const Auth = require('./middleware/auth');

// if(!config.has('jwtPriviteKey')){
//     console.error("FETAIL ERROR:jwtPriviteKey is not defined.");
//     process.exit(1); 
// }
// let token="jwtPriviteKey";
// if(!token){
//     console.error("FETAIL ERROR:jwtPriviteKey is not defined.");
//     process.exit(1);
// }

app.use(cors())
app.use(express.json());

// routes
app.use('/api/transection',transections);
app.use('/api/statements/',statements.router);
statements.userBalance();
app.use('/api/users/',users);
app.use('/api/auth/',auth);
// connection
mongoose.connect("mongodb://localhost/expenseManager")
.then(()=>console.log("Connected successfully mangodb"))
.catch(err=>console.log("not connected mongodb",err));

// listening port
const port=process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`running port ${port}`)
})

