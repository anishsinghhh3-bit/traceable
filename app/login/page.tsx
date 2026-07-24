"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "../lib/supabase/client";
import Link from "next/link";

const errorMessages: Record<string, string> = {
  "Invalid login credentials": "Incorrect email or password.",
  "User already registered": "An account with this email already exists.",
  "Email not confirmed": "Please confirm your email before signing in.",
};

function friendlyError(message: string) {
  return errorMessages[message] ?? "Something went wrong. Please try again.";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "starter";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const supabase = createClient();

  async function ensureSubscription(userId: string) {
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existing) {
      await supabase.from("subscriptions").insert({
        user_id: userId,
        plan: plan === "growth" || plan === "enterprise" ? "starter" : plan,
        status: "active",
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(friendlyError(error.message));
      } else if (data.session && data.user) {
        await ensureSubscription(data.user.id);
        window.location.href = "/dashboard";
      } else {
        setCheckEmail(true);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(friendlyError(error.message));
      } else if (data.user) {
        await ensureSubscription(data.user.id);
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
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L9 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
              <path d="M4 13L9 18L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-medium text-forest-900">Traceable</span>
        </Link>

        <h1 className="text-xl font-medium text-forest-900 mb-1 text-center">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h1>
        <p className="text-sm text-black/50 mb-6 text-center">
          {mode === "signin" ? "Welcome back" : "Start tracking recipes and compliance"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
          <fieldset disabled={loading} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black/70 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-black/30 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-black/30 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-forest-800 text-white font-medium hover:bg-forest-900 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
              {loading ? "Please wait" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </fieldset>
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}