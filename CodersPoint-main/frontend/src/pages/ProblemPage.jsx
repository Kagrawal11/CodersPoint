import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
    Play,
    FileText,
    MessageSquare,
    Lightbulb,
    Bookmark,
    Share2,
    Clock,
    ChevronRight,
    Terminal,
    Code2,
    Users,
    ThumbsUp,
    Home,
    CheckCircle2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";

const tabConfig = [
    { key: "description", label: "Description", icon: FileText },
    { key: "submissions", label: "Submissions", icon: Code2 },
    { key: "discussion", label: "Discussion", icon: MessageSquare },
    { key: "hints", label: "Hints", icon: Lightbulb },
];

const difficultyBadge = {
    EASY: "badge-success",
    MEDIUM: "badge-warning",
    HARD: "badge-error",
};

const ProblemPage = () => {
    const { id } = useParams();
    const { getProblemById, problem, isProblemLoading } = useProblemStore();

    const {
        submission: submissions,
        isLoading: isSubmissionsLoading,
        getSubmissionForProblem,
        getSubmissionCountForProblem,
        submissionCount,
    } = useSubmissionStore();

    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [testcases, setTestCases] = useState([]);

    const { executeCode, submissionData, isExecuting } = useExecutionStore();

    useEffect(() => {
        getProblemById(id);
        getSubmissionCountForProblem(id);
    }, [id]);

    useEffect(() => {
        if (problem) {
            setCode(
                problem.codeSnippets?.[selectedLanguage] ||
                    submissionData?.sourceCode ||
                    ""
            );
            setTestCases(
                problem.testcases?.map((tc) => ({
                    input: tc.input,
                    output: tc.output,
                })) || []
            );
        }
    }, [problem, selectedLanguage]);

    useEffect(() => {
        if (activeTab === "submissions" && id) {
            getSubmissionForProblem(id);
        }
    }, [activeTab, id]);

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        setCode(problem.codeSnippets?.[lang] || "");
    };

    const handleRunCode = (e) => {
        e.preventDefault();
        try {
            const language_id = getLanguageId(selectedLanguage);
            const stdin = problem.testcases.map((tc) => tc.input);
            const expected_outputs = problem.testcases.map((tc) => tc.output);
            executeCode(code, language_id, stdin, expected_outputs, id);
        } catch (error) {
            console.log("Error executing code", error);
        }
    };

    if (isProblemLoading || !problem) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="glass-panel flex flex-col items-center gap-4 rounded-2xl p-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-base-content/60">Loading problem...</p>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "description":
                return (
                    <div className="max-w-none space-y-6">
                        <p className="text-base leading-relaxed text-base-content/80">
                            {problem.description}
                        </p>

                        {problem.examples && (
                            <div>
                                <h3 className="font-display mb-3 text-lg font-bold">
                                    Examples
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(problem.examples).map(
                                        ([lang, example]) => (
                                            <div
                                                key={lang}
                                                className="rounded-xl border border-white/5 bg-base-300/60 p-5 font-mono text-sm"
                                            >
                                                <div className="mb-3">
                                                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
                                                        Input
                                                    </div>
                                                    <span className="inline-block rounded-lg bg-base-100 px-3 py-1.5 font-semibold text-base-content">
                                                        {example.input}
                                                    </span>
                                                </div>
                                                <div className="mb-3">
                                                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">
                                                        Output
                                                    </div>
                                                    <span className="inline-block rounded-lg bg-base-100 px-3 py-1.5 font-semibold text-base-content">
                                                        {example.output}
                                                    </span>
                                                </div>
                                                {example.explanation && (
                                                    <div>
                                                        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
                                                            Explanation
                                                        </div>
                                                        <p className="font-sans text-base-content/60">
                                                            {
                                                                example.explanation
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {problem.constraints && (
                            <div>
                                <h3 className="font-display mb-3 text-lg font-bold">
                                    Constraints
                                </h3>
                                <div className="rounded-xl border border-white/5 bg-base-300/60 p-5">
                                    <span className="font-mono text-sm font-semibold text-base-content/80">
                                        {problem.constraints}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "submissions":
                return (
                    <SubmissionsList
                        submissions={submissions}
                        isLoading={isSubmissionsLoading}
                    />
                );
            case "discussion":
                return (
                    <div className="p-4 text-center text-base-content/50">
                        No discussions yet
                    </div>
                );
            case "hints":
                return (
                    <div>
                        {problem?.hints ? (
                            <div className="rounded-xl border border-white/5 bg-base-300/60 p-5">
                                <span className="text-sm font-medium text-base-content/80">
                                    {problem.hints}
                                </span>
                            </div>
                        ) : (
                            <div className="text-center text-base-content/50">
                                No hints available
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full">
            <nav className="border-b border-white/5 bg-base-200/40 px-4 py-4 backdrop-blur-sm sm:px-6">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <Link
                            to={"/"}
                            className="mt-1 flex items-center text-base-content/50 transition-colors hover:text-primary"
                        >
                            <Home className="h-5 w-5" />
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="font-display text-xl font-bold">
                                    {problem.title}
                                </h1>
                                <span
                                    className={`badge badge-sm font-semibold ${
                                        difficultyBadge[problem.difficulty] ||
                                        "badge-neutral"
                                    }`}
                                >
                                    {problem.difficulty}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-base-content/50">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date(
                                        problem.createdAt
                                    ).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="h-3.5 w-3.5" />
                                    {submissionCount} Submissions
                                </span>
                                <span className="flex items-center gap-1">
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    95% Success Rate
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                            className={`btn btn-ghost btn-circle btn-sm ${
                                isBookmarked ? "text-primary" : ""
                            }`}
                            onClick={() => setIsBookmarked(!isBookmarked)}
                        >
                            <Bookmark className="h-4 w-4" />
                        </button>
                        <button className="btn btn-ghost btn-circle btn-sm">
                            <Share2 className="h-4 w-4" />
                        </button>
                        <select
                            className="select select-bordered select-sm w-36 rounded-lg bg-base-200"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                        >
                            {Object.keys(problem.codeSnippets || {}).map(
                                (lang) => (
                                    <option key={lang} value={lang}>
                                        {lang.charAt(0).toUpperCase() +
                                            lang.slice(1)}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>
            </nav>

            <div className="mx-auto max-w-7xl p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="overflow-hidden rounded-2xl border border-white/5 bg-base-200/40 shadow-xl shadow-black/10">
                        <div className="tabs tabs-bordered flex-nowrap overflow-x-auto border-b border-white/5 px-2">
                            {tabConfig.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    className={`tab gap-2 whitespace-nowrap ${
                                        activeTab === key
                                            ? "tab-active text-primary"
                                            : "text-base-content/60"
                                    }`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-[600px] overflow-y-auto p-5 sm:p-6">
                            {renderTabContent()}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-white/5 bg-base-200/40 shadow-xl shadow-black/10">
                        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
                            <Terminal className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">
                                Code Editor
                            </span>
                        </div>

                        <div className="h-[500px] w-full sm:h-[600px]">
                            <Editor
                                height="100%"
                                language={selectedLanguage.toLowerCase()}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 16,
                                    lineNumbers: "on",
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    readOnly: false,
                                    automaticLayout: true,
                                    padding: { top: 16 },
                                }}
                            />
                        </div>

                        <div className="border-t border-white/5 bg-base-300/40 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    className="btn btn-outline btn-primary gap-2 rounded-xl"
                                    onClick={handleRunCode}
                                    disabled={isExecuting}
                                >
                                    {isExecuting ? (
                                        <span className="loading loading-spinner loading-sm" />
                                    ) : (
                                        <Play className="h-4 w-4" />
                                    )}
                                    Run Code
                                </button>
                                <button className="btn btn-success gap-2 rounded-xl">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Submit Solution
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/5 bg-base-200/40 shadow-xl shadow-black/10">
                    <div className="p-5 sm:p-6">
                        {submissionData ? (
                            <Submission submission={submissionData} />
                        ) : (
                            <>
                                <h3 className="font-display mb-5 text-lg font-bold">
                                    Test Cases
                                </h3>
                                <div className="overflow-x-auto rounded-xl border border-white/5">
                                    <table className="table w-full">
                                        <thead className="bg-base-300/60 text-xs uppercase tracking-wide text-base-content/50">
                                            <tr>
                                                <th>Input</th>
                                                <th>Expected Output</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {testcases.map(
                                                (testCase, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-white/5"
                                                    >
                                                        <td className="font-mono text-sm">
                                                            {testCase.input}
                                                        </td>
                                                        <td className="font-mono text-sm">
                                                            {testCase.output}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
