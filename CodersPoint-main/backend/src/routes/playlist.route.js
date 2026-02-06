import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";
import {
    addProblemToPlaylist,
    createPlaylist,
    deletePlaylist,
    deleteProblemFromPlaylist,
    getAllListDetails,
    getPlaylistDetails,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(isLoggedIn); // Apply middleware to all routes below

// FIXED: Specific routes go FIRST
router.route("/create-playlist").post(createPlaylist); 
router.route("/").get(getAllListDetails);

// FIXED: Dynamic routes (/:id) go LAST
router.route("/:playlistId").get(getPlaylistDetails);
router.route("/:playlistId").delete(deletePlaylist);

router.route("/:playlistId/add-problem/:problemId").post(addProblemToPlaylist);
router.route("/:playlistId/remove-problem/:problemId").delete(deleteProblemFromPlaylist);

export default router;