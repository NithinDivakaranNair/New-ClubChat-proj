import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { sendMessage,getMessages,getConversations } from "../controllers/messageController.js";

const router=express.Router();

// router.get("/conversations",protectRoute,getConversations);
// router.get("/:otherUserId",protectRoute,getMessages);
// router.post("/",protectRoute,sendMessage);
router.get("/conversations",getConversations);
router.get("/:otherUserId",getMessages);
router.post("/",sendMessage);


 export default router; 