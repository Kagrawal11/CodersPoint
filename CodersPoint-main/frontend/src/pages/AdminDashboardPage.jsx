import React, { useEffect, useState } from "react";
import { Loader, Users, FileText, Send, BarChart3, TrendingUp } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="glass-panel flex items-center gap-4 rounded-2xl p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-2xl font-bold text-base-content">{value}</p>
            <p className="text-xs text-base-content/50">{label}</p>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get("/analytics")
            .then((res) => setData(res.data.data))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading || !data) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    const maxSubmissionsInDay = Math.max(
        1,
        ...data.submissionsOverTime.map((d) => d.count)
    );

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            <div className="animate-fade-in-up space-y-8">
                <div>
                    <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
                    <p className="mt-2 text-base-content/60">
                        Platform activity at a glance.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard icon={Users} label="Total Users" value={data.totalUsers} />
                    <StatCard
                        icon={FileText}
                        label="Total Problems"
                        value={data.totalProblems}
                    />
                    <StatCard
                        icon={Send}
                        label="Total Submissions"
                        value={data.totalSubmissions}
                    />
                </div>

                <div className={"glass-panel rounded-2xl p-5 md:p-6"}>
                    <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Submissions — Last 30 Days
                    </h2>
                    {data.submissionsOverTime.length === 0 ? (
                        <p className="text-sm text-base-content/50">No submissions yet.</p>
                    ) : (
                        <div className="flex items-end gap-1 overflow-x-auto pb-1">
                            {data.submissionsOverTime.map((d) => (
                                <div
                                    key={d.date}
                                    className="flex flex-1 min-w-[6px] flex-col items-center gap-1"
                                    title={`${d.date}: ${d.count}`}
                                >
                                    <div
                                        className="w-full rounded-t bg-gradient-to-t from-primary to-accent"
                                        style={{
                                            height: `${Math.max(
                                                4,
                                                (d.count / maxSubmissionsInDay) * 96
                                            )}px`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-panel rounded-2xl p-5 md:p-6">
                    <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Most Attempted Problems
                    </h2>
                    <div className="space-y-3">
                        {data.mostAttempted.map((p) => (
                            <div key={p.problemId}>
                                <div className="mb-1 flex items-center justify-between text-sm">
                                    <span className="font-semibold text-base-content">
                                        {p.title}
                                    </span>
                                    <span className="text-base-content/50">
                                        {p.submissionCount} submissions · {p.passRate}% pass
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-base-300/60">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                        style={{ width: `${p.passRate}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
