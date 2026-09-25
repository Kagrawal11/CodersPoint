import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { User, CheckCircle, Clock, Award, Loader, AlertCircle } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <div className="glow-primary flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-primary-content">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-base-content">
              {user.name}
            </h1>
            <p className="text-base-content/50">{user.email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-base-300/60 px-3 py-1 text-xs font-medium text-base-content/60">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </div>
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
