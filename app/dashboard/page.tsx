"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Plus, FileText } from "lucide-react";
import { createClient } from "../lib/supabase/client";

type Recipe = {
  id: string;
  name: string;
  version: string;
  status: string;
  notes: string | null;
  created_at: string;
};

export default function Dashboard() {
  const supabase = createClient();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  async function loadRecipes() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      window.location.href = "/login";
      return;
    }
    setUserEmail(userData.user.email ?? "");

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setRecipes(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data: newRecipe, error } = await supabase
      .from("recipes")
      .insert({ name: newName.trim(), user_id: userData.user.id })
      .select()
      .single();

    if (!error && newRecipe) {
      const standardChecks = [
        "Allergen labeling reviewed",
        "Ingredient sourcing verified",
        "Nutritional info calculated",
        "Shelf-life / storage guidance confirmed",
        "Packaging claims match regulations",
      ];
      await supabase.from("compliance_checks").insert(
        standardChecks.map((label) => ({ recipe_id: newRecipe.id, label }))
      );

      setNewName("");
      setShowForm(false);
      await loadRecipes();
    }
    setCreating(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <nav className="flex items-center justify-between px-8 py-5 border-b border-black/5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-forest-800 flex items-center justify-center">
              <span className="text-white text-sm font-medium">T</span>
            </div>
            <span className="text-lg font-medium text-forest-900">Traceable</span>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-8 py-10">
          <div className="h-7 w-32 bg-black/5 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-20 bg-black/5 rounded-lg animate-pulse mb-8"></div>
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-black/5 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="h-4 w-40 bg-black/5 rounded-lg animate-pulse mb-2"></div>
                  <div className="h-3 w-28 bg-black/5 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-6 w-14 bg-black/5 rounded-md animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-black/5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-forest-800 flex items-center justify-center">
            <span className="text-white text-sm font-medium">T</span>
          </div>
          <span className="text-lg font-medium text-forest-900">Traceable</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-black/50">{userEmail}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-black/10 text-forest-900 hover:bg-black/2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-forest-900">Recipes</h1>
            <p className="text-sm text-black/50 mt-1">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-forest-800 text-white font-medium text-sm hover:bg-forest-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New recipe
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white border border-black/5 rounded-2xl p-6 mb-8 flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-black/70 mb-1.5">Recipe name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sourdough starter"
                className="w-full px-3 py-2.5 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 rounded-lg bg-forest-800 text-white font-medium text-sm hover:bg-forest-900 transition-colors disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </form>
        )}

        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-black/5 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-5 h-5 text-forest-800" />
            </div>
            <p className="text-black/70 font-medium mb-1">No recipes yet</p>
            <p className="text-black/40 text-sm mb-6">
              Create your first recipe to start tracking versions and compliance.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-forest-800 text-white font-medium text-sm hover:bg-forest-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New recipe
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {recipes.map((recipe) => (
              <a key={recipe.id} href={`/recipes/${recipe.id}`} className="bg-white border border-black/5 rounded-2xl p-5 flex items-center justify-between hover:border-black/10 transition-colors">
                <div>
                  <p className="font-medium text-forest-900">{recipe.name}</p>
                  <p className="text-sm text-black/40 mt-0.5">
                    {recipe.version} · Created {new Date(recipe.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-forest-50 text-forest-800 font-medium">
                  {recipe.status}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}