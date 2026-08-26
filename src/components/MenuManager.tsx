import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppData } from '../store/AppDataContext';
import type { Ingredient, Recipe } from '../types';

function emptyIngredient(): Ingredient {
  return { name: '', amount: '', amount1: '', amount3: '' };
}

type EditingTarget = { type: 'custom' | 'builtin'; id: string } | null;

export function MenuManager() {
  const {
    customRecipes,
    builtinRecipes,
    excludedBuiltinIds,
    addCustomRecipe,
    updateCustomRecipe,
    deleteCustomRecipe,
    toggleExcludeBuiltin,
    isBuiltinOverridden,
    updateBuiltinRecipe,
    resetBuiltinRecipe,
  } = useAppData();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null);
  const [name, setName] = useState('');
  const [cookMinutes, setCookMinutes] = useState('');
  const [memo, setMemo] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([emptyIngredient()]);
  const [builtinSearch, setBuiltinSearch] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formOpen) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [formOpen]);

  const nameSuggestions = useMemo(() => {
    const query = name.trim();
    if (query.length < 2) return [];
    return builtinRecipes
      .filter((r) => r.name.includes(query) || query.includes(r.name))
      .slice(0, 3);
  }, [name, builtinRecipes]);

  function applySuggestion(recipe: Recipe) {
    setIngredients(
      recipe.ingredients.length > 0
        ? recipe.ingredients.map((ing) => ({
            ...ing,
            amount1: ing.amount1 ?? ing.amount,
            amount3: ing.amount3 ?? ing.amount,
          }))
        : [emptyIngredient()],
    );
    if (!cookMinutes && recipe.cookMinutes) setCookMinutes(String(recipe.cookMinutes));
  }

  function resetForm() {
    setName('');
    setCookMinutes('');
    setMemo('');
    setIngredients([emptyIngredient()]);
    setEditingTarget(null);
  }

  function openAddForm() {
    resetForm();
    setFormOpen(true);
  }

  function openEditForm(recipe: Recipe, type: 'custom' | 'builtin') {
    setEditingTarget({ type, id: recipe.id });
    setName(recipe.name);
    setCookMinutes(recipe.cookMinutes ? String(recipe.cookMinutes) : '');
    setMemo(recipe.memo ?? '');
    setIngredients(
      recipe.ingredients.length > 0
        ? recipe.ingredients.map((ing) => ({
            ...ing,
            amount1: ing.amount1 ?? ing.amount,
            amount3: ing.amount3 ?? ing.amount,
          }))
        : [emptyIngredient()],
    );
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
    const cleanIngredients: Ingredient[] = ingredients
      .map((ing) => {
        const trimmedIngName = ing.name.trim();
        const amount1 = ing.amount1?.trim() || '';
        const amount3 = ing.amount3?.trim() || '';
        if (amount1 && amount3 && amount1 !== amount3) {
          return { name: trimmedIngName, amount: `1人分 ${amount1} / 3人分 ${amount3}`, amount1, amount3 };
        }
        const single = amount1 || amount3;
        return { name: trimmedIngName, amount: single };
      })
      .filter((ing) => ing.name.length > 0);

    if (editingTarget?.type === 'builtin') {
      updateBuiltinRecipe(editingTarget.id, {
        name: trimmedName,
        cookMinutes: cookMinutes ? Number(cookMinutes) : undefined,
        ingredients: cleanIngredients,
      });
      closeForm();
      return;
    }

    const payload = {
      name: trimmedName,
      cookMinutes: cookMinutes ? Number(cookMinutes) : undefined,
      memo: memo.trim() || undefined,
      ingredients: cleanIngredients,
    };

    if (editingTarget?.type === 'custom') {
      updateCustomRecipe(editingTarget.id, payload);
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
        <form ref={formRef} className="card recipe-form" onSubmit={handleSubmit}>
          {editingTarget?.type === 'builtin' && (
            <p className="muted small">レシピ集のメニューを編集しています。「元に戻す」でいつでも元の内容に戻せます。</p>
          )}
          <label className="field">
            <span>メニュー名</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例: 肉じゃが" required />
          </label>

          {!editingTarget && nameSuggestions.length > 0 && (
            <div className="suggestion-box">
              <p className="muted small">似ているレシピ集の材料を使う:</p>
              <div className="suggestion-chips">
                {nameSuggestions.map((r) => (
                  <button type="button" key={r.id} className="suggestion-chip" onClick={() => applySuggestion(r)}>
                    {r.name}({r.ingredients.length}品目)
                  </button>
                ))}
              </div>
            </div>
          )}

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
            <p className="muted small">分量は1人分・3人分どちらかだけの入力でもOKです。</p>
            {ingredients.map((ing, idx) => (
              <div key={idx} className="ingredient-group">
                <div className="ingredient-row">
                  <input
                    placeholder="材料名"
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                  />
                  <button type="button" className="icon-btn" onClick={() => removeIngredientRow(idx)} aria-label="削除">
                    ✕
                  </button>
                </div>
                <div className="ingredient-amounts-row">
                  <input
                    placeholder="1人分の分量"
                    value={ing.amount1 ?? ''}
                    onChange={(e) => updateIngredient(idx, 'amount1', e.target.value)}
                  />
                  <input
                    placeholder="3人分の分量"
                    value={ing.amount3 ?? ''}
                    onChange={(e) => updateIngredient(idx, 'amount3', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-small" onClick={addIngredientRow}>
              + 材料を追加
            </button>
          </div>

          {editingTarget?.type !== 'builtin' && (
            <label className="field">
              <span>メモ(任意)</span>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} rows={2} />
            </label>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              {editingTarget ? '更新する' : '登録する'}
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
              <button className="btn btn-small" onClick={() => openEditForm(r, 'custom')}>編集</button>
              <button className="btn btn-small btn-danger-outline" onClick={() => deleteCustomRecipe(r.id)}>削除</button>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h2>簡単レシピ集(自動作成で使用)</h2>
      </div>
      <p className="muted small">
        チェックを外すと、そのメニューは献立の自動作成で使われなくなります。「編集」で材料を直接書き換えることもできます。
      </p>
      <input
        className="builtin-search"
        value={builtinSearch}
        onChange={(e) => setBuiltinSearch(e.target.value)}
        placeholder="メニュー名で検索"
      />
      <div className="builtin-list">
        {builtinRecipes
          .filter((r) => r.name.includes(builtinSearch.trim()))
          .map((r) => {
          const included = !excludedBuiltinIds.includes(r.id);
          const overridden = isBuiltinOverridden(r.id);
          return (
            <div key={r.id} className="builtin-item">
              <label className="builtin-checkbox-label">
                <input type="checkbox" checked={included} onChange={() => toggleExcludeBuiltin(r.id)} />
                <span className="builtin-name">{r.name}</span>
              </label>
              <span className="muted small">{r.cookMinutes}分</span>
              <button type="button" className="btn btn-small" onClick={() => openEditForm(r, 'builtin')}>
                編集
              </button>
              {overridden && (
                <button type="button" className="btn btn-small btn-danger-outline" onClick={() => resetBuiltinRecipe(r.id)}>
                  元に戻す
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
