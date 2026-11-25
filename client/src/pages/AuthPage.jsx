import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Code2,
  Terminal,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Zap,
  BarChart3,
  Fingerprint,
  Loader2,
  AlertCircle,
  Github,
} from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    cfHandle: "",
    lcHandle: "",
    role: "user",
  });

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);

    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !isLogin &&
      formData.password !== formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const url = isLogin
      ? `${import.meta.env.VITE_BACKEND_URL}/api/users/login`
      : `${import.meta.env.VITE_BACKEND_URL}/api/users/register`;

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
          cfHandle: formData.cfHandle,
          lcHandle: formData.lcHandle,
        }
      : {
          name: formData.username,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          cfHandle: formData.cfHandle,
          lcHandle: formData.lcHandle,
          role: "user",
        };

    try {
      const res = await axios.post(url, payload);

      const {
        token,
        _id,
        role,
        cfHandle,
        lcHandle,
      } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      localStorage.setItem(
        "cfHandle",
        cfHandle || formData.cfHandle
      );

      localStorage.setItem(
        "lcHandle",
        lcHandle || formData.lcHandle
      );

      localStorage.setItem("role", role);

      window.dispatchEvent(
        new Event("userStatusChanged")
      );

      toast.success(
        isLogin
          ? "Welcome back to CodeVerse!"
          : "Welcome to the Arena!"
      );

      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please try again."
      );

      toast.error("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Terminal,
      title: "Master your DSA skills",
      description:
        "Practice coding problems and strengthen your fundamentals.",
    },
    {
      icon: Trophy,
      title: "Compete with the best",
      description:
        "Challenge yourself and climb the leaderboard.",
    },
    {
      icon: BarChart3,
      title: "Track your growth",
      description:
        "Connect your coding profiles and monitor your progress.",
    },
  ];

  const inputClass =
    "h-12 rounded-xl border border-white/10 bg-[#101117] pl-11 text-sm text-white placeholder:text-[#62636f] transition-all duration-300 focus-visible:border-[#f8d250]/50 focus-visible:ring-1 focus-visible:ring-[#f8d250]/30 focus-visible:ring-offset-0";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0d12] text-white">

      {/* Background glows */}

      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#f8d250]/10 blur-[160px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#9b5cff]/10 blur-[160px]" />

      {/* Grid background */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Navigation */}

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-12">

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-[#f8d250] p-2.5 text-[#111218] shadow-[0_0_25px_rgba(248,210,80,0.15)]">
            <Code2 className="h-6 w-6" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Code<span className="text-[#f8d250]">Verse.</span>
          </span>
        </button>

        <div className="hidden items-center gap-2 text-xs tracking-widest text-[#a8a8b3] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#f8d250]" />
          THE CODING ARENA
        </div>

      </header>

      {/* Main layout */}

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-170px)] max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-2 lg:gap-24 lg:px-12">

        {/* LEFT SIDE - BRANDING */}

        <div className="hidden space-y-9 lg:block">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#f8d250]/20 bg-[#f8d250]/5 px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-[#f8d250]">
            <Zap className="h-3.5 w-3.5" />
            BUILT FOR DEVELOPERS
          </div>

          <div className="space-y-5">

            <h1 className="text-6xl font-bold leading-[1.1] tracking-tight xl:text-7xl">
              Beyond coding.
              <br />

              Beyond{" "}

              <span className="bg-gradient-to-r from-[#f8d250] via-[#ffe8a3] to-[#eab308] bg-clip-text text-transparent">
                limits.
              </span>
            </h1>

            <p className="max-w-lg text-base leading-8 text-[#a8a8b3]">
              Your arena to practice, compete, and become a
              better programmer. Turn every challenge into
              an opportunity to grow.
            </p>

          </div>

          {/* Platform features */}

          <div className="space-y-5">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex items-center gap-4"
              >
                <div className="rounded-2xl border border-[#f8d250]/10 bg-[#f8d250]/5 p-4 text-[#f8d250] transition-all duration-300 group-hover:border-[#f8d250]/30 group-hover:bg-[#f8d250]/10">

                  <feature.icon className="h-6 w-6" />

                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#a8a8b3]">
                    {feature.description}
                  </p>
                </div>

              </div>
            ))}

          </div>

          {/* Code decoration */}

          <div className="max-w-md overflow-hidden rounded-2xl border border-white/[0.07] bg-[#14151c]/70">

            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />

              <span className="ml-3 font-mono text-xs text-[#777781]">
                journey.cpp
              </span>
            </div>

            <div className="space-y-2 p-5 font-mono text-sm">

              <p className="text-[#777781]">
                {"// Your journey starts here"}
              </p>

              <p>
                <span className="text-purple-400">
                  while
                </span>
                <span className="text-white"> (</span>
                <span className="text-[#f8d250]">
                  !success
                </span>
                <span className="text-white">{") {"}</span>
              </p>

              <p className="pl-5 text-green-400">
                practice();
              </p>

              <p className="pl-5 text-green-400">
                improve();
              </p>

              <p className="pl-5 text-green-400">
                compete();
              </p>

              <p className="text-white">{"}"}</p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE - AUTH FORM */}

        <div className="mx-auto w-full max-w-[460px]">

          <div className="relative rounded-[28px] border border-white/10 bg-[#16171e]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-9">

            {/* Golden top border */}

            <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f8d250]/70 to-transparent" />

            {/* Heading */}

            <div className="mb-7 space-y-3">

              <div className="mb-5 inline-flex rounded-2xl border border-[#f8d250]/15 bg-[#f8d250]/10 p-3 text-[#f8d250]">
                <Fingerprint className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                {isLogin
                  ? "Welcome back."
                  : "Join the Arena."}
              </h2>

              <p className="text-sm leading-relaxed text-[#a8a8b3]">
                {isLogin
                  ? "Sign in to continue your coding journey."
                  : "Create your account and unlock your potential."}
              </p>

            </div>

            {/* Login / Register tabs */}

            <div className="mb-7 grid grid-cols-2 gap-1 rounded-xl border border-white/[0.05] bg-[#0e0f14] p-1">

              <button
                type="button"
                disabled={loading}
                onClick={() => !isLogin && toggleMode()}
                className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-[#f8d250]/10 text-[#f8d250]"
                    : "text-[#a8a8b3] hover:text-white"
                }`}
              >
                Sign in
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => isLogin && toggleMode()}
                className={`rounded-lg py-2.5 text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-[#f8d250]/10 text-[#f8d250]"
                    : "text-[#a8a8b3] hover:text-white"
                }`}
              >
                Register
              </button>

            </div>

            {/* Error message */}

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Username */}

              {!isLogin && (
                <div className="space-y-2">

                  <label
                    htmlFor="username"
                    className="text-xs font-medium text-[#d4d4dc]"
                  >
                    Username
                  </label>

                  <div className="relative">

                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777781]" />

                    <Input
                      id="username"
                      name="username"
                      placeholder="Choose your username"
                      value={formData.username}
                      onChange={handleChange}
                      className={inputClass}
                      autoComplete="username"
                      required
                    />

                  </div>

                </div>
              )}

              {/* Email */}

              <div className="space-y-2">

                <label
                  htmlFor="email"
                  className="text-xs font-medium text-[#d4d4dc]"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777781]" />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* Password */}

              <div className="space-y-2">

                <label
                  htmlFor="password"
                  className="text-xs font-medium text-[#d4d4dc]"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777781]" />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-11`}
                    autoComplete={
                      isLogin
                        ? "current-password"
                        : "new-password"
                    }
                    required
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777781] transition-colors hover:text-[#f8d250]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm password */}

              {!isLogin && (
                <div className="space-y-2">

                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-medium text-[#d4d4dc]"
                  >
                    Confirm password
                  </label>

                  <div className="relative">

                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777781]" />

                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputClass} pr-11`}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777781] hover:text-[#f8d250]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                  </div>

                </div>
              )}

              {/* Coding profiles */}

              <div className="space-y-3">

                <div className="flex items-center gap-3 py-1">

                  <div className="h-px flex-1 bg-white/[0.07]" />

                  <span className="text-[10px] font-medium uppercase tracking-widest text-[#777781]">
                    Coding profiles
                  </span>

                  <div className="h-px flex-1 bg-white/[0.07]" />

                </div>

                {/* Codeforces */}

                <div className="relative">

                  <BarChart3 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />

                  <Input
                    name="cfHandle"
                    aria-label="Codeforces handle"
                    placeholder="Codeforces handle"
                    value={formData.cfHandle}
                    onChange={handleChange}
                    className={inputClass}
                  />

                </div>

                {/* LeetCode */}

                <div className="relative">

                  <Code2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />

                  <Input
                    name="lcHandle"
                    aria-label="LeetCode handle"
                    placeholder="LeetCode handle"
                    value={formData.lcHandle}
                    onChange={handleChange}
                    className={inputClass}
                  />

                </div>

              </div>

              {/* Submit button */}

              <Button
                type="submit"
                disabled={loading}
                className="group h-12 w-full rounded-xl bg-[#f8d250] text-sm font-bold text-[#111218] transition-all duration-300 hover:bg-[#ffe38b] hover:shadow-[0_0_30px_rgba(248,210,80,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                    {isLogin
                      ? "Signing in..."
                      : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin
                      ? "Enter the Arena"
                      : "Create your account"}

                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}

              </Button>

            </form>

            {/* Switch authentication mode */}

            <p className="mt-6 text-center text-xs text-[#a8a8b3]">

              {isLogin
                ? "New to CodeVerse?"
                : "Already part of the Arena?"}{" "}

              <button
                type="button"
                disabled={loading}
                onClick={toggleMode}
                className="font-semibold text-[#f8d250] hover:underline"
              >
                {isLogin ? "Create account" : "Sign in"}
              </button>

            </p>

            {/* Security footer */}

            <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-5 text-[11px] text-[#777781]">

              <ShieldCheck className="h-4 w-4 text-[#f8d250]/70" />

              CodeVerse authentication

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-12">

        <p className="text-xs text-[#777781]">
          © {new Date().getFullYear()} CodeVerse Arena.
        </p>

        <p className="text-[10px] tracking-[0.2em] text-[#777781]">
          THINK. CODE. COMPETE. REPEAT.
        </p>

        <a
          href="https://github.com/harshsingh0704/CodeVerse-Arena"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-[#a8a8b3] transition-colors hover:text-[#f8d250]"
        >
          <Github className="h-4 w-4" />
          Source code
          <ArrowUpRight className="h-3 w-3" />
        </a>

      </footer>

    </div>
  );
};

export default AuthPage;