import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    problem:{
        type:String,
        require:true,
        trim:true
    }
})

export const Help = mongoose.model("help",helpSchema); 