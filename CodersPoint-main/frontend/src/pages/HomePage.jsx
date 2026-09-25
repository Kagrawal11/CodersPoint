import React, { useEffect } from "react";

import { useProblemStore } from "../store/useProblemStore";
import { Loader, Sparkles, Shuffle } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const HomePage = () => {
    const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
    const navigate = useNavigate();

    useEffect(() => {
        getAllProblems();
    }, [getAllProblems]);

    const handleRandomProblem = () => {
        if (problems.length === 0) {
            toast.error("No problems to pick from yet");
            return;
        }
        const random = problems[Math.floor(Math.random() * problems.length)];
        navigate(`/problem/${random.id}`);
    };

    if (isProblemsLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center px-4 pb-20 pt-16">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <span className="badge badge-outline badge-primary mb-4 gap-1.5 px-3 py-3 text-xs font-medium">
                    <Sparkles className="h-3.5 w-3.5" />
                    Practice. Improve. Get hired.
                </span>
                <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        Coder&apos;s Point
                    </span>
                </h1>

                <p className="mt-5 max-w-2xl text-balance text-base font-medium text-base-content/60 sm:text-lg">
                    A platform inspired by LeetCode that helps you prepare for
                    coding interviews and sharpen your problem-solving skills,
                    one challenge at a time.
                </p>

                {problems.length > 0 && (
                    <button
                        onClick={handleRandomProblem}
                        className="btn btn-outline btn-primary mt-6 gap-2 rounded-xl"
                    >
                        <Shuffle className="h-4 w-4" />
                        Surprise me with a problem
                    </button>
                )}
            </div>

            <div className="relative z-10 w-full">
                {problems.length > 0 ? (
                    <ProblemTable problems={problems} />
                ) : (
                    <div className="mx-auto mt-14 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-base-content/15 bg-base-200/40 px-8 py-12 text-center">
                        <p className="text-base font-semibold text-base-content/70">
                            No problems found
                        </p>
                        <p className="text-sm text-base-content/50">
                            Check back soon — new challenges are on the way.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
