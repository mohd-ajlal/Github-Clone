"use client";

import { FaGithub, FaUnlockAlt } from "react-icons/fa";
import Link from "next/link";

const SignUpPage = () => {
    const handleLoginWithGithub = () => {
        window.location.href = "http://localhost:5000/api/auth/github";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-sm w-full">
                <div className="p-8 space-y-6">
                    <h1 className="text-3xl font-extrabold text-center text-gray-800">
                        Join Us Today
                    </h1>
                    <p className="text-center text-gray-600">
                        Create an account and unlock amazing features.
                    </p>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-black text-white hover:bg-gray-900 focus:ring-4 focus:ring-gray-700 rounded-lg py-3 transition-all duration-300 ease-in-out shadow-md"
                        onClick={handleLoginWithGithub}
                    >
                        <FaGithub className="w-6 h-6" />
                        <span className="text-lg font-medium">Sign Up with GitHub</span>
                    </button>

                    <p className="text-sm text-center text-gray-500">
                        By signing up, you agree to our terms and conditions.
                    </p>

                    <p className="text-sm text-center text-gray-500">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;