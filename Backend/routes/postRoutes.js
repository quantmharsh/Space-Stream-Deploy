import express from "express";
import { createPost ,getPost  ,deletePost , likeUnlikePost ,replyPost , getFeedPost , getUserPosts} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router= express.Router();
router.get("/feed" ,protectRoute , getFeedPost)
router.get("/user/:username", getUserPosts);
router.post("/create" ,protectRoute,createPost);
router.get("/:id" ,getPost);
router.delete("/:id" , protectRoute ,deletePost)
router.put("/like/:id" ,protectRoute , likeUnlikePost)
router.put("/reply/:id" ,protectRoute , replyPost)

export default router;
