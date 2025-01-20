"use client";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";

const LoginPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm w-full">
                <div className="p-8 space-y-6">
                    <h1 className="text-3xl font-extrabold text-center text-gray-800">
                        Welcome Back!
                    </h1>
                    <p className="text-center text-gray-600">
                        Login to continue exploring our platform.
                    </p>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-900 focus:ring-4 focus:ring-gray-700 rounded-lg py-3 transition-all duration-300 ease-in-out shadow-md"
                        onClick={() => (window.location.href = "http://localhost:5000/api/auth/github")}
                    >
                        <FaGithub className="w-6 h-6" />
                        <span className="text-lg font-medium">Login with GitHub</span>
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/signup"
                            className="text-blue-600 hover:underline font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;