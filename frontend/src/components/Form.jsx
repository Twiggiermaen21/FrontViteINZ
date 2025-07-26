import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/ai");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 text-white font-sans">
            {method === "register" && (<div>
                <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Name</label>
                <input
                    className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter Name"
                />
            </div>
            )}
            <div>
                <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Email</label>
                <input
                    className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                />
            </div>

            <div>
                <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Password</label>
                <div className="relative">
                    <input
                        className="w-full p-4 pr-12 rounded-full bg-white text-gray-600 placeholder:text-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-pink-500 transition"
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
            </div>
            {method === "register" && (
                <div>
                    <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase mb-2">
                        Date of Birth
                    </label>
                    <DatePicker
                        selected={birthDate}
                        onChange={(date) => setBirthDate(date)}
                        maxDate={new Date()}
                        showYearDropdown
                        scrollableYearDropdown
                        placeholderText="Select your birth date"
                        className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 
                 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                    />
                </div>
            )}


            {method === "login" && (
                <div className="flex justify-between text-xs mt-1 text-gray-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded-md border-2 border-pink-400 accent-pink-500 
               focus:ring-2 focus:ring-pink-400 transition duration-200"
                        />
                        <span className="text-gray-600 text-sm">Remember me</span>
                    </label>
                    <a href="#" className="text-pink-500 font-semibold hover:underline">Forgot Password</a>
                </div>
            )}

            {loading && <LoadingIndicator />}

            <button
                type="submit"
                className="w-full py-4 text-lg bg-gradient-to-r from-pink-400 to-orange-400 
               rounded-full font-bold mt-6 hover:from-pink-500 hover:to-yellow-400 transition-all duration-300"
            >
                {name}
            </button>
        </form>
    );
}
