import { useMemo, useState } from 'react';
import { useAppData } from '../store/AppDataContext';
import {
  addDays,
  formatShortDate,
  getCalendarGrid,
  getDayOfWeek,
  getMonthDates,
  getWeekdayJP,
  todayStr,
  WEEKDAY_LABELS,
} from '../logic/dateUtils';
import { DayDetailModal } from './DayDetailModal';

interface Props {
  selectedDates: Set<string>;
  setSelectedDates: (dates: Set<string>) => void;
  onGoToShoppingList: () => void;
}

const WINDOW_DAYS = 14;

type ViewMode = 'list' | 'calendar';

export function CalendarView({ selectedDates, setSelectedDates, onGoToShoppingList }: Props) {
  const today = todayStr();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [listStart, setListStart] = useState(today);
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)));
  const [selectionMode, setSelectionMode] = useState(false);
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [generateConfirmOpen, setGenerateConfirmOpen] = useState(false);

  const {
    mealPlan,
    allRecipesById,
    activeRecipes,
    generatePlanForDates,
    setMealPlanDay,
    regenerateDay,
    clearShoppingChecked,
  } = useAppData();

  const listDates = useMemo(
    () => Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(listStart, i)),
    [listStart],
  );
  const gridDates = useMemo(() => getCalendarGrid(year, month), [year, month]);

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

  const generateTargetDates = viewMode === 'list' ? listDates : getMonthDates(year, month);
  const hasExistingInRange = generateTargetDates.some((d) => !!mealPlan[d]);

  function handleGenerateClick() {
    if (hasExistingInRange) {
      setGenerateConfirmOpen(true);
    } else {
      generatePlanForDates(generateTargetDates);
    }
  }

  function handleGenerate(overwrite: boolean) {
    generatePlanForDates(generateTargetDates, { overwrite });
    setGenerateConfirmOpen(false);
  }

  const openRecipe = openDate ? allRecipesById.get(mealPlan[openDate] ?? '') ?? null : null;

  return (
    <div className="screen">
      <div className="view-toggle-row">
        <div className="view-toggle">
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
            リスト
          </button>
          <button className={viewMode === 'calendar' ? 'active' : ''} onClick={() => setViewMode('calendar')}>
            カレンダー
          </button>
        </div>
        <button className="btn btn-small generate-btn" onClick={handleGenerateClick}>
          {viewMode === 'list' ? '2週間分を自動作成' : 'この月を自動作成'}
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="calendar-toolbar">
          <button className="icon-btn" onClick={() => setListStart(addDays(listStart, -WINDOW_DAYS))} aria-label="前の2週間">‹</button>
          <div className="toolbar-title-group">
            <h2>{formatShortDate(listDates[0])} 〜 {formatShortDate(listDates[WINDOW_DAYS - 1])}</h2>
            {listStart !== today && (
              <button className="btn btn-small today-btn" onClick={() => setListStart(today)}>
                今日に戻る
              </button>
            )}
          </div>
          <button className="icon-btn" onClick={() => setListStart(addDays(listStart, WINDOW_DAYS))} aria-label="次の2週間">›</button>
        </div>
      ) : (
        <div className="calendar-toolbar">
          <button className="icon-btn" onClick={() => changeMonth(-1)} aria-label="前の月">‹</button>
          <div className="toolbar-title-group">
            <h2>{year}年{month}月</h2>
            {(year !== Number(today.slice(0, 4)) || month !== Number(today.slice(5, 7))) && (
              <button
                className="btn btn-small today-btn"
                onClick={() => {
                  setYear(Number(today.slice(0, 4)));
                  setMonth(Number(today.slice(5, 7)));
                }}
              >
                今日に戻る
              </button>
            )}
          </div>
          <button className="icon-btn" onClick={() => changeMonth(1)} aria-label="次の月">›</button>
        </div>
      )}

      <div className="calendar-actions">
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
              onClick={() => {
                clearShoppingChecked();
                onGoToShoppingList();
              }}
            >
              買い物リストを見る
            </button>
          </div>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="calendar-list">
          {listDates.map((date) => {
            const recipeId = mealPlan[date];
            const recipe = recipeId ? allRecipesById.get(recipeId) : undefined;
            const isToday = date === today;
            const isSelected = selectedDates.has(date);
            const dow = getDayOfWeek(date);
            return (
              <button
                key={date}
                className={`calendar-row ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(date)}
              >
                <span className="row-date">
                  <span className={`row-weekday ${dow === 6 ? 'sat' : ''} ${dow === 0 ? 'sun' : ''}`}>
                    {getWeekdayJP(date)}
                  </span>
                  <span className="row-daynum">{Number(date.slice(-2))}</span>
                </span>
                {recipe ? (
                  <span className="row-recipe">{recipe.name}</span>
                ) : (
                  <span className="row-recipe muted">未定</span>
                )}
                {isSelected && <span className="row-check">✓</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <div className="calendar-weekdays">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={w} className={`weekday-label ${i === 5 ? 'sat' : ''} ${i === 6 ? 'sun' : ''}`}>
                {w}
              </div>
            ))}
          </div>
          <div className="calendar-grid">
            {gridDates.map((date, i) => {
              if (!date) return <div key={i} className="calendar-cell empty" />;
              const recipeId = mealPlan[date];
              const recipe = recipeId ? allRecipesById.get(recipeId) : undefined;
              const isToday = date === today;
              const isSelected = selectedDates.has(date);
              return (
                <button
                  key={date}
                  className={`calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
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
        </>
      )}

      {generateConfirmOpen && (
        <div className="modal-overlay" onClick={() => setGenerateConfirmOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>献立を自動作成</h3>
              <button className="icon-btn" onClick={() => setGenerateConfirmOpen(false)} aria-label="閉じる">✕</button>
            </div>
            <p className="day-detail-body">
              この期間にはすでに決まっている献立があります。どちらの方法で作成しますか?
            </p>
            <div className="modal-actions modal-actions-column">
              <button className="btn btn-primary" onClick={() => handleGenerate(false)}>
                未定の日だけ埋める
              </button>
              <button className="btn btn-danger-outline" onClick={() => handleGenerate(true)}>
                すべて上書きして作り直す
              </button>
              <button className="btn" onClick={() => setGenerateConfirmOpen(false)}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

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
