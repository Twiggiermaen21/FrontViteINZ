import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            let payload;
            if (method === "login") {
                payload = {
                    username: username, // osobny username
                    password: password,
                };
            } else {
                payload = {
                    username: username,
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    password: password,
                };
            }


            const res = await api.post(route, payload);

            if (method === "login") {
                console.log(res);
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/ai");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data) {
                if (typeof error.response.data === "string") {
                    setErrorMessage(error.response.data);
                } else if (error.response.data.detail) {
                    setErrorMessage(error.response.data.detail);
                } else {
                    setErrorMessage("Wystąpił błąd. Spróbuj ponownie.");
                }
            } else {
                setErrorMessage("Błąd połączenia z serwerem");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-white font-sans">
            {method === "register" && (
                <>
                    <div>
                        <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Username"
                            className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                        />
                    </div>
                    <div>
                        <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                        />
                    </div>
                    <div>
                        <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter First Name"
                            className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                        />
                    </div>
                    <div>
                        <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter Last Name"
                            className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                        />
                    </div>
                </>
            )}

            {method === "login" && (
                <div>
                    <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        className="w-full p-4 rounded-full bg-white text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
                    />
                </div>
            )}

            <div>
                <label className="block text-s font-semibold tracking-wider text-gray-700 uppercase">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full p-4 pr-12 rounded-full bg-white text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm transition"
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

            {errorMessage && (
                <p className="text-red-500 text-sm font-semibold">{errorMessage}</p>
            )}

            {method === "login" && (
                <div className="flex justify-between text-xs mt-1 text-gray-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded-md border-2 border-pink-400 accent-pink-500 focus:ring-2 focus:ring-pink-400 transition duration-200"
                        />
                        <span className="text-gray-600 text-sm">Remember me</span>
                    </label>
                    <a href="#" className="text-pink-500 font-semibold hover:underline">Forgot Password</a>
                </div>
            )}

            {loading && <LoadingIndicator />}

            <button
                type="submit"
                className="w-full py-4 text-lg bg-gradient-to-r from-pink-400 to-orange-400 rounded-full font-bold mt-6 hover:from-pink-500 hover:to-yellow-400 transition-all duration-300"
            >
                {name}
            </button>
        </form>
    );
}
