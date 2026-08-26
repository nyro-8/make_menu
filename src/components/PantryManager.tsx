import { useState } from 'react';
import { useAppData } from '../store/AppDataContext';

export function PantryManager() {
  const { pantry, addPantryItem, togglePantryOut, deletePantryItem } = useAppData();
  const [newName, setNewName] = useState('');

  const outCount = pantry.filter((p) => p.isOut).length;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    addPantryItem(newName);
    setNewName('');
  }

  return (
    <div className="screen">
      <div className="section-header">
        <h2>調味料・常備品</h2>
      </div>
      <p className="muted small">
        「切れた」にチェックすると、買い物リストに自動で追加されます。{outCount > 0 && ` (現在 ${outCount}件 切れています)`}
      </p>

      <form className="add-inline-form" onSubmit={handleAdd}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="調味料・常備品を追加(例: ごま油)"
        />
        <button type="submit" className="btn btn-primary btn-small">追加</button>
      </form>

      <div className="pantry-list">
        {pantry.map((item) => (
          <div key={item.id} className={`pantry-item ${item.isOut ? 'out' : ''}`}>
            <label className="pantry-checkbox">
              <input type="checkbox" checked={item.isOut} onChange={() => togglePantryOut(item.id)} />
              <span>{item.name}</span>
            </label>
            {item.isOut && <span className="badge badge-warn">切れてます</span>}
            <button className="icon-btn" onClick={() => deletePantryItem(item.id)} aria-label="削除">✕</button>
          </div>
        ))}
        {pantry.length === 0 && <p className="muted">登録されている調味料がありません。</p>}
      </div>
    </div>
  );
}
