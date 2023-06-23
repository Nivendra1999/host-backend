import express from "express"
const router = express.Router();
import {follower, following, getAllFollower, getAllFollowing,updateProfileById, help, removeFollower,signUp, searchProfileByKeyword, spam, unFollow, getUserById, getUserByArt,getCollabrationDetails, CollabrationCancel, forgotPassword, deleteAccount, uploadPost, signIn, deletepost,notification, signOut, savePost, getSavedPosts, getfriend,setNewPassword,changePassword} from "../controller/user.controller.js"
import { verify } from "../middleware/tokenVarification.js";
import { body } from "express-validator";

import multer from "multer";
// import { conversationController, getConversastion } from "../controller/conversation.controller.js";
// import { getMessage, messageController } from "../controller/message.controller.js";
const upload = multer({ dest: "public/profilephoto/" })

router.post("/help",help);
router.post("/follower",follower);
router.post("/following",following);
router.get("/getAllFollowing/:userId",getAllFollowing);
router.get("/getAllFollower/:userId",getAllFollower);
router.post("/unFollow",unFollow);
router.post("/removeFollower",removeFollower);
router.post("/spam",spam);
router.get("/searchProfile/:keyword",searchProfileByKeyword);
router.get("/searchProfile/viewProfile/:_id",getUserById);
router.get("/searchByArt/:art",getUserByArt);
router.get("/searchById/:userId",getUserById);
router.post("/collabrationDetails",getCollabrationDetails);
router.get("/collabrationCancel/:_id",CollabrationCancel);
router.post("/updateprofile", upload.single("file"),updateProfileById);
router.post("/editProfile/setting/deleteAccount",deleteAccount);
router.post("/editProfile/setting/help",help);           
router.post("/signUp",
    body("name", "name is required").trim()
    .notEmpty().withMessage('Name is required')
    .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces')
    .isLength({ max: 50 }).withMessage('Name must not exceed 50 characters'),
    body("userName").notEmpty(),
    body("password").notEmpty().isStrongPassword({
        maxLength:8,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minLength:6
    }).withMessage("password must contain upercase,lowercase,number"),
    body("contact").isNumeric(),
    body("email").isEmail()
,signUp);                      
router.post("/uploadPost",uploadPost);
router.get("/notification/:userid",notification)
router.post("/signin",signIn)
router.post("/forgotPassword", forgotPassword);

router.post("/setNewPassword",body("newPassword").notEmpty().isStrongPassword({
    maxLength:8,
    minLowercase:1,
    minUppercase:1,
    minNumbers:1,
    minLength:6
}).withMessage("password must contain upercase,lowercase,number"),setNewPassword);

router.post("/changePassword",body("password").notEmpty().isStrongPassword({
    maxLength:8,
    minLowercase:1,
    minUppercase:1,
    minNumbers:1,
    minLength:6
}).withMessage("password must contain upercase,lowercase,number"),changePassword);
router.get("/signout", signOut);
router.get("/deletepost/:userid/:postid",deletepost);
router.post("/savePost",savePost)
router.post("/getSavedPosts",getSavedPosts);
router.get("/getfriend/:friendid",getfriend);



export default router;
