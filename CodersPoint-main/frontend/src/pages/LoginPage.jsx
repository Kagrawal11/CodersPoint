import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code2, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const LoginSchema = z.object({
    email: z.string().email("Enter a valid email!"),
    password: z.string().min(6, "Password must be at-least of 6 characters!"),
});

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoggingIn } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit = async (data) => {
        try {
            await login(data);
            console.log("login data", data);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="relative flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
                <div className="relative z-10 w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="group flex flex-col items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
                                <Code2 className="h-7 w-7 text-primary-content" />
                            </div>
                            <h1 className="font-display mt-2 text-3xl font-bold">
                                Welcome back
                            </h1>
                            <p className="text-base-content/60">
                                Sign in to continue to your account
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5 rounded-2xl border border-white/5 bg-base-200/40 p-6 shadow-xl shadow-black/10 backdrop-blur-sm sm:p-8"
                    >
                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Email
                                </span>
                            </label>
                            <label
                                className={`input input-bordered flex items-center gap-2 rounded-xl bg-base-100/60 ${
                                    errors.email ? "input-error" : ""
                                }`}
                            >
                                <Mail className="h-4 w-4 text-base-content/40" />
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="grow"
                                    placeholder="you@example.com"
                                />
                            </label>
                            {errors.email && (
                                <p className="mt-1 text-sm text-error">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Password
                                </span>
                            </label>
                            <label
                                className={`input input-bordered flex items-center gap-2 rounded-xl bg-base-100/60 ${
                                    errors.password ? "input-error" : ""
                                }`}
                            >
                                <Lock className="h-4 w-4 text-base-content/40" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className="grow"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="text-base-content/40 hover:text-base-content"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </label>
                            {errors.password && (
                                <p className="mt-1 text-sm text-error">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary glow-primary w-full rounded-xl"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="link link-primary font-medium no-underline hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <AuthImagePattern
                title={"Welcome back to our platform!"}
                subtitle={
                    "Sign in to continue your journey with us. Don't have an account? Create one now."
                }
            />
        </div>
    );
};

export default LoginPage;
