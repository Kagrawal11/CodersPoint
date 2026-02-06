import { db } from "../lib/db.js";
import ApiError from "../lib/api-error.js";
import ApiResponse from "../lib/api-response.js";
import logger from "../logger/index.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get User Details
        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                image: true, 
            },
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // 2. Get Solved Problems Stats (Grouped by Difficulty)
        const solvedStats = await db.problem.groupBy({
            by: ["difficulty"],
            where: {
                solvedBy: {
                    some: {
                        userId: userId,
                    },
                },
            },
            _count: {
                id: true,
            },
        });

        // Format stats (e.g., { EASY: 5, MEDIUM: 2, HARD: 0 })
        const stats = {
            EASY: 0,
            MEDIUM: 0,
            HARD: 0,
            total: 0
        };

        solvedStats.forEach((stat) => {
            if (stat.difficulty) {
                stats[stat.difficulty] = stat._count.id;
                stats.total += stat._count.id;
            }
        });

        // 3. Get Recent Submissions (Last 5)
        const recentSubmissions = await db.submission.findMany({
            where: { userId },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                problem: {
                    select: {
                        title: true,
                        difficulty: true,
                    },
                },
            },
        });

        return res.status(200).json(
            new ApiResponse(200, "User profile fetched successfully", {
                user,
                stats,
                recentSubmissions,
            })
        );
    } catch (error) {
        logger.error("Error fetching profile:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch profile"));
    }
};