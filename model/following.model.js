import mongoose from "mongoose";

const followingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    followingsuser:[{
        friendUserId :{
            type:mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    }]
}) 

export const Following = mongoose.model("following",followingSchema);