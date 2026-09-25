import React, { useEffect, useState } from "react";
import { X, Plus, Loader, BookmarkPlus } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";

const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
    const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } =
        usePlaylistStore();
    const [selectedPlaylist, setSelectedPlaylist] = useState("");

    useEffect(() => {
        if (isOpen) {
            getAllPlaylists();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlaylist) return;

        await addProblemToPlaylist(selectedPlaylist, [problemId]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="animate-fade-in-up w-full max-w-md rounded-2xl border border-white/5 bg-base-200 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-white/5 p-5">
                    <h3 className="font-display flex items-center gap-2 text-lg font-bold">
                        <BookmarkPlus className="h-5 w-5 text-primary" />
                        Add to Playlist
                    </h3>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Select Playlist
                            </span>
                        </label>
                        <select
                            className="select select-bordered w-full rounded-xl bg-base-100/60"
                            value={selectedPlaylist}
                            onChange={(e) =>
                                setSelectedPlaylist(e.target.value)
                            }
                            disabled={isLoading}
                        >
                            <option value="">Select a playlist</option>
                            {playlists.map((playlist) => (
                                <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary gap-2 rounded-xl"
                            disabled={!selectedPlaylist || isLoading}
                        >
                            {isLoading ? (
                                <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            Add to Playlist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToPlaylistModal;
