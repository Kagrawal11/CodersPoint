import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader, Trophy, Zap, Clock, CheckCircle2, Plus } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const statusStyle = {
    LIVE: { badge: "badge-success", icon: Zap, label: "Live" },
    UPCOMING: { badge: "badge-warning", icon: Clock, label: "Upcoming" },
    ENDED: { badge: "badge-neutral", icon: CheckCircle2, label: "Ended" },
};

const ContestsPage = () => {
    const { authUser } = useAuthStore();
    const [contests, setContests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const res = await axiosInstance.get("/contests/get-all-contests");
                setContests(res.data.data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContests();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <div className="animate-fade-in-up space-y-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                        <div className="glow-primary mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-content">
                            <Trophy className="h-7 w-7" />
                        </div>
                        <h1 className="font-display text-3xl font-bold">Contests</h1>
                        <p className="mt-2 text-base-content/60">
                            Time-boxed challenges — solve, climb the leaderboard.
                        </p>
                    </div>
                    {authUser?.role === "ADMIN" && (
                        <Link
                            to="/contests/create"
                            className="btn btn-primary gap-2 rounded-xl"
                        >
                            <Plus className="h-4 w-4" />
                            New Contest
                        </Link>
                    )}
                </div>

                {contests.length === 0 ? (
                    <div className="glass-panel mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl px-8 py-12 text-center">
                        <Trophy className="h-8 w-8 text-base-content/30" />
                        <p className="text-base font-semibold text-base-content/70">
                            No contests yet
                        </p>
                        <p className="text-sm text-base-content/50">
                            Check back soon for the first challenge.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {contests.map((contest) => {
                            const style = statusStyle[contest.status] || statusStyle.ENDED;
                            const Icon = style.icon;
                            return (
                                <Link
                                    key={contest.id}
                                    to={`/contests/${contest.id}`}
                                    className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-5 transition-colors hover:bg-base-100/40"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-display text-lg font-bold">
                                                {contest.title}
                                            </h3>
                                            <span className={`badge badge-sm gap-1 ${style.badge}`}>
                                                <Icon className="h-3 w-3" />
                                                {style.label}
                                            </span>
                                        </div>
                                        {contest.description && (
                                            <p className="mt-1 text-sm text-base-content/60">
                                                {contest.description}
                                            </p>
                                        )}
                                        <p className="mt-2 text-xs text-base-content/40">
                                            {new Date(contest.startTime).toLocaleString()} —{" "}
                                            {new Date(contest.endTime).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold text-base-content/50">
                                        {contest.problems?.length || 0} problems
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestsPage;
