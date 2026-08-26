import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppData, Ingredient, PantryItem, Recipe } from '../types';
import { builtinRecipes } from '../data/builtinRecipes';
import { generateId, loadAppData, saveAppData } from '../store/storage';
import { fillEmptySlots, generateMealPlan, pickReplacement } from '../logic/planGenerator';
import { addDays } from '../logic/dateUtils';

interface AppDataContextValue {
  customRecipes: Recipe[];
  builtinRecipes: Recipe[];
  excludedBuiltinIds: string[];
  activeRecipes: Recipe[]; // 献立生成に使える全レシピ(除外済みビルトインを除く)
  allRecipesById: Map<string, Recipe>;
  mealPlan: Record<string, string | null>;
  pantry: PantryItem[];
  shoppingChecked: Record<string, boolean>;

  addCustomRecipe: (input: { name: string; ingredients: Ingredient[]; cookMinutes?: number; memo?: string }) => void;
  updateCustomRecipe: (id: string, updates: Partial<Omit<Recipe, 'id' | 'isCustom'>>) => void;
  deleteCustomRecipe: (id: string) => void;
  toggleExcludeBuiltin: (id: string) => void;
  isBuiltinOverridden: (id: string) => boolean;
  updateBuiltinRecipe: (id: string, updates: { name: string; ingredients: Ingredient[]; cookMinutes?: number }) => void;
  resetBuiltinRecipe: (id: string) => void;

  setMealPlanDay: (date: string, recipeId: string | null) => void;
  generatePlanForDates: (dates: string[], options?: { overwrite?: boolean }) => void;
  regenerateDay: (date: string) => void;

  addPantryItem: (name: string) => void;
  togglePantryOut: (id: string) => void;
  deletePantryItem: (id: string) => void;

  toggleShoppingChecked: (key: string) => void;
  clearShoppingChecked: (keys?: string[]) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function applyBuiltinOverrides(overrides: AppData['builtinOverrides']): Recipe[] {
  return builtinRecipes.map((r) => {
    const override = overrides[r.id];
    if (!override) return r;
    return { ...r, name: override.name, ingredients: override.ingredients, cookMinutes: override.cookMinutes };
  });
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData());

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const effectiveBuiltinRecipes = useMemo(
    () => applyBuiltinOverrides(data.builtinOverrides),
    [data.builtinOverrides],
  );

  const activeRecipes = useMemo(() => {
    const excluded = new Set(data.excludedBuiltinIds);
    return [...data.customRecipes, ...effectiveBuiltinRecipes.filter((r) => !excluded.has(r.id))];
  }, [data.customRecipes, data.excludedBuiltinIds, effectiveBuiltinRecipes]);

  const allRecipesById = useMemo(() => {
    const map = new Map<string, Recipe>();
    for (const r of data.customRecipes) map.set(r.id, r);
    for (const r of effectiveBuiltinRecipes) map.set(r.id, r);
    return map;
  }, [data.customRecipes, effectiveBuiltinRecipes]);

