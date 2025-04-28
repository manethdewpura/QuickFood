import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const WelcomePage = () => {
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/WelcomeBg.jpg')]">
      <Header
        isLoggedIn={false}
        location="Set Location"
        onLogin={() => console.log("Login clicked")}
        onSignUp={() => console.log("Sign Up clicked")}
      />
      <div className="flex flex-row h-full">
        <div className="flex flex-col justify-center items-center w-1/2 p-4">
          <div className="w-fit h-fit bg-white p-18 rounded-4xl flex flex-col items-center">
            <img
              src="/LogoNoBg.png"
              alt="QuickFood Logo"
              className="w-48 h-48 md:w-56 md:h-56 mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black text-center">
              {currentTime}
            </h1>
            <div className="flex flex-row gap-4">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg md:text-xl hover:bg-blue-600">
                Log In
              </button>
              <button className="bg-white text-blue-500 px-6 py-3 rounded-lg text-lg md:text-xl hover:bg-gray-100 border-2 border-blue-500">
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center w-1/2 p-4"></div>
      </div>
    </div>
  );
};

export default WelcomePage;
