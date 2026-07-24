import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-5">
          <FileQuestion className="w-5 h-5 text-forest-800" />
        </div>
        <h1 className="text-lg font-medium text-forest-900 mb-2">Page not found</h1>
        <p className="text-sm text-black/50 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link href="/" className="inline-block px-4 py-2 rounded-lg bg-forest-800 text-white text-sm font-medium hover:bg-forest-900 transition-colors">
          Go home
        </Link>
      </div>
    </main>
  );
}