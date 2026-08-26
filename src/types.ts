export interface Ingredient {
  name: string;
  amount: string;
  /** 大人1人分の分量(任意・指定した場合はamount3とあわせて2人数分表示される) */
  amount1?: string;
  /** 3人分の分量(任意) */
  amount3?: string;
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
