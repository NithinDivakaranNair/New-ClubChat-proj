import express from "express"
const  router=express.Router();
import { createPost,
          getPost,
          deletePost,
          likeUnlikePost,
          replyToPost,
          getFeedPosts,
          getUserPosts } from "../controllers/postController.js";

router.get("/feed", getFeedPosts);
router.post('/create', createPost)
router.get("/:id",getPost)
router.get("/user/:username",getUserPosts);
router.delete("/:id",deletePost)
router.put("/like/:id",likeUnlikePost)
router.put("/reply/:id",replyToPost)

export default router;




// import express from "express"
// const  router=express.Router();
// import { createPost,
//           getPost,
//           deletePost,
//           likeUnlikePost,
//           replyToPost,
//           getFeedPosts,
//           getUserPosts } from "../controllers/postController.js";
// import protectRoute from "../middlewares/protectRoute.js";

// router.get("/feed",protectRoute, getFeedPosts);
// router.post('/create',protectRoute, createPost)
// router.get("/:id",getPost)
// router.get("/user/:username",getUserPosts);
// router.delete("/:id",protectRoute,deletePost)
// router.put("/like/:id",protectRoute,likeUnlikePost)
// router.put("/reply/:id",protectRoute,replyToPost)

// export default router;