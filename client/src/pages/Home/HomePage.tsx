import React from "react";
import Header from "../../components/Header";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header
        isLoggedIn={true}
        location="Set Location"
        onLogin={() => {}}
        onSignUp={() => {}}
        onCartClick={() => {}}
      />
      <div
        className="flex-1 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/WelcomeBg.jpg')]"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to QuickFood
        </h1>
        <p className="text-lg text-white mb-8">
          Your favorite food delivered fast at your door.
        </p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomePage;