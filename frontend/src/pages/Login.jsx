import React from "react";

import Form from "../components/Form";
import { NAME_WEB } from "../assets/assets";
 
export default function Login() {
    return (
       <div className="flex flex-col pt-24 items-center justify-center ">
            <div className="flex w-full max-w-6xl min-h-[40rem] bg-white rounded-3xl overflow-hidden shadow-xl">

                <div className="flex-1 bg-gradient-to-br from-pink-400 via-orange-400 to-purple-500 relative flex items-center justify-center p-10">
                    {/* <div className="text-white text-5xl font-bold absolute top-10 left-10">{NAME_WEB}</div> */}
                    <img
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/astronaut-helmet-with-balloons-9236788-7520477.png"
                        alt="Astronaut"
                        className="max-h-80 drop-shadow-2xl"
                    />
                    <div className="text-white text-6xl font-extrabold absolute bottom-10 left-10">{NAME_WEB}</div>
                </div>

                <div className="flex-1 p-12 flex flex-col justify-center">
                    <div className="flex items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome to {NAME_WEB}!</h2>
                    </div>

                    <Form route="/api/token/" method="login" />

                    <div className="text-center mt-8 text-gray-500 text-sm">
                        Not registered yet?{" "}
                        <a href="/register" className="text-pink-500 font-semibold hover:underline">Create an Account</a>
                    </div>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-400 text-sm">or sign with Email</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button className="flex items-center justify-center space-x-3 border border-gray-300 rounded-full py-3 w-full hover:bg-gray-50 transition">
                        <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="w-6 h-6" />
                        <span className="text-gray-600 font-semibold">Sign in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}


