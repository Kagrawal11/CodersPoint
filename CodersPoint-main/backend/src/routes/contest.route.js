import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import { checkAdmin } from "../middlewares/isAdminCheck.middleware.js";
import {
    createContest,
    getAllContests,
    getContestById,
    getContestLeaderboard,
} from "../controllers/contest.controller.js";

const router = express.Router();

router.route("/create-contest").post(isLoggedIn, checkAdmin, createContest);
router.route("/get-all-contests").get(isLoggedIn, getAllContests);
router.route("/get-contest/:id").get(isLoggedIn, getContestById);
router.route("/leaderboard/:id").get(isLoggedIn, getContestLeaderboard);

export default router;
