import React from "react";
import { Container } from "react-bootstrap";
import HomeHeader from "./Header";
import { Link } from "react-router-dom";

const Home = () => {

  document.title = "AI Interview | Home"

  const authData = JSON.parse(localStorage.getItem("auth"));
  const isAuthenticated = !!authData?.access;
  const userRole = authData?.user?.role;

  return (
    <div className="min-h-screen bg-gray-100">
      <HomeHeader />
      <main className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-5xl font-bold text-gray-800 mb-6 text-center">
          Welcome to AI Interview Platform
        </h1>

        <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
          "Unlock your potential and ace your interviews with the power of AI. Practice, improve, and succeed!"
        </p>

        {isAuthenticated ? (
          userRole === "MODERATOR" ? (
            <Link to="/dashboard">
              <button className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 animate-bounce">
                Go to Dashboard
              </button>
            </Link>
          ) : (
            <Link to="/interview">
              <button className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 animate-bounce">
                Go to Interview
              </button>
            </Link>
          )
        ) : (
          <Link to="/login">
            <button className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 animate-bounce">
              Start Interview
            </button>
          </Link>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Realistic Practice
              </h3>
              <p className="text-gray-600">
                Simulate real interview scenarios with our AI-powered platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Instant Feedback
              </h3>
              <p className="text-gray-600">
                Get detailed feedback on your performance to improve quickly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600">
                Practice anytime, anywhere, at your own pace.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;