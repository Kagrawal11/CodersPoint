import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, CheckCircle, Clock, Award } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/users/profile", {
          withCredentials: true,
        });
        setProfile(res.data.data);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center p-10 text-white">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  if (!profile) return null;

  const { user, stats, recentSubmissions } = profile;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-lg p-6 flex items-center gap-6 shadow-lg border border-gray-700">
          <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-gray-700 rounded text-sm text-gray-300">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Card */}
          <div className="md:col-span-1 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" /> Solved Problems
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-green-400">Easy</span>
                <span className="font-mono">{stats.EASY}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Medium</span>
                <span className="font-mono">{stats.MEDIUM}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400">Hard</span>
                <span className="font-mono">{stats.HARD}</span>
              </div>
              <hr className="border-gray-700" />
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span>{stats.total}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="text-blue-500" /> Recent Submissions
            </h2>
            {recentSubmissions.length === 0 ? (
              <p className="text-gray-500">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded">
                    <div>
                      <h3 className="font-semibold">{sub.problem.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        sub.problem.difficulty === "EASY" ? "bg-green-900 text-green-300" :
                        sub.problem.difficulty === "MEDIUM" ? "bg-yellow-900 text-yellow-300" :
                        "bg-red-900 text-red-300"
                      }`}>
                        {sub.problem.difficulty}
                      </span>
                    </div>
                    <div className="text-right">
                       <span className={`block font-bold ${
                         sub.status === "Accepted" ? "text-green-400" : "text-red-400"
                       }`}>
                         {sub.status}
                       </span>
                       <span className="text-xs text-gray-400">
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