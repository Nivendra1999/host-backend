import mongoose from "mongoose";

const followerSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    followersUser:[{
        friendUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    }]
});

export const Follower = mongoose.model("follower",followerSchema);