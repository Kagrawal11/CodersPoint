import React from "react";
import { useForm } from "react-hook-form";
import { X, ListPlus } from "lucide-react";
const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const handleFormSubmit = async (data) => {
        await onSubmit(data);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="animate-fade-in-up w-full max-w-md rounded-2xl border border-white/5 bg-base-200 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between border-b border-white/5 p-5">
                    <h3 className="font-display flex items-center gap-2 text-lg font-bold">
                        <ListPlus className="h-5 w-5 text-primary" />
                        Create New Playlist
                    </h3>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-4 p-6"
                >
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Playlist Name
                            </span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full rounded-xl bg-base-100/60"
                            placeholder="Enter playlist name"
                            {...register("name", {
                                required: "Playlist name is required",
                            })}
                        />
                        {errors.name && (
                            <label className="label">
                                <span className="label-text-alt text-error">
                                    {errors.name.message}
                                </span>
                            </label>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">
                                Description
                            </span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24 rounded-xl bg-base-100/60"
                            placeholder="Enter playlist description"
                            {...register("description")}
                        />
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
                            className="btn btn-primary rounded-xl"
                        >
                            Create Playlist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylistModal;
