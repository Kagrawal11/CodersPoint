import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
    Bookmark,
    PencilIcon,
    TrashIcon,
    Plus,
    Search,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useActions } from "../store/useActionStore";
import AddToPlaylistModal from "./AddToPlaylistModal";
import CreatePlaylistModal from "./CreatePlaylistModal";
import { usePlaylistStore } from "../store/usePlaylistStore";

const difficultyBadge = {
    EASY: "badge-success",
    MEDIUM: "badge-warning",
    HARD: "badge-error",
};

const ProblemsTable = ({ problems }) => {
    const { authUser } = useAuthStore();
    const { onDeleteProblem } = useActions();
    const { createPlaylist } = usePlaylistStore();
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("ALL");
    const [selectedTag, setSelectedTag] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
        useState(false);
    const [selectedProblemId, setSelectedProblemId] = useState(null);

    // Extract all unique tags from problems
    const allTags = useMemo(() => {
        if (!Array.isArray(problems)) return [];
        const tagsSet = new Set();
        problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
        return Array.from(tagsSet);
    }, [problems]);

    // Define allowed difficulties
    const difficulties = ["EASY", "MEDIUM", "HARD"];

    // Filter problems based on search, difficulty, and tags
    const filteredProblems = useMemo(() => {
        return (problems || [])
            .filter((problem) =>
                problem.title.toLowerCase().includes(search.toLowerCase())
            )
            .filter((problem) =>
                difficulty === "ALL" ? true : problem.difficulty === difficulty
            )
            .filter((problem) =>
                selectedTag === "ALL"
                    ? true
                    : problem.tags?.includes(selectedTag)
            );
    }, [problems, search, difficulty, selectedTag]);

    // Pagination logic
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
    const paginatedProblems = useMemo(() => {
        return filteredProblems.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredProblems, currentPage]);

    const handleDelete = (id) => {
        onDeleteProblem(id);
    };

    const handleCreatePlaylist = async (data) => {
        await createPlaylist(data);
    };

    const handleAddToPlaylist = (problemId) => {
        setSelectedProblemId(problemId);
        setIsAddToPlaylistModalOpen(true);
    };

    return (
        <div className="mx-auto mt-10 w-full max-w-6xl">
            {/* Header with Create Playlist Button */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Problems</h2>
                <button
                    className="btn btn-primary glow-primary gap-2 rounded-xl"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Create Playlist
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <label className="input input-bordered flex w-full items-center gap-2 rounded-xl bg-base-200/60 md:w-1/3">
                    <Search className="h-4 w-4 text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search by title"
                        className="grow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
                <select
                    className="select select-bordered rounded-xl bg-base-200/60"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="ALL">All Difficulties</option>
                    {difficulties.map((diff) => (
                        <option key={diff} value={diff}>
                            {diff.charAt(0).toUpperCase() +
                                diff.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                <select
                    className="select select-bordered rounded-xl bg-base-200/60"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                >
                    <option value="ALL">All Tags</option>
                    {allTags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-white/5 shadow-xl shadow-black/20">
                <div className="overflow-x-auto">
                    <table className="table-lg table w-full bg-base-200/60 text-base-content">
                        <thead className="bg-base-300/80 text-xs uppercase tracking-wide text-base-content/50">
                            <tr>
                                <th>Solved</th>
                                <th>Title</th>
                                <th>Tags</th>
                                <th>Difficulty</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProblems.length > 0 ? (
                                paginatedProblems.map((problem) => {
                                    const isSolved = problem.solvedBy.some(
                                        (user) => user.userId === authUser?.id
                                    );
                                    return (
                                        <tr
                                            key={problem.id}
                                            className="border-white/5 transition-colors hover:bg-base-100/50"
                                        >
                                            <td>
                                                {isSolved ? (
                                                    <CheckCircle2 className="h-5 w-5 text-success" />
                                                ) : (
                                                    <span className="block h-5 w-5 rounded-full border border-base-content/20" />
                                                )}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/problem/${problem.id}`}
                                                    className="font-semibold text-base-content transition-colors hover:text-primary"
                                                >
                                                    {problem.title}
                                                </Link>
                                            </td>
                                            <td>
                                                <div className="flex flex-wrap gap-1">
                                                    {(problem.tags || []).map(
                                                        (tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="badge badge-ghost badge-sm font-medium text-base-content/60"
                                                            >
                                                                {tag}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge font-semibold text-xs ${
                                                        difficultyBadge[
                                                            problem.difficulty
                                                        ] || "badge-neutral"
                                                    }`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                                                    {authUser?.role ===
                                                        "ADMIN" && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        problem.id
                                                                    )
                                                                }
                                                                className="btn btn-square btn-sm btn-error"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                disabled
                                                                className="btn btn-square btn-sm btn-warning"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <button
                                                        className="btn btn-outline btn-sm flex items-center gap-2 rounded-lg"
                                                        onClick={() =>
                                                            handleAddToPlaylist(
                                                                problem.id
                                                            )
                                                        }
                                                    >
                                                        <Bookmark className="h-4 w-4" />
                                                        <span className="hidden sm:inline">
                                                            Save
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-8 text-center text-base-content/50"
                                    >
                                        No problems found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        className="btn btn-circle btn-sm btn-ghost"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="rounded-lg bg-base-200 px-4 py-1.5 text-sm font-medium">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="btn btn-circle btn-sm btn-ghost"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Modals */}
            <CreatePlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePlaylist}
            />

            <AddToPlaylistModal
                isOpen={isAddToPlaylistModalOpen}
                onClose={() => setIsAddToPlaylistModalOpen(false)}
                problemId={selectedProblemId}
            />
        </div>
    );
};

export default ProblemsTable;
