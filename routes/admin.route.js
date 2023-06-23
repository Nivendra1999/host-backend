import express from "express";
import { viewUsers,editProfile,selectedContestants,removeFromSelectedContestants,deletePost,viewInterestedContestants,viewSelectedContestants, interestedContestants, banUser,getBanUser,signUp,adminPost,unBanUser,viewSpam } from "../controller/admin.controller.js";

const router =express.Router();
router.post("/banUser",banUser)
router.get("/getBanUser",getBanUser)
router.get("/unBanUser",unBanUser)    
router.get("/viewSpam",viewSpam)       
router.post("/uploadPost",adminPost)  
router.post("/editProfile",editProfile);
router.get("/viewUsers",viewUsers);
router.get("/deletePost",deletePost);
router.get("/interestedContestants/:postId/:userId",interestedContestants);
router.get("/deletePost/:adminPostId",deletePost);
router.get("/viewInterestedContestants/:postId",viewInterestedContestants);
router.get("/viewInterestedContestants/accept/:postId/:userId",selectedContestants);
router.get("/viewSelectedContestants/:postId",viewSelectedContestants);
router.get("/removeFromSelectedContestants/:userId",removeFromSelectedContestants);


 
router.post("/signUp",signUp)       

export default router;