import { db } from "../lib/db.js";
import ApiError from "../lib/api-error.js";
import ApiResponse from "../lib/api-response.js";
import logger from "../logger/index.js";

export const getCommentsForProblem = async (req, res) => {
    try {
        const { problemId } = req.params;

        const comments = await db.comment.findMany({
            where: { problemId },
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
        });

        return res
            .status(200)
            .json(new ApiResponse(200, "Comments fetched successfully.", comments));
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in fetching comments.");
        res.status(500).json(error);
    }
};

export const createComment = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            const error = new ApiError(400, "Comment content is required.");
            return res.status(error.statusCode).json(error);
        }

        const comment = await db.comment.create({
            data: {
                content: content.trim(),
                userId: req.user.id,
                problemId,
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
        });

        return res
            .status(201)
            .json(new ApiResponse(201, "Comment posted successfully.", comment));
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in posting comment.");
        res.status(500).json(error);
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await db.comment.findUnique({ where: { id } });
        if (!comment) {
            const error = new ApiError(404, "Comment not found.");
            return res.status(error.statusCode).json(error);
        }

        if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
            const error = new ApiError(403, "You can only delete your own comments.");
            return res.status(error.statusCode).json(error);
        }

        await db.comment.delete({ where: { id } });

        return res
            .status(200)
            .json(new ApiResponse(200, "Comment deleted successfully."));
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in deleting comment.");
        res.status(500).json(error);
    }
};
