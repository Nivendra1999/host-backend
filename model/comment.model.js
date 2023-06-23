import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    
    friendUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    userPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    comment: String
})

export const Comment = mongoose.model("comment", commentSchema);
