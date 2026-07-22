"use client";
import Link from "next/link";
import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "../lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        window.location.href = "/dashboard";
      } else {
        setCheckEmail(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        window.location.href = "/dashboard";
      }
    }
    setLoading(false);
  }

  if (checkEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-5 h-5 text-forest-800" />
          </div>
          <h1 className="text-xl font-medium text-forest-900 mb-3">Check your email</h1>
          <p className="text-sm text-black/60">
            We sent a confirmation link to <strong>{email}</strong>. Click it
            to activate your account, then come back and sign in.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-7 h-7 rounded-md bg-forest-800 flex items-center justify-center">
            <span className="text-white text-sm font-medium">T</span>
          </div>
          <span className="text-lg font-medium text-forest-900">Traceable</span>
        </Link>

        <h1 className="text-xl font-medium text-forest-900 mb-1 text-center">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="text-sm text-black/50 mb-6 text-center">
          {mode === "signin" ? "Welcome back" : "Start tracking recipes and compliance"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black/70 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-black/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black/70 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-black/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-forest-800 text-white font-medium hover:bg-forest-900 transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Please wait" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-black/50 text-center mt-6">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-forest-800 font-medium hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-forest-800 font-medium hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}