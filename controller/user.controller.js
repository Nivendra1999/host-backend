import { User } from "../model/user.model.js"
import { Follower } from "../model/follower.model.js";
import { Following } from "../model/following.model.js";
import { Help } from "../model/help.model.js";
import { Post } from "../model/post.model.js";
import { transporter } from "../model/email.js";
import { Collabration } from "../model/collaboration.model.js";
import jwt from "jsonwebtoken";
import { Spam } from "../model/spam.model.js";
import { validationResult } from "express-validator";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { Notification } from "../model/notification.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const help = async (request, response) => {
    try {
        let user = await User.findOne({ email: request.body.email });
        if (user)
            return response.status(200).json({ result: await new Help({ userId: user._id, problem: request.body.problem }).save(), status: true });
        return response.status(400).json({ message: "bad request" });
    } catch (err) {
        console.log(err)
        return response.status(500).json({ result: "internal server error", status: false });
    }
}

export const follower = async (request, response) => {
    try {
       
        let user = await Follower.findOne({ userId: request.body.userId });
        if (user) {
            if (user.followersUser.some((follower) => follower.friendUserId == request.body.friendUserId))
                return response.status(200).json({ message: "already followed...", status: true });
            user.followersUser.push({ friendUserId: request.body.friendUserId });
            let savedCart = await user.save();
            return response.status(200).json({ message: "successfull added...", status: true });
        }
        else {
          
            let saved = await Follower.create({ userId: request.body.userId, followersUser: [{ friendUserId: request.body.friendUserId }] });
            return response.status(200).json({ message: "followed", status: true });
        }
    }
    catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const following = async (request, response) => {
    try {
        let user = await Following.findOne({ userId: request.body.userId });
        if (user) {
            if (user.followingsuser.some((following) => following.friendUserId == request.body.friendUserId))
                return response.status(200).json({ message: "already followed...", status: true });
            user.followingsuser.push({ friendUserId: request.body.friendUserId });
            let save = await user.save();
            return response.status(200).json({ message: "successfull added...", status: true });
        }
        else {
            let saved = await Following.create({
                userId: request.body.userId,
                followingsuser: [{ friendUserId: request.body.friendUserId }]
            });
            return response.status(200).json({ message: "succesfull added...", status: true });
        }
    }
    catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const getAllFollower = async (request, response) => {
    Follower.findOne({ userId: request.params.userId })
        .populate("followersUser.friendUserId").then(result => {
            return response.status(200).json({ message: "ok", result: result })
        }).catch(err => {
            console.log(err)
        })


}

export const getAllFollowing = async (request, response) => {
    Following.findOne({ userId: request.params.userId })
        .populate("followingsuser.friendUserId").then(result => {
            return response.status(200).json({ message: "ok", result: result })
        }).catch(err => {
            console.log(err)
        })

}

export const unFollow = async (request, response) => {
    try {
        let user = await Following.findOne({ userId: request.body.userId });
        let index = user.followingsuser.findIndex((user) => { return user.friendUserId == request.body.friendUserId });
        user.followingsuser.splice(index, 1);
        user.save();
        return response.status(200).json({ message: "successfully unfollowed..", status: true });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ result: "internal server error", status: false });
    }
}

export const removeFollower = async (request, response) => {
    try {
        let user = await Follower.findOne({ userId: request.body.userId });
        let index = user.followersUser.findIndex((user) => { return user.friendUserId == request.body.friendUserId });
        user.followersUser.splice(index, 1);
        user.save();
        return response.status(200).json({ message: "successfully removed..", status: true });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ result: "internal server error", status: false });
    }
}

export const spam = (request, response) => {
    Spam.create(request.body)
        .then(result => {
            return response.status(200).json({ result: "user was spam", status: true });
        })
        .catch(err => {
            return response.status(500).json({ err: "Internal server error", status: false });
        })
}

export const searchProfileByKeyword = async (request, response) => {
    try {
        return response.status(200).json({ user: await User.find({ userName: { $regex: request.params.keyword, $options: "i" } }), status: true });
    } catch (err) {
        return response.status(500).json({ error: "Internal Server Error", status: false });
    }
}

export const deleteAccount = async (request, response) => {
    let user = await User.findOne({ _id: request.body.userId })
    let status = await bcrypt.compare(request.body.password, user.password);
    if (status) {
        User.deleteOne({ _id: request.body.userId })
            .then(result => {
                return response.status(200).json({ message: "user deleted..", status: true });
            }).catch(err => {
                return response.status(500).json({ message: "Internal Server Error", status: false });
            });
    }
    else {
        return response.status(400).json({ message: "bad request", user: user, status: true })
    }
}

export const signUp = async (request, response, next) => {
    try {
        let error = validationResult(request);
        if (!error.isEmpty())
            return response.status(400).json({ error: "bad request", status: false, message: error.array() });
        let email = await User.findOne({ email: request.body.email })
        if (email)
            return response.status(400).json({ message: "already exist", status: false });
        let salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);
        let user = await User.create(request.body)
        return (user)
            ? response.status(200).json({ user: { ...user.toObject(), password: undefined }, token: jwt.sign({ subject: user.email }, 'fdfxvcvnreorevvvcrerer'), status: true })
            : response.status(401).json({ message: "Unauthorized person", status: false })
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "internal server error", status: false });
    }
}


