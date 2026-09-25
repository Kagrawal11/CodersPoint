import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import Layout from "./layout/Layout";
import { Loader } from "lucide-react";
import AdminRoute from "./components/AdminRoute";
import AddProblem from "./pages/AddProblem";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-100">
                <Loader className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-start">
            <Toaster
                toastOptions={{
                    className: "!bg-base-200 !text-base-content !border !border-white/10",
                }}
            />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={
                            authUser ? <HomePage /> : <Navigate to="/login" />
                        }
                    />
                </Route>

                <Route
                    path="/login"
                    element={!authUser ? <LoginPage /> : <Navigate to="/" />}
                />

                <Route
                    path="/signup"
                    element={!authUser ? <SignupPage /> : <Navigate to="/" />}
                />

                <Route
                    path="/problem/:id"
                    element={
                        authUser ? <ProblemPage /> : <Navigate to="/login" />
                    }
                />
                <Route path="/profile" element={<ProfilePage />} />
                
                <Route element={<AdminRoute />}>
                    <Route
                        path="/add-problem"
                        element={
                            authUser ? <AddProblem /> : <Navigate to="/" />
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
};

export default App;
