import mongoose from "mongoose";
const collabrationSchema = new mongoose.Schema({
    BusinessFirmName :{
            type:String,
            required:true,
            trim:true
    },
    email:{
            type:String,
            required:true,
            trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    contactPersonName:{
        type:String,
        required:true,
        trim:true
    },
    contact:{
        type:Number,
        required:true,
        trim:true
    }
});
export const Collabration = mongoose.model("collabration",collabrationSchema);