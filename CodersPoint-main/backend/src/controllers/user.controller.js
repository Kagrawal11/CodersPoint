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

export const updateProfile = async (req, res) => {
    try {
        const { image } = req.body;

        if (typeof image !== "string") {
            return res.status(400).json(new ApiError(400, "image must be a string URL"));
        }

        const user = await db.user.update({
            where: { id: req.user.id },
            data: { image },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json(
            new ApiResponse(200, "Profile updated successfully", user)
        );
    } catch (error) {
        logger.error("Error updating profile:", error);
        return res.status(500).json(new ApiError(500, "Failed to update profile"));
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const grouped = await db.problemSolved.groupBy({
            by: ["userId"],
            _count: { problemId: true },
            orderBy: { _count: { problemId: "desc" } },
            take: 50,
        });

        const users = await db.user.findMany({
            where: { id: { in: grouped.map((g) => g.userId) } },
            select: { id: true, name: true, image: true },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));

        const leaderboard = grouped
            .filter((g) => userMap.has(g.userId))
            .map((g, i) => ({
                rank: i + 1,
                userId: g.userId,
                name: userMap.get(g.userId).name,
                image: userMap.get(g.userId).image,
                solvedCount: g._count.problemId,
            }));

        return res.status(200).json(
            new ApiResponse(200, "Leaderboard fetched successfully", leaderboard)
        );
    } catch (error) {
        logger.error("Error fetching leaderboard:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch leaderboard"));
    }
};