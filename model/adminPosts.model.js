import mongoose from "mongoose";

const adminPostSchema = new mongoose.Schema({
    file: {
        type: String
    },
    caption: {
        type: String
    },
    locationOfYour: {
        type: String,
        default: "INDORE"
    },
    date: {
        type: String
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin"
    },
    interestedContestants: [{
        interestedContestantsUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    }],
    selectedContestants: [{
        selectedContestantsUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    }]
})

export const AdminPost = mongoose.model("adminPost", adminPostSchema);