  const value: AppDataContextValue = {
    customRecipes: data.customRecipes,
    builtinRecipes: effectiveBuiltinRecipes,
    excludedBuiltinIds: data.excludedBuiltinIds,
    activeRecipes,
    allRecipesById,
    mealPlan: data.mealPlan,
    pantry: data.pantry,
    shoppingChecked: data.shoppingChecked,

    addCustomRecipe: (input) => {
      const recipe: Recipe = {
        id: generateId('r'),
        name: input.name,
        ingredients: input.ingredients,
        cookMinutes: input.cookMinutes,
        memo: input.memo,
        isCustom: true,
      };
      setData((prev) => ({ ...prev, customRecipes: [...prev.customRecipes, recipe] }));
    },

    updateCustomRecipe: (id, updates) => {
      setData((prev) => ({
        ...prev,
        customRecipes: prev.customRecipes.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      }));
    },

    deleteCustomRecipe: (id) => {
      setData((prev) => ({
        ...prev,
        customRecipes: prev.customRecipes.filter((r) => r.id !== id),
        mealPlan: Object.fromEntries(
          Object.entries(prev.mealPlan).map(([date, rid]) => [date, rid === id ? null : rid]),
        ),
      }));
    },

    toggleExcludeBuiltin: (id) => {
      setData((prev) => {
        const isExcluded = prev.excludedBuiltinIds.includes(id);
        return {
          ...prev,
          excludedBuiltinIds: isExcluded
            ? prev.excludedBuiltinIds.filter((x) => x !== id)
            : [...prev.excludedBuiltinIds, id],
        };
      });
    },

    isBuiltinOverridden: (id) => !!data.builtinOverrides[id],

    updateBuiltinRecipe: (id, updates) => {
      setData((prev) => ({
        ...prev,
        builtinOverrides: { ...prev.builtinOverrides, [id]: updates },
      }));
    },

    resetBuiltinRecipe: (id) => {
      setData((prev) => {
        const next = { ...prev.builtinOverrides };
        delete next[id];
        return { ...prev, builtinOverrides: next };
      });
    },

    setMealPlanDay: (date, recipeId) => {
      setData((prev) => ({ ...prev, mealPlan: { ...prev.mealPlan, [date]: recipeId } }));
    },

    generatePlanForDates: (dates, options) => {
      setData((prev) => {
        if (dates.length === 0) return prev;
        const excluded = new Set(prev.excludedBuiltinIds);
        const pool = [...prev.customRecipes, ...applyBuiltinOverrides(prev.builtinOverrides).filter((r) => !excluded.has(r.id))];
        const sorted = [...dates].sort();
        const dayBefore = addDays(sorted[0], -1);
        const anchor = prev.mealPlan[dayBefore] ?? null;

        if (options?.overwrite) {
          const generated = generateMealPlan(pool, sorted, anchor);
          return { ...prev, mealPlan: { ...prev.mealPlan, ...generated } };
        }

        const sequence = sorted.map((d) => prev.mealPlan[d] ?? null);
        const filled = fillEmptySlots(pool, sequence, anchor);
        const generated: Record<string, string> = {};
        sorted.forEach((d, i) => {
          if (!prev.mealPlan[d] && filled[i]) generated[d] = filled[i] as string;
        });
        if (Object.keys(generated).length === 0) return prev;
        return { ...prev, mealPlan: { ...prev.mealPlan, ...generated } };
      });
    },

    regenerateDay: (date) => {
      setData((prev) => {
        const excluded = new Set(prev.excludedBuiltinIds);
        const pool = [...prev.customRecipes, ...applyBuiltinOverrides(prev.builtinOverrides).filter((r) => !excluded.has(r.id))];
        const prevId = prev.mealPlan[addDays(date, -1)] ?? null;
        const nextId = prev.mealPlan[addDays(date, 1)] ?? null;
        const currentId = prev.mealPlan[date] ?? null;
        const replacement = pickReplacement(pool, prevId, nextId, currentId);
        return { ...prev, mealPlan: { ...prev.mealPlan, [date]: replacement } };
      });
    },

    addPantryItem: (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setData((prev) => ({
        ...prev,
        pantry: [...prev.pantry, { id: generateId('pantry'), name: trimmed, isOut: false }],
      }));
    },

    togglePantryOut: (id) => {
      setData((prev) => ({
        ...prev,
        pantry: prev.pantry.map((p) => (p.id === id ? { ...p, isOut: !p.isOut } : p)),
      }));
    },

    deletePantryItem: (id) => {
      setData((prev) => ({ ...prev, pantry: prev.pantry.filter((p) => p.id !== id) }));
    },

    toggleShoppingChecked: (key) => {
      setData((prev) => ({
        ...prev,
        shoppingChecked: { ...prev.shoppingChecked, [key]: !prev.shoppingChecked[key] },
      }));
    },

    clearShoppingChecked: (keys) => {
      setData((prev) => {
        if (!keys) return { ...prev, shoppingChecked: {} };
        const next = { ...prev.shoppingChecked };
        for (const k of keys) delete next[k];
        return { ...prev, shoppingChecked: next };
      });
    },
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
