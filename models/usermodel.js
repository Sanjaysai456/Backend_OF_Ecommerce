const mongoose = require('mongoose');

const userschema=mongoose.Schema({
    fullname:{
        type:String
    },
    email:String,
    password:String,
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],
    isAdmin:Boolean,
    orders:{
        type:Array,
        default:[]
    },
    contact:Number,
    picture:String
});
module.exports=mongoose.model("user" , userschema)