import Link from "next/link";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-black/5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-forest-800 flex items-center justify-center">
            <span className="text-white text-sm font-medium">T</span>
          </div>
          <span className="text-lg font-medium text-forest-900">Traceable</span>
        </Link>
        <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-forest-800 text-white hover:bg-forest-900 transition-colors">
          Sign in
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-medium text-forest-900 mb-3">
            Simple pricing for growing food brands
          </h1>
          <p className="text-black/60">Start free. Upgrade when your team is ready.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-black/5 rounded-2xl p-7">
            <h2 className="font-medium text-forest-900 mb-1">Starter</h2>
            <p className="text-sm text-black/50 mb-5">For small teams getting started</p>
            <p className="text-3xl font-medium text-forest-900 mb-1">Free</p>
            <p className="text-sm text-black/40 mb-6">Up to 3 recipes</p>
            <Link href="/login" className="block text-center py-2.5 rounded-lg border border-black/10 text-forest-900 font-medium text-sm hover:bg-black/2 transition-colors mb-6">
              Get started
            </Link>
            <ul className="space-y-2.5 text-sm text-black/60">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-forest-800" /> Recipe version control</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-forest-800" /> Compliance checklists</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-forest-800" /> 1 team member</li>
            </ul>
          </div>

          <div className="bg-forest-900 rounded-2xl p-7 relative">
            <span className="absolute -top-3 left-7 text-xs font-medium px-2.5 py-1 rounded-md bg-forest-400 text-forest-900">
              Most popular
            </span>
            <h2 className="font-medium text-white mb-1">Growth</h2>
            <p className="text-sm text-white/60 mb-5">For teams shipping regularly</p>
            <p className="text-3xl font-medium text-white mb-1">$249</p>
            <p className="text-sm text-white/40 mb-6">per month</p>
            <a href="mailto:hello@traceable.app?subject=Growth%20plan%20waitlist" className="block text-center py-2.5 rounded-lg bg-white text-forest-900 font-medium text-sm hover:bg-white/90 transition-colors mb-6">
              Join waitlist
            </a>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Unlimited recipes</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Full audit trail & exports</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Up to 10 team members</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Priority support</li>
            </ul>
          </div>

          <div className="bg-white border border-black/5 rounded-2xl p-7">
            <h2 className="font-medium text-forest-900 mb-1">Enterprise</h2>
            <p className="text-sm text-black/50 mb-5">For multi-facility operations</p>
            <p className="text-3xl font-medium text-forest-900 mb-1">Custom</p>
            <p className="text-sm text-black/40 mb-6">Talk to us</p>
            <a href="mailto:hello@traceable.app?subject=Enterprise%20inquiry" className="block text-center py-2.5 rounded-lg border border-black/10 text-forest-900 font-medium text-sm hover:bg-black/2 transition-colors mb-6">
              Contact sales
            </a>
            <ul className="space-y-2.5 text-sm text-black/60">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-forest-800" /> Everything in Growth</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-forest-800" /> Multiple facilities</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-forest-800" /> Custom integrations</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-forest-800" /> Dedicated onboarding</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}