export const uploadPost = (request, response) => {
    request.body.date = new Date().toString().substring(4, 15).replaceAll(' ', '/');
    Post.create(request.body).then(result => {
        return response.status(200).json({ message: "post uploaded" })
    }).catch(err => {
        return response.status(500).json({ message: "internal server errore" })
    })
}

export const getAllPost = async (request, response) => {
    try {
        let post = await Post.find({ userId: request.params.userId });
        if (post)
            return response.status(200).json({ message: "data found", result: post, status: true })
        return response.status(500).json({ message: "post not found", status: false })

    } catch (err) {
        console.log(err)
        return response.status(500).json({ message: "internal server errore", status: false })
    }

}

export const forgotPassword = async (request, response) => {
    try {
        if (await User.findOne({ email: request.body.email })) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const mailOptions = {
                from: "ajey6162@gmail.com",
                to: request.body.email,
                subject: "OTP code",
                text: "" + otp
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return response.status(500).json({ message: 'Error sending OTP code' });
                } else {
                    return response.status(200).json({ otp: otp, status: true });
                }
            })
        } else
            return response.status(400).json({ message: "bad request", status: false });

    } catch (err) {
        return response.status(500).json({ message: "internal server errore", status: false })

    }


}

export const setNewPassword = async (request, response) => {
    try {
        let error = validationResult(request);
        if (!error.isEmpty())
            return response.status(400).json({ error: "bad request", status: false, message: error.array() });
        let salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(request.body.newPassword, salt);
        let user = await User.findOne({ email: request.body.email });
        const filter = { _id: user._id };
        const update = { password: newPassword };
        const options = {
            new: true,
            runValidators: true
        };
        User.findOneAndUpdate(filter, update, options)
            .then(updatedUser => {
                if (updatedUser) {
                    return response.status(200).json({ status: true })

                } else {
                    return response.status(500).json({ message: "internal server errore", status: false })

                }
            })
            .catch(error => {
                return response.status(500).json({ message: "internal server errore", status: false })

            });
    } catch (err) {
        return response.status(500).json({ message: "internal server errore", status: false })
    }
}
export const changePassword = async (request, response) => {
    try {
        let error = validationResult(request);
        if (!error.isEmpty())
            return response.status(400).json({ error: "bad request", status: false, message: error.array() });
        let user = await User.findOne({ _id: request.body.userId });
        if (!await bcrypt.compare(request.body.oldPassword, user.password))
            return response.status(400).json({ error: "bad request", status: false, message: error.array() });

        let salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(request.body.password, salt);
        const filter = { _id: request.body.userId };
        const update = { password: newPassword };
        const options = {
            new: true,
            runValidators: true
        };
        User.findOneAndUpdate(filter, update, options)
            .then(updatedUser => {
                if (updatedUser) {
                    return response.status(200).json({ status: true })

                } else {
                    return response.status(500).json({ message: "internal server errore", status: false })

                }
            })
            .catch(error => {
                return response.status(500).json({ message: "internal server errore", status: false })
            });
    } catch (err) {
        return response.status(500).json({ message: "internal server errore", status: false })

    }
}

export const getUserById = async (request, response) => {
    try {
        let user = await User.findOne({ _id: request.params.userId });
        return (user)
            ? response.status(200).json({ user: { ...user.toObject(), password: undefined }, status: true })
            : response.status(500).json({ error: "user not found", status: false });
    } catch (err) {
        return response.status(500).json({ error: "Internal server error", status: false });
    }
}

export const getUserByUserName = async (request, response) => {
    await User.find({ _id: request.params.userName })
        .then(result => {
            if (!result.length == 0)
                return response.status(200).json({ user: { ...result[0].toObject(), password: undefined }, status: true });
            return response.status(500).json({ error: "user not found", status: false });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error", status: false });
        });
}

export const getUserByArt = async (request, response) => {
    await User.find({ art: request.params.art })
        .then(result => {
            if (!result.length == 0)
                return response.status(200).json({ user: result, status: true });
            return response.status(500).json({ error: "user not found", status: false });
        })
        .catch(err => {
            (err);
            return response.status(500).json({ error: "Internal server error", status: false });
        });
}

export const updateProfileById = async (request, response) => {

    let user = await User.findById(request.body._id);

    if (user.profilePhoto && request.file) {
        const imagePath = path.join(__dirname, '../public/profilephoto', user.profilePhoto);
        fs.unlink(imagePath, (err) => {
            if (err) console.log(err);
        });
    }
    let file = "";
    if (request.file) {
        file = await (request.file) ? request.file.filename : null;
        request.body.profilePhoto = file;
    }

    User.updateOne({ _id: request.body._id }, request.body).then(result => {
        return response.status(200).json({ message: "user was updated", user: request.body, status: true });
    })
        .catch(err => {
            return response.status(500).json({ err: "Internal server error", status: false });
        })
}

