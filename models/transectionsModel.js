const mongoose=require('mongoose');
const Joi=require('joi');

// const {UserseModel}=require('./userModel');
const transectionsSchema=new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    type:{
        required: true,
        type: String,
        enum:["expense","income"]     
    },
 
    description:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now, 
    }

   
},{timestamps: true})

function validateTransections(user){
    const userValidation= Joi.object({
        userID:Joi.string().required(),
        type:Joi.string().required(),
       
        description:Joi.string().required(),
        amount:Joi.number().required(),  
        date:Joi.date()
    });
    return userValidation.validate(user);
}
const transModel=mongoose.model("transection",transectionsSchema);
exports.validateTransections=validateTransections;
exports.transModel=transModel;
