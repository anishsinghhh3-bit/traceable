"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <h1 className="text-lg font-medium text-forest-900 mb-2">Something went wrong</h1>
        <p className="text-sm text-black/50 mb-6">
          An unexpected error occurred. You can try again, or head back to your dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="px-4 py-2 rounded-lg bg-forest-800 text-white text-sm font-medium hover:bg-forest-900 transition-colors">
            Try again
          </button>
          <Link href="/dashboard" className="px-4 py-2 rounded-lg border border-black/10 text-forest-900 text-sm font-medium hover:bg-black/2 transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}