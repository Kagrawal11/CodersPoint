import {
    CheckCircle2,
    XCircle,
    Clock,
    MemoryStick as Memory,
    Calendar,
    Inbox,
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading }) => {
    // Helper function to safely parse JSON strings
    console.log(submissions);
    const safeParse = (data) => {
        try {
            return JSON.parse(data);
        } catch (error) {
            console.error("Error parsing data:", error);
            return [];
        }
    };

    // Helper function to calculate average memory usage
    const calculateAverageMemory = (memoryData) => {
        const memoryArray = safeParse(memoryData).map((m) =>
            parseFloat(m.split(" ")[0])
        );
        if (memoryArray.length === 0) return 0;
        return (
            memoryArray.reduce((acc, curr) => acc + curr, 0) /
            memoryArray.length
        );
    };

    // Helper function to calculate average runtime
    const calculateAverageTime = (timeData) => {
        const timeArray = safeParse(timeData).map((t) =>
            parseFloat(t.split(" ")[0])
        );
        if (timeArray.length === 0) return 0;
        return (
            timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // No submissions state
    if (!submissions?.length) {
        return (
            <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
                <div className="rounded-full bg-base-300/60 p-3">
                    <Inbox className="h-6 w-6 text-base-content/40" />
                </div>
                <div className="text-sm text-base-content/50">
                    No submissions yet
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-3">
            {submissions.map((submission) => {
                const avgMemory = calculateAverageMemory(submission.memory);
                const avgTime = calculateAverageTime(submission.time);
                const isAccepted = submission.status === "Accepted";

                return (
                    <div
                        key={submission.id}
                        className="glass-panel flex flex-col gap-3 rounded-2xl p-4 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
                    >
                        {/* Left Section: Status and Language */}
                        <div className="flex flex-wrap items-center gap-3">
                            {isAccepted ? (
                                <div className="flex items-center gap-2 text-success">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-semibold">
                                        Accepted
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-error">
                                    <XCircle className="h-5 w-5" />
                                    <span className="font-semibold">
                                        {submission.status}
                                    </span>
                                </div>
                            )}
                            <div className="badge badge-neutral badge-sm rounded-full font-mono">
                                {submission.language}
                            </div>
                        </div>

                        {/* Right Section: Runtime, Memory, and Date */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-base-content/50">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{avgTime.toFixed(3)} s</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Memory className="h-3.5 w-3.5" />
                                <span>{avgMemory.toFixed(0)} KB</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                    {new Date(
                                        submission.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SubmissionsList;
