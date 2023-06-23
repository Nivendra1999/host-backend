import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    contact:{
        type:Number,
        required:true,
        trim:true
    },
    gender:{
        type:String,
        required:false,
        trim:true
    },
    address:{
        type:String,
        required:false,
        trim:true
    },
    art:{
        type:String,
        required:false,
        trim:true
    },
    about:{
        type:String,
        required:false,
        trim:true
    },
    profilePhoto:{
        type:String,
        default:"",
        required:false,
        trim:true
    },
    status:{
        type:Boolean,
        required:false,
        trim:true,
        default:true
    },
    savePosts: [{
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    }] 

});

export const User = mongoose.model("user",userSchema);

    