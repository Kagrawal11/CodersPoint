import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { checkAdmin } from "../middlewares/isAdminCheck.middleware.js";
import { getAdminAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.route("/").get(isLoggedIn, checkAdmin, getAdminAnalytics);

export default router;
