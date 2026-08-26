import { useState } from 'react';
import type { Recipe } from '../types';
import { formatDisplayDate } from '../logic/dateUtils';

interface Props {
  date: string;
  recipe: Recipe | null;
  activeRecipes: Recipe[];
  onClose: () => void;
  onChangeMenu: (recipeId: string | null) => void;
  onRegenerate: () => void;
}

export function DayDetailModal({ date, recipe, activeRecipes, onClose, onChangeMenu, onRegenerate }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{formatDisplayDate(date)}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="閉じる">✕</button>
        </div>

        {recipe ? (
          <div className="day-detail-body">
            <p className="recipe-name-large">{recipe.name}</p>
            {recipe.cookMinutes && <p className="muted">調理時間 目安 {recipe.cookMinutes}分</p>}
            <ul className="ingredient-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span>{ing.name}</span>
                  {ing.amount1 && ing.amount3 ? (
                    <span className="ingredient-servings">
                      <span><b>1人分</b> {ing.amount1}</span>
                      <span><b>3人分</b> {ing.amount3}</span>
                    </span>
                  ) : (
                    <span className="muted">{ing.amount}</span>
                  )}
                </li>
              ))}
            </ul>
            {recipe.memo && <p className="memo">{recipe.memo}</p>}
          </div>
        ) : (
          <p className="muted day-detail-body">まだ献立が決まっていません。</p>
        )}

        <div className="modal-actions">
          <button className="btn" onClick={() => setPickerOpen((v) => !v)}>
            メニューを選び直す
          </button>
          <button className="btn" onClick={onRegenerate}>
            おまかせで変更
          </button>
          {recipe && (
            <button className="btn btn-danger-outline" onClick={() => onChangeMenu(null)}>
              未定にする
            </button>
          )}
        </div>

        {pickerOpen && (
          <div className="recipe-picker">
            {activeRecipes.length === 0 && <p className="muted">選べるメニューがありません。メニュー管理から登録してください。</p>}
            {activeRecipes.map((r) => (
              <button
                key={r.id}
                className={`recipe-picker-item ${recipe?.id === r.id ? 'active' : ''}`}
                onClick={() => {
                  onChangeMenu(r.id);
                  setPickerOpen(false);
                }}
              >
                {r.name}
                {r.isCustom && <span className="badge">自分の登録</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
