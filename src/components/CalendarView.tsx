import { useMemo, useState } from 'react';
import { useAppData } from '../store/AppDataContext';
import { getCalendarGrid, getMonthDates, isSameMonth, todayStr, WEEKDAY_LABELS } from '../logic/dateUtils';
import { DayDetailModal } from './DayDetailModal';

interface Props {
  selectedDates: Set<string>;
  setSelectedDates: (dates: Set<string>) => void;
  onGoToShoppingList: () => void;
}

export function CalendarView({ selectedDates, setSelectedDates, onGoToShoppingList }: Props) {
  const today = todayStr();
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [selectionMode, setSelectionMode] = useState(false);
  const [openDate, setOpenDate] = useState<string | null>(null);

  const { mealPlan, allRecipesById, activeRecipes, generatePlanForDates, setMealPlanDay, regenerateDay } =
    useAppData();

  const grid = useMemo(() => getCalendarGrid(year, month), [year, month]);

  function changeMonth(delta: number) {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  function toggleSelectDate(date: string) {
    const next = new Set(selectedDates);
    if (next.has(date)) next.delete(date);
    else next.add(date);
    setSelectedDates(next);
  }

  function handleDayClick(date: string) {
    if (selectionMode) {
      toggleSelectDate(date);
    } else {
      setOpenDate(date);
    }
  }

  function handleGenerateMonth() {
    const dates = getMonthDates(year, month);
    generatePlanForDates(dates);
  }

  const openRecipe = openDate ? allRecipesById.get(mealPlan[openDate] ?? '') ?? null : null;

  return (
    <div className="screen">
      <div className="calendar-toolbar">
        <button className="icon-btn" onClick={() => changeMonth(-1)} aria-label="前の月">‹</button>
        <h2>{year}年{month}月</h2>
        <button className="icon-btn" onClick={() => changeMonth(1)} aria-label="次の月">›</button>
      </div>

      <div className="calendar-actions">
        <button className="btn btn-primary" onClick={handleGenerateMonth}>
          この月の献立を自動作成
        </button>
        <button
          className={`btn ${selectionMode ? 'btn-primary' : ''}`}
          onClick={() => setSelectionMode((v) => !v)}
        >
          {selectionMode ? '選択モードを終了' : '買い物用に日を選ぶ'}
        </button>
      </div>

      {selectionMode && (
        <div className="selection-banner">
          <span>{selectedDates.size}日選択中(目安3日分)</span>
          <div className="selection-banner-actions">
            <button className="btn btn-small" onClick={() => setSelectedDates(new Set())}>
              選択解除
            </button>
            <button
              className="btn btn-primary btn-small"
              disabled={selectedDates.size === 0}
              onClick={onGoToShoppingList}
            >
              買い物リストを見る
            </button>
          </div>
        </div>
      )}

      <div className="calendar-weekdays">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={w} className={`weekday-label ${i === 5 ? 'sat' : ''} ${i === 6 ? 'sun' : ''}`}>
            {w}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {grid.map((date, i) => {
          if (!date) return <div key={i} className="calendar-cell empty" />;
          const recipeId = mealPlan[date];
          const recipe = recipeId ? allRecipesById.get(recipeId) : undefined;
          const isToday = date === today;
          const isSelected = selectedDates.has(date);
          const inMonth = isSameMonth(date, year, month);
          return (
            <button
              key={date}
              className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${inMonth ? '' : 'outside'}`}
              onClick={() => handleDayClick(date)}
            >
              <span className="cell-date">{Number(date.slice(-2))}</span>
              {recipe ? (
                <span className="cell-recipe">{recipe.name}</span>
              ) : (
                <span className="cell-recipe muted">未定</span>
              )}
              {isSelected && <span className="cell-check">✓</span>}
            </button>
          );
        })}
      </div>

      {openDate && (
        <DayDetailModal
          date={openDate}
          recipe={openRecipe}
          activeRecipes={activeRecipes}
          onClose={() => setOpenDate(null)}
          onChangeMenu={(recipeId) => setMealPlanDay(openDate, recipeId)}
          onRegenerate={() => regenerateDay(openDate)}
        />
      )}
    </div>
  );
}
