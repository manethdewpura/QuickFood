import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/auth/login", formData);
            const { user, token } = response.data;


            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            //redirect to pages on their role
            if (user.role === "Customer") {
                navigate("/home");
            } else if (user.role === "RestaurantAdmin") {
                navigate("/RestaurantHome");
            } else if (user.role === "DeliveryPersonnel") {
                navigate("#");
            } else {
                navigate("#");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md mt-10 ml-10 p-6 bg-white shadow-md rounded-md w-full md:w-1/2">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                {loading}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div className="items-center justify-center flex">
                        <p className="text-sm text-gray-600">
                            Don't have an Account?{'  '}
                            <a href="/signup" className="text-blue-600 hover:underline hover:text-blue-800 transition">
                                Sign Up
                            </a>
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );

};

export default LoginForm;