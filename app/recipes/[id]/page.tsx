"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, GitCommit } from "lucide-react";
import { createClient } from "../../lib/supabase/client";

type Recipe = {
  id: string;
  name: string;
  version: string;
  status: string;
  notes: string | null;
  created_at: string;
};

type Version = {
  id: string;
  version: string;
  notes: string | null;
  created_at: string;
};

type ComplianceCheck = {
  id: string;
  label: string;
  is_checked: boolean;
  checked_at: string | null;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ComplianceRing({ checked, total }: { checked: number; total: number }) {
  const size = 32;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? checked / total : 0;
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={stroke} fill="none" className="text-black/5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-forest-800 transition-all duration-500 ease-out"
        />
      </svg>
    </div>
  );
}

export default function RecipeDetail() {
  const params = useParams();
  const rawId = params.id as string;
  const recipeId = UUID_PATTERN.test(rawId) ? rawId : null;
  const supabase = createClient();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [checkError, setCheckError] = useState("");

  async function loadData() {
    if (!recipeId) {
      setLoading(false);
      return;
    }
    const { data: recipeData } = await supabase.from("recipes").select("*").eq("id", recipeId).single();
    const { data: versionData } = await supabase
      .from("recipe_versions")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: false });
    const { data: checkData } = await supabase
      .from("compliance_checks")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: true });

    setRecipe(recipeData);
    setVersions(versionData ?? []);
    setChecks(checkData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  async function toggleCheck(check: ComplianceCheck) {
    const previous = checks;
    const nowChecked = !check.is_checked;
    setCheckError("");

    setChecks((prev) =>
      prev.map((c) =>
        c.id === check.id
          ? { ...c, is_checked: nowChecked, checked_at: nowChecked ? new Date().toISOString() : null }
          : c
      )
    );

    const { error } = await supabase
      .from("compliance_checks")
      .update({ is_checked: nowChecked, checked_at: nowChecked ? new Date().toISOString() : null })
      .eq("id", check.id);

    if (error) {
      setChecks(previous);
      setCheckError("Couldn't save that change. Please try again.");
    }
  }

  async function handleAddVersion(e: React.FormEvent) {
    e.preventDefault();
    if (!newVersion.trim() || !recipeId) return;
    setSaving(true);

    const { error: versionError } = await supabase
      .from("recipe_versions")
      .insert({ recipe_id: recipeId, version: newVersion.trim(), notes: newNotes.trim() || null });

    if (!versionError) {
      await supabase
        .from("recipes")
        .update({ version: newVersion.trim(), updated_at: new Date().toISOString() })
        .eq("id", recipeId);

      setNewVersion("");
      setNewNotes("");
      setShowForm(false);
      await loadData();
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-black/40 text-sm">Loading...</p>
      </main>
    );
  }

  if (!recipeId || !recipe) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-black/60 text-sm mb-4">
            {!recipeId ? "That link doesn't look right." : "Recipe not found."}
          </p>
          <Link href="/dashboard" className="text-sm font-medium text-forest-800 hover:underline">
            ← Back to recipes
          </Link>
        </div>
      </main>
    );
  }

  const checkedCount = checks.filter((c) => c.is_checked).length;
  const allChecked = checks.length > 0 && checkedCount === checks.length;

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-4 sm:px-8 py-5 border-b border-black/5 max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-forest-800 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L9 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
              <path d="M4 13L9 18L20 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-medium text-forest-900">Traceable</span>
        </Link>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-black/50 hover:text-forest-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          Back to recipes
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-medium text-forest-900">{recipe.name}</h1>
          <span className="text-xs px-2.5 py-1 rounded-md bg-forest-50 text-forest-800 font-medium">
            {recipe.status}
          </span>
        </div>
        <p className="text-sm text-black/50 mb-10">Current version: {recipe.version}</p>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-black/70">Compliance checklist</h2>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${allChecked ? "bg-forest-50 text-forest-800" : "bg-black/5 text-black/50"}`}>
              {checkedCount}/{checks.length} complete
            </span>
            <ComplianceRing checked={checkedCount} total={checks.length} />
          </div>
        </div>

        {checkError && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg mb-3">
            {checkError}
          </p>
        )}

        <div className="bg-white border border-black/5 rounded-2xl divide-y divide-black/5 mb-10">
          {checks.length === 0 ? (
            <p className="text-sm text-black/40 px-5 py-8 text-center">
              No compliance items for this recipe yet.
            </p>
          ) : (
            checks.map((check) => (
              <label key={check.id} htmlFor={`check-${check.id}`} className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-black/1.5 transition-colors">
                <input
                  id={`check-${check.id}`}
                  type="checkbox"
                  checked={check.is_checked}
                  onChange={() => toggleCheck(check)}
                  aria-label={check.label}
                  className="w-4 h-4 rounded border-black/20 text-forest-800 focus:ring-forest-400"
                />
                <span className={`text-sm flex-1 ${check.is_checked ? "text-black/40 line-through" : "text-black/80"}`}>
                  {check.label}
                </span>
                {check.checked_at && (
                  <span className="text-xs text-black/30">
                    {new Date(check.checked_at).toLocaleDateString()}
                  </span>
                )}
              </label>
            ))
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-black/70">Version history</h2>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-forest-800 text-white hover:bg-forest-900 transition-colors">
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            Log new version
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddVersion} className="bg-white border border-black/5 rounded-2xl p-6 mb-6" aria-busy={saving}>
            <fieldset disabled={saving} className="space-y-4">
              <div>
                <label htmlFor="version-label" className="block text-sm font-medium text-black/70 mb-1.5">
                  Version label
                </label>
                <input
                  id="version-label"
                  type="text"
                  required
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="e.g. v1.1"
                  className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="version-notes" className="block text-sm font-medium text-black/70 mb-1.5">
                  What changed
                </label>
                <textarea
                  id="version-notes"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Reduced sugar by 10%, swapped almond flour for oat flour"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 disabled:opacity-50"
                />
              </div>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-forest-800 text-white font-medium text-sm hover:bg-forest-900 transition-colors disabled:opacity-50">
                {saving ? "Saving..." : "Save version"}
              </button>
            </fieldset>
          </form>
        )}

        {versions.length === 0 ? (
          <div className="text-center py-16 bg-white border border-black/5 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-4">
              <GitCommit className="w-5 h-5 text-forest-800" aria-hidden="true" />
            </div>
            <p className="text-black/40 text-sm">
              No version history yet. Log the first change above.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-3.75 top-2 bottom-2 w-px bg-black/5" aria-hidden="true" />
            <div className="space-y-4">
              {versions.map((v) => (
                <div key={v.id} className="relative pl-10">
                  <div className="absolute left-0 top-1 w-7.5 h-7.5 rounded-full bg-white border-2 border-forest-200 flex items-center justify-center">
                    <GitCommit className="w-3.5 h-3.5 text-forest-800" aria-hidden="true" />
                  </div>
                  <div className="bg-white border border-black/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-forest-900">{v.version}</span>
                      <span className="text-xs text-black/40">
                        {new Date(v.created_at).toLocaleString()}
                      </span>
                    </div>
                    {v.notes && <p className="text-sm text-black/60">{v.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}