import { Router } from "express";
import { getUserProfile, updateProfile, getLeaderboard } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

const router = Router();

router.use(isLoggedIn); // Protect all routes

router.get("/profile", getUserProfile);
router.patch("/profile", updateProfile);
router.get("/leaderboard", getLeaderboard);

export default router;