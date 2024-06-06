import express from "express";
const router = express.Router();

import protectRoute from "../middlewares/protectRoute.js";

import { signupUser,
         loginUser,
         logoutUser,
         followUnFollowUser,
         updateUser,
         getUserProfile,
         freezeAccount,
         getSuggestedUsers } from "../controllers/userController.js";

// router.get('/profile/:username', getUserProfile);
router.get('/profile/:query', getUserProfile);
router.get("/suggested" ,protectRoute,getSuggestedUsers)

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id',protectRoute, followUnFollowUser);
router.put('/update/:id',protectRoute, updateUser);
// router.get('/profile/:id', getUserProfile);
router.put("/freeze",protectRoute,freezeAccount);

export default router;
