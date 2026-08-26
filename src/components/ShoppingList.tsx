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
  servingPairs: { amount1: string; amount3: string }[];
}

export function ShoppingList({ selectedDates, onGoToCalendar }: Props) {
  const { mealPlan, allRecipesById, pantry, togglePantryOut, shoppingChecked, toggleShoppingChecked, clearShoppingChecked } =
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
        let entry = map.get(key);
        if (!entry) {
          entry = { key, name: ing.name, amounts: [], servingPairs: [] };
          map.set(key, entry);
        }
        if (ing.amount1 && ing.amount3) {
          const exists = entry.servingPairs.some((p) => p.amount1 === ing.amount1 && p.amount3 === ing.amount3);
          if (!exists) entry.servingPairs.push({ amount1: ing.amount1, amount3: ing.amount3 });
        } else if (ing.amount && !entry.amounts.includes(ing.amount)) {
          entry.amounts.push(ing.amount);
        }
      }
    }
    return [...map.values()];
  }, [sortedDates, mealPlan, allRecipesById]);

  const outPantryItems = pantry.filter((p) => p.isOut);

  const allKeys = ingredientItems.map((i) => i.key);
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
          <p className="muted small">チェックすると「買った」として調味料の在庫切れ状態が解除されます。</p>
          <div className="shopping-list">
            {outPantryItems.map((p) => (
              <label key={p.id} className="shopping-item">
                <input type="checkbox" checked={false} onChange={() => togglePantryOut(p.id)} />
                <span>{p.name}</span>
              </label>
            ))}
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
                    {item.servingPairs.length > 0 ? (
                      <span className="ingredient-servings">
                        {item.servingPairs.map((p, i) => (
                          <span key={i} className="serving-pair">
                            <span><b>1人分</b> {p.amount1}</span>
                            <span><b>3人分</b> {p.amount3}</span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      item.amounts.length > 0 && <span className="muted small">{item.amounts.join('、')}</span>
                    )}
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
