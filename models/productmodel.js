const mongoose = require('mongoose');

const productschema=mongoose.Schema({
    image:Buffer,
    name:String,
    panelcolor:String,
    
    price:Number,
    textcolor:String,
    bgcolor:String,
    discount:{
        type:Number,
        default:0
    }
});
module.exports=mongoose.model("product" , productschema)