const mongoose= require("mongoose");

const stationSchema = new mongoose.Schema({
    _id:String,
    name:String,
    lat:Number,
    lon:Number,
    lines:[String],
    
})