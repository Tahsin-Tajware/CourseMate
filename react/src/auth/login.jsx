import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { customAxios } from "../api/axiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../image/login_sideimage.png";
import Sidebar from "../views/Sidebar";
import Swal from "sweetalert2";

import google_img from '../../public/assets/google_img.png'
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const Login = () => {
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const googleLogin = () => {
    window.location.href = `${VITE_BASE_URL}/auth/google`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await customAxios.post("/auth/login", formData);

      setSuccess("Login successful! Token: " + response.data.access_token);
      setAuth({
        ...auth,
        user: response.data.user,
        token: response.data.access_token,
      });
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success("Login successful!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Invalid email or password");
        toast.error(err.response.data.error || "Invalid email or password", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        setError("Failed to connect to the server.");
        toast.error("Failed to connect to the server.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);


  return (
    <div className="flex items-center justify-center h-screen bg-white fixed inset-0 sm:pl-60">
      <Sidebar isOpen={false} onClose={() => { }} />
      <div className="flex w-full max-w-4xl bg-transparent rounded-lg overflow-hidden mx-auto">

        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-transparent">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
          {/* <p className="text-gray-600 mb-6">
            Sign in to your account to unlock all the amazing features.
          </p> */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-left text-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-left text-gray-700"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-red-700 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Sign in
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4 mb-4">
            Don’t have an account? <a href="/register" className="text-green-700 font-bold hover:underline">Sign Up</a>
          </p>
          <button
            onClick={googleLogin}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition w-full"
          >
            <img src={google_img} alt="Google" className="w-5 h-5" />
            <span >Sign in with Google</span>
          </button>
        </div>


        <div className="hidden md:flex w-1/2 bg-transparent flex items-center justify-center">
          <div className="text-center p-8">
            <img
              src={loginImage}
              alt="Login Illustration"
              className="w-full mx-auto mb-4 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
