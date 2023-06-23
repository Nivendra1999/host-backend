import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userName:{
        type:String,           
    },
    email:{
        type:String,                 
    },
    password:{
        type:String,
    },
    bio:{
        type:String,
    },
    profilePhoto:{
        type:String,
    }
})

export const Admin = mongoose.model("admin", adminSchema);
