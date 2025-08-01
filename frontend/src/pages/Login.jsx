import React, { useState } from "react";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, BookOpen, Feather } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { addUser } from "../store/userSlice";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { token, admin } = response.data.data;
      dispatch(addUser({ token, admin }));
      toast.success("Admin Logged in successfully!");
      navigate("/");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col">
      {/* Your existing NavBar component */}
      <NavBar />

      {/* Main Content - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden mt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          </div>

          {/* Literary Elements */}
          <div className="absolute top-10 left-10 text-white/10 text-8xl font-serif transform rotate-12">
            <BookOpen />
          </div>
          <div className="absolute bottom-10 right-10 text-white/10 text-6xl transform -rotate-12">
            <Feather />
          </div>
          <div className="absolute top-1/2 right-20 text-white/5 text-9xl font-serif">"</div>
          <div className="absolute top-1/3 left-20 text-white/5 text-9xl font-serif">"</div>
        </div>

        {/* Login Card */}
        <div className="relative w-full max-w-md z-10">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-3xl mb-6 shadow-lg">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 font-serif">Admin Access</h1>
              <p className="text-gray-300 text-lg">Enter your sanctuary of words</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6" noValidate>
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm backdrop-blur-sm" role="alert">
                  {errors.general}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      errors.email ? "border-red-500" : "border-white/20 hover:border-white/30"
                    }`}
                    placeholder="admin@tanishawrites.com"
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={errors.email ? "true" : "false"}
                    required
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-red-400 text-sm" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300 block">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                      errors.password ? "border-red-500" : "border-white/20 hover:border-white/30"
                    }`}
                    placeholder="Enter your password"
                    aria-describedby={errors.password ? "password-error" : undefined}
                    aria-invalid={errors.password ? "true" : "false"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-red-400 text-sm" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 rounded border-gray-600 bg-white/10 text-purple-500 focus:ring-purple-500 cursor-pointer"
                  />
                  Remember me
                </label>
                {/* <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Forgot password?
                </button> */}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 cursor-pointer" />
                    <span className="cursor-pointer">Enter the Sanctuary</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm font-serif italic">
                "Words are, of course, the most powerful drug used by mankind."
              </p>
              <p className="text-gray-500 text-xs mt-2">— Rudyard Kipling</p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        </div>
      </div>

      {/* Your existing Footer component */}
      <Footer />
    </div>
  );
};

export default Login;