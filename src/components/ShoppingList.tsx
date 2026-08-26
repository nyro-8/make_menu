import { useMemo } from 'react';
import { useAppData } from '../store/AppDataContext';
import { formatDisplayDate } from '../logic/dateUtils';

interface Props {
  selectedDates: Set<string>;
  onGoToCalendar: () => void;
}

interface AggregatedIngredient {
  key: string;
  name: string;
  amounts: string[];
}

export function ShoppingList({ selectedDates, onGoToCalendar }: Props) {
  const { mealPlan, allRecipesById, pantry, shoppingChecked, toggleShoppingChecked, clearShoppingChecked } =
    useAppData();

  const sortedDates = useMemo(() => [...selectedDates].sort(), [selectedDates]);

  const ingredientItems = useMemo(() => {
    const map = new Map<string, AggregatedIngredient>();
    for (const date of sortedDates) {
      const recipeId = mealPlan[date];
      if (!recipeId) continue;
      const recipe = allRecipesById.get(recipeId);
      if (!recipe) continue;
      for (const ing of recipe.ingredients) {
        const key = `ing:${ing.name}`;
        const existing = map.get(key);
        if (existing) {
          if (ing.amount && !existing.amounts.includes(ing.amount)) existing.amounts.push(ing.amount);
        } else {
          map.set(key, { key, name: ing.name, amounts: ing.amount ? [ing.amount] : [] });
        }
      }
    }
    return [...map.values()];
  }, [sortedDates, mealPlan, allRecipesById]);

  const outPantryItems = pantry.filter((p) => p.isOut);

  const allKeys = [...ingredientItems.map((i) => i.key), ...outPantryItems.map((p) => `pantry:${p.id}`)];
  const checkedCount = allKeys.filter((k) => shoppingChecked[k]).length;

  return (
    <div className="screen">
      <div className="section-header">
        <h2>買い物リスト</h2>
      </div>

      {sortedDates.length === 0 ? (
        <p className="muted">
          カレンダー画面で「買い物用に日を選ぶ」から日付を選択すると、必要な食材がここに表示されます。
        </p>
      ) : (
        <>
          <p className="muted small">
            対象: {sortedDates.map((d) => formatDisplayDate(d)).join('、')}
          </p>
          <button className="btn btn-small" onClick={onGoToCalendar}>カレンダーで選び直す</button>
        </>
      )}

      {allKeys.length > 0 && (
        <div className="shopping-summary">
          <span>{checkedCount} / {allKeys.length} 個購入済み</span>
          <button className="btn btn-small" onClick={() => clearShoppingChecked(allKeys)}>
            チェックをリセット
          </button>
        </div>
      )}

      {outPantryItems.length > 0 && (
        <>
          <h3 className="list-title">切れている調味料・常備品</h3>
          <div className="shopping-list">
            {outPantryItems.map((p) => {
              const key = `pantry:${p.id}`;
              const checked = !!shoppingChecked[key];
              return (
                <label key={key} className={`shopping-item ${checked ? 'checked' : ''}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleShoppingChecked(key)} />
                  <span>{p.name}</span>
                </label>
              );
            })}
          </div>
        </>
      )}

      {sortedDates.length > 0 && (
        <>
          <h3 className="list-title">献立の食材</h3>
          {ingredientItems.length === 0 ? (
            <p className="muted">選択した日にはまだ献立が決まっていません。</p>
          ) : (
            <div className="shopping-list">
              {ingredientItems.map((item) => {
                const checked = !!shoppingChecked[item.key];
                return (
                  <label key={item.key} className={`shopping-item ${checked ? 'checked' : ''}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleShoppingChecked(item.key)} />
                    <span>{item.name}</span>
                    {item.amounts.length > 0 && <span className="muted small">{item.amounts.join('、')}</span>}
                  </label>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
