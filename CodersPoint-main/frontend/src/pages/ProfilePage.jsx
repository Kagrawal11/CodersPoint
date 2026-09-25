import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { User, CheckCircle, Clock, Award, Loader, AlertCircle, Pencil, Check, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/users/profile");
        setProfile(res.data.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveAvatar = async () => {
    try {
      setIsSavingAvatar(true);
      const res = await axiosInstance.patch("/users/profile", {
        image: avatarUrl.trim(),
      });
      setProfile((prev) => ({ ...prev, user: res.data.data }));
      setAuthUser({ ...authUser, image: res.data.data.image });
      setIsEditingAvatar(false);
      toast.success("Avatar updated");
    } catch (err) {
      toast.error("Couldn't update avatar");
    } finally {
      setIsSavingAvatar(false);
    }
  };

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

  if (!profile) return null;

  const { user, stats, recentSubmissions } = profile;

  const difficultyTone = {
    EASY: "text-success",
    MEDIUM: "text-warning",
    HARD: "text-error",
  };

  const difficultyBadge = {
    EASY: "badge-success",
    MEDIUM: "badge-warning",
    HARD: "badge-error",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="animate-fade-in-up space-y-6">
        {/* Header Section */}
        <div className="glass-panel flex flex-col items-center gap-6 rounded-2xl p-6 text-center sm:flex-row sm:text-left">
          <div className="group relative shrink-0">
            {user.image ? (
              <div className="glow-primary h-24 w-24 overflow-hidden rounded-full">
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="glow-primary flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-primary-content">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                setAvatarUrl(user.image || "");
                setIsEditingAvatar(true);
              }}
              className="btn btn-circle btn-xs absolute -bottom-1 -right-1 bg-base-300 opacity-0 transition-opacity group-hover:opacity-100"
              title="Change avatar"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-base-content">
              {user.name}
            </h1>
            <p className="text-base-content/50">{user.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-base-300/60 px-3 py-1 text-xs font-medium text-base-content/60">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>

            {isEditingAvatar && (
              <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row">
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="input input-bordered input-sm w-full max-w-xs rounded-lg bg-base-300/40"
                />
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={handleSaveAvatar}
                    disabled={isSavingAvatar}
                    className="btn btn-primary btn-sm btn-circle"
                  >
                    {isSavingAvatar ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAvatar(false)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Stats Card */}
          <div className="glass-panel rounded-2xl p-6 md:col-span-1">
            <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-bold text-base-content">
              <Award className="h-5 w-5 text-warning" /> Solved Problems
            </h2>
            <div className="space-y-3">
              {["EASY", "MEDIUM", "HARD"].map((level) => (
                <div
                  key={level}
                  className="flex items-center justify-between rounded-xl bg-base-300/40 px-3 py-2"
                >
                  <span className={`text-sm font-medium ${difficultyTone[level]}`}>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </span>
                  <span className="font-mono font-semibold text-base-content">
                    {stats[level]}
                  </span>
                </div>
              ))}
              <div className="my-1 border-t border-white/5" />
              <div className="flex items-center justify-between px-3 font-bold">
                <span className="text-base-content">Total</span>
                <span className="font-display text-lg text-primary">
                  {stats.total}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="glass-panel rounded-2xl p-6 md:col-span-2">
            <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-bold text-base-content">
              <Clock className="h-5 w-5 text-secondary" /> Recent Submissions
            </h2>
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-base-content/40">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-xl bg-base-300/40 p-3 transition-colors hover:bg-base-300/70"
                  >
                    <div>
                      <h3 className="font-medium text-base-content">
                        {sub.problem.title}
                      </h3>
                      <span
                        className={`badge badge-sm mt-1 ${difficultyBadge[sub.problem.difficulty]} badge-soft`}
                      >
                        {sub.problem.difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                          sub.status === "Accepted" ? "text-success" : "text-error"
                        }`}
                      >
                        {sub.status === "Accepted" && (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        {sub.status}
                      </span>
                      <span className="text-xs text-base-content/40">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
