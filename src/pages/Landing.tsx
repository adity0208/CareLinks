"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, LogIn, UserPlus, ArrowRight, Loader, Sparkles, Shield, Users } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom"; // Don't forget to import useNavigate

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userCredential;
      if (isLogin) {
        // Sign In logic from your original correct code
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up logic from your original correct code
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      console.log("Authentication successful", user);
      navigate("/dashboard"); // Redirect to dashboard after successful authentication
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      console.log("Google Sign-In successful", user);
      navigate("/dashboard"); // Redirect to dashboard after successful Google Sign-In
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 relative overflow-hidden font-sans">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-rose-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              CareLink
            </span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Trusted by 10,000+ healthcare professionals</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 bg-clip-text text-transparent">
              Empowering Healthcare
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              at Your Fingertips
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Simplify healthcare management and enhance community well-being with our comprehensive, AI-powered platform
            designed for modern healthcare professionals.
          </p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Team Collaboration</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Insights</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>

            {/* Main card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
              {/* Toggle buttons */}
              <div className="flex bg-gray-100/80 rounded-xl p-1 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isLogin
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  <span className="font-medium">Login</span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    !isLogin
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span className="font-medium">Sign Up</span>
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? "Login" : "Sign Up"}</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-6 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <img
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                  />
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 p-6 text-center"
      >
        <p className="text-gray-500 font-medium">
          © {new Date().getFullYear()} CareLink. All rights reserved. • Built with ❤️ for healthcare professionals
        </p>
      </motion.footer>
    </div>
  );
}