import { useMemo } from 'react';
import { useAppData } from '../store/AppDataContext';
import { formatDisplayDate } from '../logic/dateUtils';

interface Props {
  selectedDates: Set<string>;
  onGoToCalendar: () => void;
}

const NON_SCALABLE = ['適量', '少々', 'お好みで', '適宜'];
function isNonScalable(amount: string): boolean {
  return NON_SCALABLE.some((p) => amount.includes(p));
}

interface AmountCount {
  text: string;
  count: number;
}

interface ServingPairCount {
  amount1: string;
  amount3: string;
  count: number;
}

interface AggregatedIngredient {
  key: string;
  name: string;
  amounts: AmountCount[];
  servingPairs: ServingPairCount[];
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
          const pair = entry.servingPairs.find((p) => p.amount1 === ing.amount1 && p.amount3 === ing.amount3);
          if (pair) pair.count += 1;
          else entry.servingPairs.push({ amount1: ing.amount1, amount3: ing.amount3, count: 1 });
        } else if (ing.amount) {
          if (isNonScalable(ing.amount)) {
            if (!entry.amounts.some((a) => a.text === ing.amount)) entry.amounts.push({ text: ing.amount, count: 1 });
          } else {
            const found = entry.amounts.find((a) => a.text === ing.amount);
            if (found) found.count += 1;
            else entry.amounts.push({ text: ing.amount, count: 1 });
          }
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
                            <span>
                              <b>1人分</b> {p.amount1}
                              {p.count > 1 ? ` ×${p.count}` : ''}
                            </span>
                            <span>
                              <b>3人分</b> {p.amount3}
                              {p.count > 1 ? ` ×${p.count}` : ''}
                            </span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      item.amounts.length > 0 && (
                        <span className="muted small">
                          {item.amounts.map((a) => (a.count > 1 ? `${a.text} ×${a.count}` : a.text)).join('、')}
                        </span>
                      )
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
