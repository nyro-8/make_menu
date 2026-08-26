// 既存の分量(おおむね2人分想定)から1人分・3人分の分量を自動算出し、
// builtinRecipes.ts の各材料に amount1 / amount3 を追加する一括生成スクリプト。
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = new URL('../src/data/builtinRecipes.ts', import.meta.url);
const src = readFileSync(FILE, 'utf8');

const NONSCALABLE = ['適量', '少々', 'お好みで', '適宜'];

function parseFraction(s) {
  if (s.includes('/')) {
    const [a, b] = s.split('/').map(Number);
    return a / b;
  }
  return parseFloat(s);
}

function formatNum(n) {
  n = Math.round(n * 1000) / 1000;
  if (Number.isInteger(n)) return String(n);
  if (Math.abs(n - 0.5) < 0.01) return '1/2';
  if (Math.abs(n - 0.25) < 0.01) return '1/4';
  if (Math.abs(n - 0.75) < 0.01) return '3/4';
  if (Math.abs(n - 1 / 3) < 0.01) return '1/3';
  return String(n);
}

function roundHalf(n) {
  return Math.round(n * 2) / 2;
}

function round5(n) {
  return Math.max(5, Math.round(n / 5) * 5);
}

function deriveServings(amount) {
  if (NONSCALABLE.some((p) => amount.includes(p))) {
    return null;
  }

  let m = amount.match(/^(大さじ|小さじ)([\d.\/]+)(.*)$/);
  if (m) {
    const [, spoon, numStr, rest] = m;
    const num = parseFraction(numStr);
    let v1 = roundHalf(num / 2);
    if (v1 <= 0) v1 = num;
    const v3 = roundHalf(num * 1.5);
    return { amount1: `${spoon}${formatNum(v1)}${rest}`, amount3: `${spoon}${formatNum(v3)}${rest}` };
  }

  m = amount.match(/^([\d.\/]+)(.*)$/);
  if (m) {
    const [, numStr, rest] = m;
    const num = parseFraction(numStr);
    const restTrim = rest.trim();
    const isWeight = /^(g|ml|kg)/.test(restTrim);
    let v1, v3;
    if (isWeight) {
      v1 = round5(num / 2);
      v3 = round5(num * 1.5);
    } else {
      v1 = roundHalf(num / 2);
      if (v1 <= 0) v1 = num;
      v3 = roundHalf(num * 1.5);
    }
    return { amount1: `${formatNum(v1)}${rest}`, amount3: `${formatNum(v3)}${rest}` };
  }

  return null;
}

let count = 0;
const result = src.replace(/\{ name: '([^']+)', amount: '([^']+)' \}/g, (whole, name, amount) => {
  const servings = deriveServings(amount);
  if (!servings) return whole;
  count++;
  const combined = `1人分 ${servings.amount1} / 3人分 ${servings.amount3}`;
  return `{ name: '${name}', amount: '${combined}', amount1: '${servings.amount1}', amount3: '${servings.amount3}' }`;
});

writeFileSync(FILE, result);
console.log(`updated ${count} ingredient entries`);
