import { response } from "express";
import { AdminPosts } from "../model/admin.post.model.js";
import { User } from "../model/user.model.js";
import { Admin } from "../model/admin.model.js";
import { Spam } from "../model/spam.model.js";


export const editProfile = async (request, response, next) => {
    try {
        let admin = await Admin.updateOne({ _id: request.body.id }, {
            $set: {
                bio: request.body.bio,
                profilePhoto: request.body.profilePhoto                
            }
        })
        return response.status(200).json({ message: " Profile updated ... ", status: true })
    } catch (err) {
        return response.status(500).json({ message: " Profile updated failed ... ", status: false })
    }
}

export const viewUsers = (request, response, next) => {
    User.find().then(result => { return response.status(200).json({ allUsers: result, status: true }) })
    .catch(err => { return response.status(500).json({ error: "Internal server error", status: false }) })
}

export const deletePost = (request, response, next) => {
    AdminPosts.findOneAndRemove({ _id: request.params.adminPostId }).then(result => {
        return response.status(200).json({ message: "Post removed", status: true });
    }).catch(err => {
        return response.status(500).json({ error: "Internal Server Error", status: false });
    })
}

export const viewSelectedContestants = (request, response, next) => {
    AdminPosts.findById({ _id: request.params.postId }).populate("selectedContestants.selectedContestantsUserId")
        .then((result) => {
            return response.status(200).json({ viewSelectedContestants: result.selectedContestants, status: true, message: "data fatched" });
        }).catch(err => { return response.status(500).json({ error: "Internal server error", status: false }) })
}

export const viewInterestedContestants = (request, response, next) => {
    let status = AdminPosts.findById({ _id: request.params.postId }).populate("interestedContestants.interestedContestantsUserId")
        .then((result) => {
            return response.status(200).json({ viewInterestedContestants: result.interestedContestants, status: true, message: "data fatched" });
        }).catch(err => { return response.status(500).json({ error: "Internal server error", status: false }) })
}


export const interestedContestants = async (request, response) => {
    try {
        let post = await AdminPosts.findOne({ _id: request.params.postId });
        if (post) {
            if (post.interestedContestants.some((item) => item.interestedContestantsUserId == request.params.userId))
                return response.status(200).json({ message: "already Interested shown...", status: true });
            post.interestedContestants.push({ interestedContestantsUserId: request.params.userId });
            let savePost = await post.save();
            return response.status(200).json({ message: "successfull added...", status: true });
        }
    }
    catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const selectedContestants = async (request, response) => {
    try {
        let post = await AdminPosts.findById({ _id: request.params.postId });
        if (post) {
            if (post.selectedContestants.some((item) => item.selectedContestantsUserId == request.params.userId))
                return response.status(200).json({ message: "already selected...", status: true });            
            post.selectedContestants.push({ selectedContestantsUserId: request.params.userId });
            let saveSelectedContastants = await post.save();
            return response.status(200).json({ message: " selected successfull added...", status: true });
        }
    }
    catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const removeFromSelectedContestants = async (request,response,next)=>{
    try{
        AdminPosts.findByIdAndRemove({_id:request.params.userId})
        .then(result=>{return response.status(200).json({message:"id is removed",status:true})})
        .catch(err=>{return response.status(200).json({message:"something went wrong",status:false})})
    }catch(err){
        console.log(err)
        return response.status(500).json({error:"Internal server error",status:false});
    }
}

export const signUp = async (request, response) => {
    try {
        return response.status(200).json({ user: await Admin.create(request.body) });
    } catch (err) {
        return response.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const adminPost = (request, response) => {
    request.body.date = new Date().toString().substring(4, 15).replaceAll(' ', '/')
    AdminPosts.create(request.body).then(result => {
        return response.status(200).json({ message: "post added" });
    }).catch(err => {
        return response.status(500).json({ error: "internal server errore" })
    })
}

export const banUser = async (request, response) => {
    try {
        let user = await User.updateOne({ _id: request.body.userId }, { $set: { status: false } })
        if (user)
            return response.status(200).json({ message: "user banned" })
        return response.status(400).json({ error: "not ban try again" })
    } catch (err) {
        console.log(err);
        return response.status(500).json({ errore: "internal server errore" ,status:false})
    }
}

export const getBanUser = async (request, response) => {
    try {
        let banUser = await User.find({ status: false })
        if (!banUser)
            return response.status(200).json({ message: "no any ban user found" })
        return response.status(200).json({ bannedUser: banUser })
    } catch (err) {
        return response.status(500).json({ errore: "internal server errore" ,status:false});
    }

}

export const unBanUser = async (request, response) => {
    try {
        let user =await User.updateOne({ _id: request.body.userId }, { $set: { status: true } })
        if (user)
            return response.status(200).json({ message: "user unbanned" })
            return response.status(400).json({ error: "not ban try again" })
    } catch (err) {
        return response.status(500).json({ errore: "internal server errore" })
    }
}

export const viewSpam = (request, response, next) => {
    Spam.find()
        .then(result => {
            return response.status(200).json({ allSpamUser: result, status: true });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error", status: false });
        })
}

