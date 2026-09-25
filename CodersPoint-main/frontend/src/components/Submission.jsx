import React from "react";
import {
    CheckCircle2,
    XCircle,
    Clock,
    MemoryStick as Memory,
    Gauge,
} from "lucide-react";

const SubmissionResults = ({ submission }) => {
    // Parse stringified arrays
    const memoryArr = JSON.parse(submission.memory || "[]");
    const timeArr = JSON.parse(submission.time || "[]");

    // Calculate averages
    const avgMemory =
        memoryArr
            .map((m) => parseFloat(m)) // remove ' KB' using parseFloat
            .reduce((a, b) => a + b, 0) / memoryArr.length;

    const avgTime =
        timeArr
            .map((t) => parseFloat(t)) // remove ' s' using parseFloat
            .reduce((a, b) => a + b, 0) / timeArr.length;

    const passedTests = submission.testcases.filter((tc) => tc.passed).length;
    const totalTests = submission.testcases.length;
    const successRate = (passedTests / totalTests) * 100;
    const isAccepted = submission.status === "Accepted";

    const statCards = [
        {
            label: "Status",
            value: submission.status,
            icon: isAccepted ? CheckCircle2 : XCircle,
            tone: isAccepted ? "text-success" : "text-error",
        },
        {
            label: "Success Rate",
            value: `${successRate.toFixed(1)}%`,
            icon: Gauge,
            tone: "text-primary",
        },
        {
            label: "Avg. Runtime",
            value: `${avgTime.toFixed(3)} s`,
            icon: Clock,
            tone: "text-secondary",
        },
        {
            label: "Avg. Memory",
            value: `${avgMemory.toFixed(0)} KB`,
            icon: Memory,
            tone: "text-accent",
        },
    ];

    return (
        <div className="animate-fade-in-up space-y-6">
            {/* Overall Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map(({ label, value, icon: Icon, tone }) => (
                    <div
                        key={label}
                        className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                    >
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-base-content/50">
                            <Icon className={`h-4 w-4 ${tone}`} />
                            {label}
                        </div>
                        <div className={`mt-2 font-display text-2xl font-bold ${tone}`}>
                            {value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Test Cases Results */}
            <div className="glass-panel rounded-2xl p-6">
                <h2 className="font-display mb-4 text-lg font-bold text-base-content">
                    Test Case Results
                </h2>
                <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="table w-full">
                        <thead>
                            <tr className="border-white/5 text-xs uppercase tracking-wide text-base-content/50">
                                <th className="bg-base-200/60">Status</th>
                                <th className="bg-base-200/60">Expected Output</th>
                                <th className="bg-base-200/60">Your Output</th>
                                <th className="bg-base-200/60">Memory</th>
                                <th className="bg-base-200/60">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submission.testcases.map((testCase) => (
                                <tr
                                    key={testCase.id}
                                    className="border-white/5 hover:bg-white/[0.03]"
                                >
                                    <td>
                                        {testCase.passed ? (
                                            <div className="flex items-center gap-2 font-medium text-success">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Passed
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 font-medium text-error">
                                                <XCircle className="h-4 w-4" />
                                                Failed
                                            </div>
                                        )}
                                    </td>
                                    <td className="font-mono text-sm text-base-content/80">
                                        {testCase.expected}
                                    </td>
                                    <td className="font-mono text-sm text-base-content/80">
                                        {testCase.stdout || "null"}
                                    </td>
                                    <td className="text-sm text-base-content/60">
                                        {testCase.memory}
                                    </td>
                                    <td className="text-sm text-base-content/60">
                                        {testCase.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubmissionResults;
