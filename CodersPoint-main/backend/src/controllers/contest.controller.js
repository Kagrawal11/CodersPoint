import { db } from "../lib/db.js";
import ApiError from "../lib/api-error.js";
import ApiResponse from "../lib/api-response.js";
import logger from "../logger/index.js";

const getStatus = (contest) => {
    const now = new Date();
    if (now < contest.startTime) return "UPCOMING";
    if (now > contest.endTime) return "ENDED";
    return "LIVE";
};

export const createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problemIds } = req.body;

        if (!title || !startTime || !endTime) {
            const error = new ApiError(400, "title, startTime and endTime are required.");
            return res.status(error.statusCode).json(error);
        }

        if (new Date(endTime) <= new Date(startTime)) {
            const error = new ApiError(400, "endTime must be after startTime.");
            return res.status(error.statusCode).json(error);
        }

        const contest = await db.contest.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                problems: {
                    create: (problemIds || []).map((problemId) => ({ problemId })),
                },
            },
            include: { problems: { include: { problem: true } } },
        });

        return res
            .status(201)
            .json(new ApiResponse(201, "Contest created successfully.", contest));
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in creating contest.");
        res.status(500).json(error);
    }
};

export const getAllContests = async (req, res) => {
    try {
        const contests = await db.contest.findMany({
            orderBy: { startTime: "desc" },
            include: { problems: true },
        });

        const withStatus = contests.map((c) => ({ ...c, status: getStatus(c) }));

        return res
            .status(200)
            .json(new ApiResponse(200, "Contests fetched successfully.", withStatus));
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in fetching contests.");
        res.status(500).json(error);
    }
};

export const getContestById = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await db.contest.findUnique({
            where: { id },
            include: { problems: { include: { problem: true } } },
        });

        if (!contest) {
            const error = new ApiError(404, "Contest not found.");
            return res.status(error.statusCode).json(error);
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, "Contest fetched successfully.", {
                    ...contest,
                    status: getStatus(contest),
                })
            );
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in fetching contest.");
        res.status(500).json(error);
    }
};

// Ranks users by how many of the contest's problems they solved (Accepted
// submission) within the contest window. Computed at read-time - fine at
// this scale, denormalize into a stored score if contests get large/frequent.
export const getContestLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;

        const contest = await db.contest.findUnique({
            where: { id },
            include: { problems: true },
        });

        if (!contest) {
            const error = new ApiError(404, "Contest not found.");
            return res.status(error.statusCode).json(error);
        }

        const problemIds = contest.problems.map((p) => p.problemId);

        if (problemIds.length === 0) {
            return res
                .status(200)
                .json(new ApiResponse(200, "Contest leaderboard fetched successfully.", []));
        }

        const acceptedSubmissions = await db.submission.findMany({
            where: {
                problemId: { in: problemIds },
                status: "Accepted",
                createdAt: { gte: contest.startTime, lte: contest.endTime },
            },
            select: { userId: true, problemId: true },
        });

        const solvedByUser = new Map();
        for (const sub of acceptedSubmissions) {
            const set = solvedByUser.get(sub.userId) || new Set();
            set.add(sub.problemId);
            solvedByUser.set(sub.userId, set);
        }

        const users = await db.user.findMany({
            where: { id: { in: [...solvedByUser.keys()] } },
            select: { id: true, name: true, image: true },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));

        const leaderboard = [...solvedByUser.entries()]
            .map(([userId, set]) => ({
                userId,
                name: userMap.get(userId)?.name,
                image: userMap.get(userId)?.image,
                solvedCount: set.size,
            }))
            .sort((a, b) => b.solvedCount - a.solvedCount)
            .map((entry, i) => ({ rank: i + 1, ...entry }));

        return res
            .status(200)
            .json(new ApiResponse(200, "Contest leaderboard fetched successfully.", leaderboard));
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in fetching contest leaderboard.");
        res.status(500).json(error);
    }
};
