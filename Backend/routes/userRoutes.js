import  express from "express";
import { signupUser , loginUser , logoutUser , followUnfollowUser , updateUser  , getUserProfile ,getSuggestedUsers , freezeAccount} from "../controllers/userController.js";
const router= express.Router();
import protectRoute from  "../middlewares/protectRoute.js"


// Route :1 for signup

router.post("/signup" , signupUser)
router.post("/login" , loginUser)
router.post("/logout",logoutUser)
// protectRoute is  a middleware which we are using to check whether user is logged in or not to perform particular task

router.post("/follow/:id" , protectRoute, followUnfollowUser)
router.put("/update/:id" , protectRoute, updateUser)
// step 3 create a route in  backend (next step in usercontroller)
router.put("/freeze" , protectRoute, freezeAccount)

router.get("/profile/:query" , getUserProfile)
router.get("/suggested" ,protectRoute  ,getSuggestedUsers)
export default router;
