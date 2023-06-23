import mongoose from "mongoose";

const collaborationFormSchema = new mongoose.Schema({
    BusinessFirmName :{
        type:String
    },
    email :{
        type:String,
        unique:true
    },
    address:{
        type:String
    },
    contactPersonName:{
        type:String
    },
    contact:{
        type:String
    }
})

export const CollaborationForm = mongoose.model("collaborationForm", collaborationFormSchema);
