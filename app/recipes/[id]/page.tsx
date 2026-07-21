"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function RecipeDetail() {
  const params = useParams();
  const recipeId = params.id as string;
  const supabase = createClient();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newVersion, setNewVersion] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const { data: recipeData } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", recipeId)
      .single();

    const { data: versionData } = await supabase
      .from("recipe_versions")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: false });

    setRecipe(recipeData);
    setVersions(versionData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  async function handleAddVersion(e: React.FormEvent) {
    e.preventDefault();
    if (!newVersion.trim()) return;
    setSaving(true);

    const { error: versionError } = await supabase
      .from("recipe_versions")
      .insert({
        recipe_id: recipeId,
        version: newVersion.trim(),
        notes: newNotes.trim() || null,
      });

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

  if (!recipe) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-black/40 text-sm">Recipe not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-black/5 max-w-6xl mx-auto">
        <a href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-forest-800 flex items-center justify-center">
            <span className="text-white text-sm font-medium">T</span>
          </div>
          <span className="text-lg font-medium text-forest-900">Traceable</span>
        </a>
        <a href="/dashboard" className="text-sm font-medium text-black/50 hover:text-forest-900 transition-colors">
          ← Back to recipes
        </a>
      </nav>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-medium text-forest-900">{recipe.name}</h1>
          <span className="text-xs px-2.5 py-1 rounded-md bg-forest-50 text-forest-800 font-medium">
            {recipe.status}
          </span>
        </div>
        <p className="text-sm text-black/50 mb-8">
          Current version: {recipe.version}
        </p>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-black/70">Version history</h2>
          <button onClick={() => setShowForm(!showForm)} className="text-sm font-medium px-3 py-1.5 rounded-lg bg-forest-800 text-white hover:bg-forest-900 transition-colors">
            + Log new version
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddVersion} className="bg-white border border-black/5 rounded-2xl p-6 mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 mb-1.5">
                Version label
              </label>
              <input
                type="text"
                required
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="e.g. v1.1"
                className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 mb-1.5">
                What changed
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. Reduced sugar by 10%, swapped almond flour for oat flour"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
              />
            </div>
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-forest-800 text-white font-medium text-sm hover:bg-forest-900 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save version"}
            </button>
          </form>
        )}

        {versions.length === 0 ? (
          <div className="text-center py-16 bg-white border border-black/5 rounded-2xl">
            <p className="text-black/40 text-sm">
              No version history yet. Log the first change above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((v) => (
              <div key={v.id} className="bg-white border border-black/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-forest-900">{v.version}</span>
                  <span className="text-xs text-black/40">
                    {new Date(v.created_at).toLocaleString()}
                  </span>
                </div>
                {v.notes && (
                  <p className="text-sm text-black/60">{v.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}