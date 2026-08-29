import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Lock, Mail, ArrowRight, ShieldAlert } from "lucide-react";
import { useAdmin } from "../../context/AdminContext.jsx";

const HCAPTCHA_SITE_KEY = "2442079e-fad4-44d6-8592-87f0e3346108";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!captchaToken) {
      setError("Please complete the security check.");
      return;
    }
    setLoading(true);
    try {
      const ok = await login(email, password, captchaToken);
      if (ok) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err?.message || "Login failed. Check your connection.");
      setCaptchaToken(null);
      captchaRef.current?.resetCaptcha();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deepPurple via-royalPurple to-vibrantOrange flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md glass rounded-xl2 shadow-glowPurple p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-brand-gradient grid place-items-center shadow-glowPurple mb-4">
            <ShieldAlert size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-ink dark:text-white">Admin Login</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">LocoGlovo Staff Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
            <Mail size={18} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-4 py-3 focus-within:ring-2 focus-within:ring-vibrantOrange">
            <Lock size={18} className="text-royalPurple dark:text-vibrantOrange shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-transparent outline-none text-sm text-ink dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex justify-center">
            <HCaptcha
              ref={captchaRef}
              sitekey={HCAPTCHA_SITE_KEY}
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient text-white font-display font-semibold py-3 px-6 shadow-glowPurple hover:shadow-glowOrange transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Authorized personnel only.
        </p>
      </motion.div>
    </div>
  );
}
