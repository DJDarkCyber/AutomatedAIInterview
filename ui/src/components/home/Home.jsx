import React from "react";
import { Container } from "react-bootstrap";

import HomeHeader from "./Header";


const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <HomeHeader />
            <main className="flex flex-col items-center justify-center mt-20">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to AI Interview Platform
                </h1>
                <p className="text-lg text-gray-600">
                Practice and conduct interviews with the power of AI.
                </p>
            </main>
        </div>
    )
}

export default Home;