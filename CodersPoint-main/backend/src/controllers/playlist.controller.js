import ApiResponse from "../lib/api-response.js";
import ApiError from "../lib/api-error.js";
import logger from "../logger/index.js";
import { db } from "../lib/db.js";

export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        const existingPlaylist = await db.playlist.findFirst({
            where: {
                name: name,
            },
        });

        if (existingPlaylist) {
            const error = new ApiError(400, `Playlist already exists.`);
            return res.status(400).json(error);
        }

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId,
            },
        });

        return res
            .status(201)
            .json(
                new ApiResponse(201, "Playlist created successfully.", playlist)
            );
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in creating playlist.");
        res.status(500).json(error);
    }
};

export const getAllListDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlistDetails = await db.playlist.findMany({
            where: { userId },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });

        if (!playlistDetails) {
            const error = new ApiError(404, `No playlist found.`);
            return res.status(404).json(error);
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Playlists fetched successfully.",
                    playlistDetails
                )
            );
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in fetching all playlist.");
        res.status(500).json(error);
    }
};

export const getPlaylistDetails = async (req, res) => {
    try {
        const { playlistId } = req.params;
        // FIXED: Defined userId so the query below doesn't crash
        const userId = req.user.id; 

        const playlistDetails = await db.playlist.findUnique({
            where: {
                // FIXED: Now 'userId' is actually defined
                userId, 
                id: playlistId,
            },
            include: {
                problems: {
                    include: {
                        problem: true,
                    },
                },
            },
        });

        if (!playlistDetails) {
            const error = new ApiError(404, `No playlist with the id found.`);
            return res.status(404).json(error);
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Playlist fetched successfully.",
                    playlistDetails
                )
            );
    } catch (err) {
        logger.error(err);
        // Note: passing 'playlistDetails' here might throw error if it's undefined, 
        // but strictly fixing the crash, we leave the message.
        const error = new ApiError(
            500,
            "Error in fetching a playlist."
        );
        res.status(500).json(error);
    }
};

export const addProblemToPlaylist = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body; 

    try {
        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res
                .status(400)
                .json({ error: "Invalid or missing problemIds" });
        }
        
        // FIXED: Ensure model name is 'problemsInPlaylist' (plural)
        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playListId: playlistId, 
                problemId,
            })),
            skipDuplicates: true, // Recommended: prevent crashing if problem is already in playlist
        });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    "Problems added to playlist successfully.",
                    problemsInPlaylist
                )
            );
    } catch (err) {
        logger.error(err);
        const error = new ApiError(
            500,
            "Error in adding problem to a playlist."
        );
        res.status(500).json(error);
    }
};

export const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;

        const deletedPlaylist = await db.playlist.delete({
            where: {
                // FIXED: Mapped playlistId to the 'id' field
                id: playlistId, 
            },
        });

        // FIXED: Check 'deletedPlaylist' not the function 'deletePlaylist'
        if (!deletedPlaylist) {
            const error = new ApiError(404, `Playlist not found.`);
            return res.status(404).json(error);
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    "Playlist deleted successfully.",
                    deletedPlaylist
                )
            );
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in deleting a playlist.");
        res.status(500).json(error);
    }
};

export const deleteProblemFromPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { problemIds } = req.body;

        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            const error = new ApiError(400, `Invalid or missing problem ids.`);
            return res.status(400).json(error);
        }

        // FIXED: Correct model name (problemsInPlaylist) and field name (playListId)
        const deletedProblems = await db.problemsInPlaylist.deleteMany({
            where: {
                playListId: playlistId, 
                problemId: {
                    in: problemIds,
                },
            },
        });

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    "Problems deleted from playlist successfully.",
                    deletedProblems
                )
            );
    } catch (err) {
        logger.error(err);
        const error = new ApiError(
            500,
            "Error in deleting problem from a playlist."
        );
        res.status(500).json(error);
    }
};