export const getCollabrationDetails = async (request, response) => {
    await Collabration.create(request.body)
        .then(result => {
            return response.status(200).json({ message: "Collabration success", status: true });
        })
        .catch(err => {
            return response.status(500).json({ error: "Internal server error", status: false });
        })
}

export const CollabrationCancel = async (request, response) => {
    await Collabration.findOneAndRemove({ _id: request.params._id })
        .then(result => {
            return response.status(200).json({ message: "Collabration cancel", status: true });
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ err: "Internal server error", status: false });
        })
}
export const deletepost = async (request, response) => {
    const userid = request.params.userid;
    const postid = request.params.postid;
    try {
        let post = await Post.find({ _id: postid });
        if (post[0].userId == userid) {
            const postpath = path.join(__dirname, '../public/images', post[0].file);
            fs.unlink(postpath, (err) => {
                if (err) console.log(err);
            });
            await Post.findByIdAndRemove({ _id: postid }).then(result => {
                return response.status(200).json({ message: "post deleted" })
            }).catch(err => {
                return response.status(500).json({ message: "internal server error" })
            })
        }
        else
            return response.status(400).json("bad request");
    } catch (err) {
        return response.status(500).json("internal server errore");

    }

}




export const savePost = async (request, response) => {
    try {
        let user = await User.findOne({ _id: request.body.userId });
        if (user) {
            if (user.savePosts.some((item) => item.postId == request.body.postId)) {
                let index = user.savePosts.findIndex((item) => { return item.postId == request.body.postId });
                user.savePosts.splice(index, 1);
                await user.save();
                return response.status(200).json({ message: " you unsave the post", status: true })
            } else {
                user.savePosts.push({ postId: request.body.postId });
                user.save();
                return response.status(200).json({ message: "postSaved", status: true });
            }
        }
    }
    catch (err) {
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const signUps = async (request, response, next) => {
    try {
        let error = validationResult(request);
        if (!error.isEmpty())
            return response.status(400).json({ error: "bad request", status: false, message: error.array() });
        let email = await User.findOne({ email: request.body.email })
        if (email)
            return response.status(400).json({ message: "already exist", status: false });
        let salt = await bcrypt.genSalt(10);
        request.body.password = await bcrypt.hash(request.body.password, salt);
        let user = await User.create(request.body)
        return (user)
            ? response.status(200).json({ user: { ...user.toObject(), password: undefined }, token: jwt.sign({ subject: user.email }, 'fdfxvcvnreorevvvcrerer'), status: true })
            : response.status(401).json({ message: "Unauthorized person", status: false })
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const signIn = async (request, response, next) => {
    try {
        const user = await User.findOne({ $or: [{ email: request.body.usernameOrEmail }, { userName: request.body.usernameOrEmail }] });
        if (!user)
            return response.status(400).json({ error: "bad request", status: false })
        return (await bcrypt.compare(request.body.password, user.password))
            ? response.status(200).json({ user: { ...user.toObject(), password: undefined }, token: jwt.sign({ subject: user.email }, 'fdfxvcvnreorevvvcrerer'), status: true })
            : response.status(401).json({ message: "Unauthorized person", status: false })
    }
    catch (err) {
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const signOut = async (request, response) => {
    try {
        return response.status(200).json({ message: "user logged out", status: true });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ error: "internal server error", status: false });
    }
}

export const isLoggedIn = async (request, response) => {
    if (!request.session.user)
        return response.status(401).json({ message: "Unauthorized person", status: false })
    return response.status().json({ session: request.session.user })
}


export const notification = (request, response) => {
    Notification.find({ currentUserId: request.params.userid }).populate("currentPost").populate("frienduserid").then(result => {
        return response.status(200).json({ notification: result.reverse(), status: false });
    }).catch(err => {
        return response.status(500).json({ error: "internal server error", status: false });

    })
}


export const getSavedPosts = async (request, response, next) => {
    try {
        User.findById({ _id: request.body.userId })
            .populate("savePosts.postId").then((result) => {
                return response.status(200).json({ savedPosts: result.savePosts, status: true });
            })
    } catch (err) {
        return response.status(500).json({ error: "internal server error", status: false });
    }
}



export const getfriend = (request, response) => {
    User.findById(request.params.friendid).then(result => {

        return response.status(200).json({ friend: result });
    }).catch(err => {
        return response.status(500).json({ message: "internal server errore" });
    });
}


// export const addUser = async (request, response, next) => {
//     try {
//         request.body.users.map( async (user) => {
//             let salt = await bcrypt.genSalt(10);
//             user.password = await bcrypt.hash(user.password, salt);
//             await User.create(user);
//         })
//         return response.status(200).json({ message: "user added", status: true });
//     } catch (err) {
//         console.log(err);
//         return response.status(500).json({ error: "internal server error", status: false });
//     }
// }