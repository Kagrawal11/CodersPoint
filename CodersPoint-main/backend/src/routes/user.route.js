import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";

const router = Router();

router.use(isLoggedIn); // Protect all routes

router.get("/profile", getUserProfile);

export default router;