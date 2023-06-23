import { getConversationIncludeTwoUserId, getConversationOfUser, newConversation } from "../controller/conversation.controller.js";

import express from "express";

const router = express.Router();

//new conv



router.post("/", newConversation); 

//get conv of a user

router.get("/:userId", getConversationOfUser);

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", getConversationIncludeTwoUserId );


export default router;