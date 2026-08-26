export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  cookMinutes?: number;
  memo?: string;
  isCustom: boolean;
}

export interface MealPlanEntry {
  date: string; // YYYY-MM-DD
  recipeId: string | null;
}

export interface PantryItem {
  id: string;
  name: string;
  isOut: boolean;
}

export interface AppData {
  version: number;
  customRecipes: Recipe[];
  excludedBuiltinIds: string[];
  mealPlan: Record<string, string | null>; // date -> recipeId
  pantry: PantryItem[];
  shoppingChecked: Record<string, boolean>;
}
