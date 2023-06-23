import mongoose from "mongoose";

const spamSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    reason:{
        type:String,
        require:true
    }
});

export const Spam = mongoose.model("spam",spamSchema);