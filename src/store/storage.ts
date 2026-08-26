import type { AppData, PantryItem } from '../types';

const STORAGE_KEY = 'meal-planner-data-v1';
const CURRENT_VERSION = 1;

export const defaultPantryNames = [
  'しょうゆ', '味噌', '塩', '砂糖', 'サラダ油', 'みりん', '酒', '酢',
  'ケチャップ', 'マヨネーズ', 'こしょう', '片栗粉', 'コンソメ', '鶏がらスープの素',
];

function makeDefaultPantry(): PantryItem[] {
  return defaultPantryNames.map((name, i) => ({
    id: `pantry-default-${i}`,
    name,
    isOut: false,
  }));
}

function makeDefaultData(): AppData {
  return {
    version: CURRENT_VERSION,
    customRecipes: [],
    excludedBuiltinIds: [],
    mealPlan: {},
    pantry: makeDefaultPantry(),
    shoppingChecked: {},
  };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return makeDefaultData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    const defaults = makeDefaultData();
    return {
      version: CURRENT_VERSION,
      customRecipes: parsed.customRecipes ?? defaults.customRecipes,
      excludedBuiltinIds: parsed.excludedBuiltinIds ?? defaults.excludedBuiltinIds,
      mealPlan: parsed.mealPlan ?? defaults.mealPlan,
      pantry: parsed.pantry ?? defaults.pantry,
      shoppingChecked: parsed.shoppingChecked ?? defaults.shoppingChecked,
    };
  } catch {
    return makeDefaultData();
  }
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorageが使えない環境(プライベートモード等)では無視する
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
