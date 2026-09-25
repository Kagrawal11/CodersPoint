import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Loader, AlertCircle, Trophy, Medal } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const rankStyles = {
    1: "text-warning",
    2: "text-base-content/60",
    3: "text-accent",
};

const LeaderboardPage = () => {
    const { authUser } = useAuthStore();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axiosInstance.get("/users/leaderboard");
                setEntries(res.data.data);
            } catch (err) {
                setError("Failed to load the leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading)
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-primary" />
            </div>
        );

    if (error)
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-3 text-center">
                <AlertCircle className="h-10 w-10 text-error" />
                <p className="text-error">{error}</p>
            </div>
        );

    return (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <div className="animate-fade-in-up space-y-6">
                <div className="flex flex-col items-center text-center">
                    <div className="glow-primary mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-content">
                        <Trophy className="h-7 w-7" />
                    </div>
                    <h1 className="font-display text-3xl font-bold">
                        Leaderboard
                    </h1>
                    <p className="mt-2 text-base-content/60">
                        Ranked by problems solved — keep climbing.
                    </p>
                </div>

                {entries.length === 0 ? (
                    <div className="glass-panel mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl px-8 py-12 text-center">
                        <Trophy className="h-8 w-8 text-base-content/30" />
                        <p className="text-base font-semibold text-base-content/70">
                            No one's solved a problem yet
                        </p>
                        <p className="text-sm text-base-content/50">
                            Solve one and be the first name on this board.
                        </p>
                    </div>
                ) : (
                    <div className="glass-panel divide-y divide-white/5 overflow-hidden rounded-2xl">
                        {entries.map((entry) => (
                            <div
                                key={entry.userId}
                                className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                                    entry.userId === authUser?.id
                                        ? "bg-primary/10"
                                        : "hover:bg-base-100/40"
                                }`}
                            >
                                <div
                                    className={`flex w-8 shrink-0 items-center justify-center font-display text-lg font-bold ${
                                        rankStyles[entry.rank] ||
                                        "text-base-content/40"
                                    }`}
                                >
                                    {entry.rank <= 3 ? (
                                        <Medal className="h-5 w-5" />
                                    ) : (
                                        entry.rank
                                    )}
                                </div>
                                <div className="avatar">
                                    <div className="w-9 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-200">
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
                                    {entry.userId === authUser?.id && (
                                        <span className="ml-2 text-xs font-normal text-primary">
                                            (you)
                                        </span>
                                    )}
                                </span>
                                <span className="font-mono text-sm font-bold text-primary">
                                    {entry.solvedCount}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
