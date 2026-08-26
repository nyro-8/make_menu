import type { Recipe } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 指定した日付リストに対して献立を自動生成する。
 * シャッフルした候補プールを使い切りながら順に割り当て、
 * 前日と同じメニューが連続しないように隣接部分を入れ替えて調整する。
 */
export function generateMealPlan(
  pool: Recipe[],
  dates: string[],
  anchorPrevId: string | null = null,
): Record<string, string> {
  const result: Record<string, string> = {};
  if (pool.length === 0) return result;

  let bag: string[] = [];
  let prevId: string | null = anchorPrevId;

  for (const date of dates) {
    if (bag.length === 0) {
      bag = shuffle(pool.map((r) => r.id));
      if (pool.length > 1 && bag[0] === prevId) {
        const idx = 1 + Math.floor(Math.random() * (bag.length - 1));
        [bag[0], bag[idx]] = [bag[idx], bag[0]];
      }
    }

    let next = bag.shift() as string;

    if (next === prevId && pool.length > 1) {
      const swapIdx = bag.findIndex((id) => id !== prevId);
      if (swapIdx >= 0) {
        const swapped = bag[swapIdx];
        bag[swapIdx] = next;
        next = swapped;
      } else {
        const alternatives = pool.filter((r) => r.id !== prevId);
        if (alternatives.length > 0) {
          next = alternatives[Math.floor(Math.random() * alternatives.length)].id;
        }
      }
    }

    result[date] = next;
    prevId = next;
  }

  return result;
}

/**
 * 既に決まっている日は変更せず、未定(null)の日だけを埋める。
 * 前後にある既存のメニュー(既に決まっている日・未定の場合は生成済みの前日)
 * と同じにならないよう考慮する。
 */
export function fillEmptySlots(
  pool: Recipe[],
  sequence: (string | null)[],
  anchorPrevId: string | null = null,
): (string | null)[] {
  const result = [...sequence];
  if (pool.length === 0) return result;

  let bag: string[] = [];
  let prevId: string | null = anchorPrevId;

  for (let i = 0; i < result.length; i++) {
    if (result[i] !== null) {
      prevId = result[i];
      continue;
    }

    if (bag.length === 0) {
      bag = shuffle(pool.map((r) => r.id));
      if (pool.length > 1 && bag[0] === prevId) {
        const idx = 1 + Math.floor(Math.random() * (bag.length - 1));
        [bag[0], bag[idx]] = [bag[idx], bag[0]];
      }
    }

    let next = bag.shift() as string;

    if (next === prevId && pool.length > 1) {
      const swapIdx = bag.findIndex((id) => id !== prevId);
      if (swapIdx >= 0) {
        const swapped = bag[swapIdx];
        bag[swapIdx] = next;
        next = swapped;
      } else {
        const alternatives = pool.filter((r) => r.id !== prevId);
        if (alternatives.length > 0) {
          next = alternatives[Math.floor(Math.random() * alternatives.length)].id;
        }
      }
    }

    const nextKept = result[i + 1] ?? null;
    if (nextKept && next === nextKept && pool.length > 1) {
      const altIdx = bag.findIndex((id) => id !== nextKept && id !== prevId);
      if (altIdx >= 0) {
        const swapped = bag[altIdx];
        bag[altIdx] = next;
        next = swapped;
      } else {
        const alternatives = pool.filter((r) => r.id !== nextKept && r.id !== prevId);
        if (alternatives.length > 0) {
          next = alternatives[Math.floor(Math.random() * alternatives.length)].id;
        }
      }
    }

    result[i] = next;
    prevId = next;
  }

  return result;
}

/**
 * 1日分のメニューを変更するための候補を選ぶ。
 * 前日・翌日と重複しないメニューを優先し、それが無理なら現在のメニュー以外から選ぶ。
 */
export function pickReplacement(
  pool: Recipe[],
  prevId: string | null,
  nextId: string | null,
  currentId: string | null = null,
): string | null {
  if (pool.length === 0) return null;

  let candidates = pool.filter((r) => r.id !== prevId && r.id !== nextId);
  if (candidates.length === 0) {
    candidates = pool.filter((r) => r.id !== currentId);
  }
  if (candidates.length === 0) {
    candidates = pool;
  }
  return candidates[Math.floor(Math.random() * candidates.length)].id;
}
