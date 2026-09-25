import { db } from "../lib/db.js";
import ApiError from "../lib/api-error.js";
import ApiResponse from "../lib/api-response.js";
import logger from "../logger/index.js";

export const getAdminAnalytics = async (req, res) => {
    try {
        const [totalUsers, totalProblems, totalSubmissions] = await Promise.all([
            db.user.count(),
            db.problem.count(),
            db.submission.count(),
        ]);

        // Submissions per day for the last 30 days.
        const since = new Date();
        since.setDate(since.getDate() - 30);
        const recentSubmissions = await db.submission.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true },
        });
        const byDay = new Map();
        for (const sub of recentSubmissions) {
            const day = sub.createdAt.toISOString().slice(0, 10);
            byDay.set(day, (byDay.get(day) || 0) + 1);
        }
        const submissionsOverTime = [...byDay.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, count]) => ({ date, count }));

        // Most-attempted problems + per-problem pass rate.
        const grouped = await db.submission.groupBy({
            by: ["problemId"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
        });
        const problems = await db.problem.findMany({
            where: { id: { in: grouped.map((g) => g.problemId) } },
            select: { id: true, title: true, difficulty: true },
        });
        const problemMap = new Map(problems.map((p) => [p.id, p]));

        const mostAttempted = await Promise.all(
            grouped.map(async (g) => {
                const accepted = await db.submission.count({
                    where: { problemId: g.problemId, status: "Accepted" },
                });
                return {
                    problemId: g.problemId,
                    title: problemMap.get(g.problemId)?.title || "Unknown",
                    difficulty: problemMap.get(g.problemId)?.difficulty,
                    submissionCount: g._count.id,
                    passRate: g._count.id > 0 ? Math.round((accepted / g._count.id) * 100) : 0,
                };
            })
        );

        return res.status(200).json(
            new ApiResponse(200, "Analytics fetched successfully.", {
                totalUsers,
                totalProblems,
                totalSubmissions,
                submissionsOverTime,
                mostAttempted,
            })
        );
    } catch (err) {
        logger.error(err);
        const error = new ApiError(500, "Error in fetching analytics.");
        res.status(500).json(error);
    }
};
