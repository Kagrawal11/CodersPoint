import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import {
    getCommentsForProblem,
    createComment,
    deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/problem/:problemId").get(isLoggedIn, getCommentsForProblem);
router.route("/problem/:problemId").post(isLoggedIn, createComment);
router.route("/:id").delete(isLoggedIn, deleteComment);

export default router;
