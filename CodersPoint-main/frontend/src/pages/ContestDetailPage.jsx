import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader, Trophy, Medal, ChevronRight, ListChecks } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const difficultyBadge = {
    EASY: "badge-success",
    MEDIUM: "badge-warning",
    HARD: "badge-error",
};

const rankStyles = {
    1: "text-warning",
    2: "text-base-content/60",
    3: "text-accent",
};

const ContestDetailPage = () => {
    const { id } = useParams();
    const { authUser } = useAuthStore();
    const [contest, setContest] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [contestRes, leaderboardRes] = await Promise.all([
                    axiosInstance.get(`/contests/get-contest/${id}`),
                    axiosInstance.get(`/contests/leaderboard/${id}`),
                ]);
                setContest(contestRes.data.data);
                setLeaderboard(leaderboardRes.data.data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    if (isLoading || !contest) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <div className="animate-fade-in-up space-y-8">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="font-display text-3xl font-bold">{contest.title}</h1>
                        <span
                            className={`badge badge-sm ${
                                contest.status === "LIVE"
                                    ? "badge-success"
                                    : contest.status === "UPCOMING"
                                    ? "badge-warning"
                                    : "badge-neutral"
                            }`}
                        >
                            {contest.status}
                        </span>
                    </div>
                    {contest.description && (
                        <p className="mt-2 text-base-content/60">{contest.description}</p>
                    )}
                    <p className="mt-2 text-xs text-base-content/40">
                        {new Date(contest.startTime).toLocaleString()} —{" "}
                        {new Date(contest.endTime).toLocaleString()}
                    </p>
                </div>

                <div>
                    <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
                        <ListChecks className="h-5 w-5 text-primary" />
                        Problems
                    </h2>
                    <div className="glass-panel divide-y divide-white/5 overflow-hidden rounded-2xl">
                        {contest.problems.map(({ problem }) => (
                            <Link
                                key={problem.id}
                                to={`/problem/${problem.id}`}
                                className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-base-100/40"
                            >
                                <span className="font-semibold text-base-content">
                                    {problem.title}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`badge badge-sm font-semibold ${
                                            difficultyBadge[problem.difficulty] || "badge-neutral"
                                        }`}
                                    >
                                        {problem.difficulty}
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-base-content/30" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
                        <Trophy className="h-5 w-5 text-primary" />
                        Leaderboard
                    </h2>
                    {leaderboard.length === 0 ? (
                        <div className="glass-panel flex flex-col items-center gap-2 rounded-2xl px-8 py-10 text-center">
                            <Trophy className="h-7 w-7 text-base-content/25" />
                            <p className="text-sm font-medium text-base-content/50">
                                No one's solved a contest problem yet.
                            </p>
                        </div>
                    ) : (
                        <div className="glass-panel divide-y divide-white/5 overflow-hidden rounded-2xl">
                            {leaderboard.map((entry) => (
                                <div
                                    key={entry.userId}
                                    className={`flex items-center gap-4 px-5 py-3.5 ${
                                        entry.userId === authUser?.id ? "bg-primary/10" : ""
                                    }`}
                                >
                                    <div
                                        className={`flex w-8 shrink-0 items-center justify-center font-display text-lg font-bold ${
                                            rankStyles[entry.rank] || "text-base-content/40"
                                        }`}
                                    >
                                        {entry.rank <= 3 ? (
                                            <Medal className="h-5 w-5" />
                                        ) : (
                                            entry.rank
                                        )}
                                    </div>
                                    <div className="avatar">
                                        <div className="w-8 rounded-full">
                                            <img
                                                src={
                                                    entry.image ||
                                                    "https://avatar.iran.liara.run/public/boy"
                                                }
                                                alt={entry.name}
                                            />
                                        </div>
                                    </div>
                                    <span className="flex-1 truncate font-semibold text-base-content">
                                        {entry.name}
                                    </span>
                                    <span className="font-mono text-sm font-bold text-primary">
                                        {entry.solvedCount} solved
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContestDetailPage;
