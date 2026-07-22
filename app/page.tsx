import { ClipboardCheck, GitBranch, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-black/5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-forest-800 flex items-center justify-center">
            <span className="text-white text-sm font-medium">T</span>
          </div>
          <span className="text-lg font-medium text-forest-900">Traceable</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-black/60">
          <a href="#features" className="hover:text-forest-900 transition-colors">Features</a>
          <a href="/pricing" className="hover:text-forest-900 transition-colors">Pricing</a>
        </div>
        <a href="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-forest-800 text-white hover:bg-forest-900 transition-colors">Sign in</a>
      </nav>

      <section className="max-w-6xl mx-auto px-8 pt-20 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-forest-50 text-forest-800 mb-6">
            Built for food & beverage teams
          </span>
          <h1 className="text-4xl md:text-5xl font-medium text-forest-900 mb-5 leading-tight">
            Recipe changes and compliance, finally in one place
          </h1>
          <p className="text-lg text-black/60 mb-8 leading-relaxed">
            Traceable replaces spreadsheets and email threads with version
            control built specifically for food and beverage product development.
          </p>
          <div className="flex items-center gap-4">
            <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-forest-800 text-white font-medium hover:bg-forest-900 transition-colors">
              Get started
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/pricing" className="px-6 py-3 rounded-lg border border-black/10 text-forest-900 font-medium hover:bg-black/2 transition-colors">
              View pricing
            </a>
          </div>
          <p className="text-sm text-black/40 mt-6">
            No credit card required · Free for your first 3 recipes
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-medium text-forest-900">Sourdough starter v4</span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-forest-50 text-forest-800 font-medium">approved</span>
          </div>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm py-2 border-b border-black/5">
              <span className="text-black/50">Version</span>
              <span className="text-black/80 font-medium">v4.2</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-black/5">
              <span className="text-black/50">Edited by</span>
              <span className="text-black/80 font-medium">M. Fischer</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-black/5">
              <span className="text-black/50">Compliance check</span>
              <span className="text-forest-800 font-medium">3/3 passed</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-2 rounded-full bg-forest-200"></div>
            <div className="flex-1 h-2 rounded-full bg-forest-200"></div>
            <div className="flex-1 h-2 rounded-full bg-black/5"></div>
          </div>
          <p className="text-xs text-black/40 mt-2">Step 2 of 3 — allergen review</p>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-8 py-20 border-t border-black/5">
        <h2 className="text-2xl font-medium text-forest-900 mb-12 text-center">
          Everything your R&D team needs, nothing they don&apos;t
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="w-10 h-10 rounded-lg bg-forest-50 flex items-center justify-center mb-4">
              <GitBranch className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-medium text-forest-900 mb-2">Recipe version control</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              Every formula change tracked automatically, with a full history
              of what changed, when, and why.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-forest-50 flex items-center justify-center mb-4">
              <ClipboardCheck className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-medium text-forest-900 mb-2">Compliance checklists</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              Allergen, labeling, and regulatory checks built into every
              product stage, not buried in a separate spreadsheet.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-forest-50 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-forest-800" />
            </div>
            <h3 className="font-medium text-forest-900 mb-2">Team collaboration</h3>
            <p className="text-sm text-black/60 leading-relaxed">
              R&D, QA, and ops see the same source of truth, so nothing gets
              lost between departments.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5">
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between text-sm text-black/40">
          <span>© 2026 Traceable</span>
          <span>Built for small and mid-sized food brands</span>
        </div>
      </footer>
    </main>
  );
}