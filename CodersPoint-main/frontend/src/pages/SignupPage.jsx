import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Code2, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { z } from "zod";
import AuthImagePattern from "../components/AuthImagePattern";
import { useAuthStore } from "../store/useAuthStore";

const SignupSchema = z.object({
    name: z.string().min(3, "Name contains at-least 3 characters!"),
    email: z.string().email("Enter a valid email!"),
    password: z.string().min(6, "Password must be at-least of 6 characters!"),
});

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { signup, isSigninUp } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(SignupSchema),
    });

    const onSubmit = async (data) => {
        try {
            await signup(data);
            console.log("signup data", data);
        } catch (error) {
            console.error("SignUp failed:", error);
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
                                Create your account
                            </h1>
                            <p className="text-base-content/60">
                                Sign up to start solving problems
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5 rounded-2xl border border-white/5 bg-base-200/40 p-6 shadow-xl shadow-black/10 backdrop-blur-sm sm:p-8"
                    >
                        {/* name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Name
                                </span>
                            </label>
                            <label
                                className={`input input-bordered flex items-center gap-2 rounded-xl bg-base-100/60 ${
                                    errors.name ? "input-error" : ""
                                }`}
                            >
                                <User className="h-4 w-4 text-base-content/40" />
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="grow"
                                    placeholder="John Doe"
                                />
                            </label>
                            {errors.name && (
                                <p className="mt-1 text-sm text-error">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

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
                            disabled={isSigninUp}
                        >
                            {isSigninUp ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "Sign up"
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="link link-primary font-medium no-underline hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Image/Pattern */}
            <AuthImagePattern
                title={"Welcome to our platform!"}
                subtitle={
                    "Sign up to access our platform and start using our services."
                }
            />
        </div>
    );
};

export default SignupPage;
