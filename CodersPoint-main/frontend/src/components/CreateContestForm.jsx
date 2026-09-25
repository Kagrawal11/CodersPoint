import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Calendar } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const inputClass =
    "input w-full rounded-xl border-white/10 bg-base-300/40 focus:border-primary focus:outline-none";
const textareaClass =
    "textarea w-full resize-y rounded-xl border-white/10 bg-base-300/40 p-3 focus:border-primary focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-medium text-base-content/70";
const sectionClass = "glass-panel rounded-2xl p-5 md:p-6";

const CreateContestForm = () => {
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedProblemIds, setSelectedProblemIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axiosInstance
            .get("/problems/get-all-problems")
            .then((res) => setProblems(res.data.data))
            .catch(() => toast.error("Couldn't load problems"));
    }, []);

    const toggleProblem = (id) => {
        setSelectedProblemIds((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !startTime || !endTime) {
            toast.error("Title, start time, and end time are required");
            return;
        }
        if (new Date(endTime) <= new Date(startTime)) {
            toast.error("End time must be after start time");
            return;
        }
        try {
            setIsLoading(true);
            const res = await axiosInstance.post("/contests/create-contest", {
                title,
                description,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                problemIds: selectedProblemIds,
            });
            toast.success(res.data.message || "Contest created");
            navigate(`/contests/${res.data.data.id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating contest");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
            <div className="animate-fade-in-up space-y-6">
                <div className="flex flex-col items-center text-center">
                    <div className="glow-primary mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-content">
                        <Trophy className="h-7 w-7" />
                    </div>
                    <h1 className="font-display text-3xl font-bold">New Contest</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={sectionClass}>
                        <label className={labelClass}>Title</label>
                        <input
                            className={inputClass}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Weekly Challenge #1"
                        />

                        <label className={`${labelClass} mt-4`}>Description</label>
                        <textarea
                            className={`${textareaClass} min-h-20`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                        />

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    <Calendar className="mr-1 inline h-3.5 w-3.5" />
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className={inputClass}
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    <Calendar className="mr-1 inline h-3.5 w-3.5" />
                                    End Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className={inputClass}
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={sectionClass}>
                        <label className={labelClass}>Problems</label>
                        <div className="max-h-72 space-y-1 overflow-y-auto">
                            {problems.map((p) => (
                                <label
                                    key={p.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-base-100/40"
                                >
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary checkbox-sm"
                                        checked={selectedProblemIds.includes(p.id)}
                                        onChange={() => toggleProblem(p.id)}
                                    />
                                    <span className="text-sm font-medium">{p.title}</span>
                                    <span className="badge badge-sm badge-outline ml-auto">
                                        {p.difficulty}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full gap-2 rounded-xl"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <Trophy className="h-4 w-4" />
                        )}
                        Create Contest
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateContestForm;
