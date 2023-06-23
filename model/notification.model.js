import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
     currentUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
     },
     currentPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
     },
     frienduserid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
     },
     frienduseract:{
        type:String
     }
})
export const Notification = mongoose.model("notification",notificationSchema);