import React from "react";
import { User, Code2, LogOut, Sparkles, ChevronDown, Trophy, Swords, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const { authUser } = useAuthStore();

    return (
        <nav className="sticky top-0 z-50 w-full px-4 pt-5">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between glass-panel rounded-2xl px-5 py-3 shadow-lg shadow-black/20">
                {/* Logo Section */}
                <Link
                    to="/"
                    className="group flex items-center gap-3 cursor-pointer"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-content shadow-md shadow-primary/30 transition-transform group-hover:scale-105">
                        <Code2 className="h-5 w-5" />
                    </div>
                    <span className="font-display hidden text-lg font-bold tracking-tight text-base-content md:block">
                        Coder&apos;s Point
                    </span>
                </Link>

                {/* User Profile and Dropdown */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/leaderboard"
                        className="btn btn-ghost btn-sm hidden items-center gap-1.5 rounded-xl sm:inline-flex"
                    >
                        <Trophy className="h-4 w-4 text-warning" />
                        Leaderboard
                    </Link>
                    <Link
                        to="/contests"
                        className="btn btn-ghost btn-sm hidden items-center gap-1.5 rounded-xl sm:inline-flex"
                    >
                        <Swords className="h-4 w-4 text-secondary" />
                        Contests
                    </Link>
                    <ThemeToggle />
                    {authUser?.role === "ADMIN" && (
                        <span className="badge badge-primary badge-outline hidden items-center gap-1 sm:inline-flex">
                            <Sparkles className="h-3 w-3" />
                            Admin
                        </span>
                    )}
                    <div className="dropdown dropdown-end">
                        <label
                            tabIndex={0}
                            className="btn btn-ghost flex flex-row items-center gap-2 rounded-xl px-2"
                        >
                            <div className="avatar">
                                <div className="w-9 rounded-full ring-2 ring-primary/40 ring-offset-2 ring-offset-base-100">
                                    <img
                                        src={
                                            authUser?.image ||
                                            "https://avatar.iran.liara.run/public/boy"
                                        }
                                        alt="User Avatar"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <ChevronDown className="hidden h-4 w-4 text-base-content/50 sm:block" />
                        </label>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content menu-sm z-10 mt-3 w-56 space-y-1 rounded-2xl border border-white/5 bg-base-200/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
                        >
                            <li className="px-2 py-1.5">
                                <p className="truncate text-sm font-semibold text-base-content">
                                    {authUser?.name}
                                </p>
                                <p className="truncate text-xs text-base-content/50">
                                    {authUser?.email}
                                </p>
                            </li>
                            <div className="my-1 border-t border-white/5" />
                            <li>
                                <Link
                                    to="/profile"
                                    className="rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-content"
                                >
                                    <User className="h-4 w-4" />
                                    My Profile
                                </Link>
                            </li>
                            <li className="sm:hidden">
                                <Link
                                    to="/leaderboard"
                                    className="rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-content"
                                >
                                    <Trophy className="h-4 w-4" />
                                    Leaderboard
                                </Link>
                            </li>
                            <li className="sm:hidden">
                                <Link
                                    to="/contests"
                                    className="rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-content"
                                >
                                    <Swords className="h-4 w-4" />
                                    Contests
                                </Link>
                            </li>
                            {authUser?.role === "ADMIN" && (
                                <li>
                                    <Link
                                        to="/add-problem"
                                        className="rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-content"
                                    >
                                        <Code2 className="h-4 w-4" />
                                        Add Problem
                                    </Link>
                                </li>
                            )}
                            {authUser?.role === "ADMIN" && (
                                <li>
                                    <Link
                                        to="/admin/dashboard"
                                        className="rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-content"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Admin Dashboard
                                    </Link>
                                </li>
                            )}
                            <div className="my-1 border-t border-white/5" />
                            <li>
                                <LogoutButton className="!btn-ghost !btn-sm w-full !justify-start !rounded-lg !bg-transparent !text-sm !font-medium !text-error hover:!bg-error hover:!text-error-content">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </LogoutButton>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
