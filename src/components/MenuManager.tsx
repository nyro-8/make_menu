import { useState } from 'react';
import { useAppData } from '../store/AppDataContext';
import type { Ingredient, Recipe } from '../types';

function emptyIngredient(): Ingredient {
  return { name: '', amount: '' };
}

export function MenuManager() {
  const {
    customRecipes,
    builtinRecipes,
    excludedBuiltinIds,
    addCustomRecipe,
    updateCustomRecipe,
    deleteCustomRecipe,
    toggleExcludeBuiltin,
  } = useAppData();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [cookMinutes, setCookMinutes] = useState('');
  const [memo, setMemo] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([emptyIngredient()]);

  function resetForm() {
    setName('');
    setCookMinutes('');
    setMemo('');
    setIngredients([emptyIngredient()]);
    setEditingId(null);
  }

  function openAddForm() {
    resetForm();
    setFormOpen(true);
  }

  function openEditForm(recipe: Recipe) {
    setEditingId(recipe.id);
    setName(recipe.name);
    setCookMinutes(recipe.cookMinutes ? String(recipe.cookMinutes) : '');
    setMemo(recipe.memo ?? '');
    setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [emptyIngredient()]);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    resetForm();
  }

  function updateIngredient(idx: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) => prev.map((ing, i) => (i === idx ? { ...ing, [field]: value } : ing)));
  }

  function addIngredientRow() {
    setIngredients((prev) => [...prev, emptyIngredient()]);
  }

  function removeIngredientRow(idx: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const cleanIngredients = ingredients
      .map((ing) => ({ name: ing.name.trim(), amount: ing.amount.trim() }))
      .filter((ing) => ing.name.length > 0);

    const payload = {
      name: trimmedName,
      cookMinutes: cookMinutes ? Number(cookMinutes) : undefined,
      memo: memo.trim() || undefined,
      ingredients: cleanIngredients,
    };

    if (editingId) {
      updateCustomRecipe(editingId, payload);
    } else {
      addCustomRecipe(payload);
    }
    closeForm();
  }

  return (
    <div className="screen">
      <div className="section-header">
        <h2>自分のメニュー</h2>
        {!formOpen && (
          <button className="btn btn-primary" onClick={openAddForm}>
            + メニューを追加
          </button>
        )}
      </div>

      {formOpen && (
        <form className="card recipe-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>メニュー名</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 肉じゃが" required />
          </label>
          <label className="field">
            <span>調理時間の目安(分・任意)</span>
            <input
              type="number"
              min={0}
              value={cookMinutes}
              onChange={(e) => setCookMinutes(e.target.value)}
              placeholder="例: 20"
            />
          </label>

          <div className="field">
            <span>材料</span>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="ingredient-row">
                <input
                  placeholder="材料名"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                />
                <input
                  placeholder="分量"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                />
                <button type="button" className="icon-btn" onClick={() => removeIngredientRow(idx)} aria-label="削除">
                  ✕
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-small" onClick={addIngredientRow}>
              + 材料を追加
            </button>
          </div>

          <label className="field">
            <span>メモ(任意)</span>
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={2} />
          </label>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? '更新する' : '登録する'}
            </button>
            <button type="button" className="btn" onClick={closeForm}>
              キャンセル
            </button>
          </div>
        </form>
      )}

      {customRecipes.length === 0 && !formOpen && (
        <p className="muted">まだ登録したメニューがありません。よく作る料理を登録しておくと献立作成で優先的に使われます。</p>
      )}

      <div className="recipe-list">
        {customRecipes.map((r) => (
          <div key={r.id} className="card recipe-card">
            <div className="recipe-card-main">
              <p className="recipe-name">{r.name}</p>
              <p className="muted small">
                {r.cookMinutes ? `${r.cookMinutes}分 ・ ` : ''}
                {r.ingredients.map((i) => i.name).join('、') || '材料未登録'}
              </p>
            </div>
            <div className="recipe-card-actions">
              <button className="btn btn-small" onClick={() => openEditForm(r)}>編集</button>
              <button className="btn btn-small btn-danger-outline" onClick={() => deleteCustomRecipe(r.id)}>削除</button>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h2>簡単レシピ集(自動作成で使用)</h2>
      </div>
      <p className="muted small">
        チェックを外すと、そのメニューは献立の自動作成で使われなくなります。
      </p>
      <div className="builtin-list">
        {builtinRecipes.map((r) => {
          const included = !excludedBuiltinIds.includes(r.id);
          return (
            <label key={r.id} className="builtin-item">
              <input type="checkbox" checked={included} onChange={() => toggleExcludeBuiltin(r.id)} />
              <span className="builtin-name">{r.name}</span>
              <span className="muted small">{r.cookMinutes}分</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
