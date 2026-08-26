import { useState } from 'react';
import './App.css';
import { AppDataProvider } from './store/AppDataContext';
import { CalendarView } from './components/CalendarView';
import { MenuManager } from './components/MenuManager';
import { PantryManager } from './components/PantryManager';
import { ShoppingList } from './components/ShoppingList';
import { CalendarIcon, BookIcon, JarIcon, CartIcon, BunnyMascot } from './components/icons';

type Tab = 'calendar' | 'menus' | 'pantry' | 'shopping';

const TABS: { id: Tab; label: string; Icon: (props: { className?: string }) => React.JSX.Element }[] = [
  { id: 'calendar', label: 'カレンダー', Icon: CalendarIcon },
  { id: 'menus', label: 'メニュー', Icon: BookIcon },
  { id: 'pantry', label: '調味料', Icon: JarIcon },
  { id: 'shopping', label: '買い物', Icon: CartIcon },
];

function AppShell() {
  const [tab, setTab] = useState<Tab>('calendar');
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  return (
    <div className="app-shell">
      <header className="app-header">
        <BunnyMascot className="header-mascot" />
        <h1>献立プランナー</h1>
      </header>

      <main className="app-main">
        {tab === 'calendar' && (
          <CalendarView
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            onGoToShoppingList={() => setTab('shopping')}
          />
        )}
        {tab === 'menus' && <MenuManager />}
        {tab === 'pantry' && <PantryManager />}
        {tab === 'shopping' && (
          <ShoppingList
            selectedDates={selectedDates}
            onGoToCalendar={() => setTab('calendar')}
            onAllChecked={() => setSelectedDates(new Set())}
          />
        )}
      </main>

      <nav className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <t.Icon className="tab-icon" />
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function App() {
  return (
    <AppDataProvider>
      <AppShell />
    </AppDataProvider>
  );
}

export default App;
