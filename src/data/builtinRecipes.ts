import type { Recipe } from '../types';

// 時短・材料が手に入りやすい定番の簡単レシピ集。
// 自分で登録したメニューだけでは埋まらない日を自動で補うために使う。
export const builtinRecipes: Recipe[] = [
  { id: 'b-01', name: '豚肉の生姜焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1個', amount1: '1/2個', amount3: '1個' },
    { name: 'しょうが(チューブ可)', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' }, { name: 'キャベツ(付け合わせ)', amount: '適量' },
    { name: 'しょうゆ', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'みりん', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' },
  ] },
  { id: 'b-02', name: '肉じゃが', cookMinutes: 30, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '1人分 75g / 3人分 225g', amount1: '75g', amount3: '225g' }, { name: 'じゃがいも', amount: '1人分 1.5個 / 3人分 4.5個', amount1: '1.5個', amount3: '4.5個' },
    { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1.5個', amount1: '1/2個', amount3: '1.5個' }, { name: 'にんじん', amount: '1人分 1/2本 / 3人分 1本', amount1: '1/2本', amount3: '1本' },
    { name: 'しょうゆ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' }, { name: 'みりん', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: '砂糖', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: 'だしの素', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' },
  ] },
  { id: 'b-03', name: '鶏の照り焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏もも肉', amount: '1人分 1/2枚 / 3人分 1.5枚', amount1: '1/2枚', amount3: '1.5枚' }, { name: 'しょうゆ', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'みりん', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' },
  ] },
  { id: 'b-04', name: '麻婆豆腐', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豆腐', amount: '1人分 1/2丁 / 3人分 1.5丁', amount1: '1/2丁', amount3: '1.5丁' }, { name: '豚ひき肉', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' }, { name: '長ねぎ', amount: '1人分 1/2本 / 3人分 1本', amount1: '1/2本', amount3: '1本' },
    { name: '麻婆豆腐の素', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' },
  ] },
  { id: 'b-05', name: '野菜炒め', cookMinutes: 10, isCustom: false, ingredients: [
    { name: 'キャベツ', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: 'もやし', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' }, { name: '豚こま切れ肉', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' },
    { name: 'しょうゆ', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: '塩こしょう', amount: '少々' },
  ] },
  { id: 'b-06', name: 'カレーライス', cookMinutes: 35, isCustom: false, ingredients: [
    { name: '豚肉または鶏肉', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: 'じゃがいも', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' },
    { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1.5個', amount1: '1/2個', amount3: '1.5個' }, { name: 'にんじん', amount: '1人分 1/2本 / 3人分 1本', amount1: '1/2本', amount3: '1本' }, { name: 'カレールー', amount: '1人分 1/2箱 / 3人分 1箱', amount1: '1/2箱', amount3: '1箱' },
  ] },
  { id: 'b-07', name: '鮭の塩焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '生鮭切り身', amount: '1人分 1切れ / 3人分 3切れ', amount1: '1切れ', amount3: '3切れ' }, { name: '塩', amount: '少々' }, { name: '大根おろし', amount: '適量' },
  ] },
  { id: 'b-08', name: 'オムライス', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '卵', amount: '1人分 1.5個 / 3人分 4.5個', amount1: '1.5個', amount3: '4.5個' }, { name: 'ご飯', amount: '1人分 1膳分 / 3人分 3膳分', amount1: '1膳分', amount3: '3膳分' }, { name: '鶏むね肉', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' },
    { name: 'ケチャップ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' },
    { name: '玉ねぎ', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: '塩こしょう', amount: '少々' }, { name: 'バター', amount: '1人分 5g / 3人分 15g', amount1: '5g', amount3: '15g' },
  ] },
  { id: 'b-09', name: '親子丼', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏もも肉', amount: '1人分 1/2枚 / 3人分 1.5枚', amount1: '1/2枚', amount3: '1.5枚' }, { name: '卵', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' }, { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1個', amount1: '1/2個', amount3: '1個' }, { name: 'ご飯', amount: '1人分 1膳分 / 3人分 3膳分', amount1: '1膳分', amount3: '3膳分' },
    { name: 'めんつゆ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' },
  ] },
  { id: 'b-10', name: '焼きそば', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '焼きそば麺', amount: '1人分 1玉 / 3人分 3玉', amount1: '1玉', amount3: '3玉' }, { name: 'キャベツ', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: '豚こま切れ肉', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' },
    { name: '焼きそばソース', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' },
  ] },
  { id: 'b-11', name: 'ハンバーグ', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '合いびき肉', amount: '1人分 125g / 3人分 375g', amount1: '125g', amount3: '375g' }, { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1個', amount1: '1/2個', amount3: '1個' }, { name: 'パン粉', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' }, { name: '卵', amount: '1人分 1/2個 / 3人分 1.5個', amount1: '1/2個', amount3: '1.5個' },
    { name: '塩こしょう', amount: '少々' }, { name: '牛乳', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'ケチャップ(ソース用)', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'ウスターソース(ソース用)', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-12', name: '餃子', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '豚ひき肉', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: 'キャベツ', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: 'にら', amount: '1人分 1/2束 / 3人分 1.5束', amount1: '1/2束', amount3: '1.5束' }, { name: '餃子の皮', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' },
    { name: 'しょうゆ(タネ用)', amount: '1人分 小さじ1 / 3人分 小さじ3', amount1: '小さじ1', amount3: '小さじ3' }, { name: 'ごま油', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' }, { name: 'にんにく', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' }, { name: 'しょうが', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' },
  ] },
  { id: 'b-13', name: '豚汁', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' }, { name: '大根', amount: '1人分 1/4本 / 3人分 1/2本', amount1: '1/4本', amount3: '1/2本' }, { name: 'にんじん', amount: '1人分 1/2本 / 3人分 1本', amount1: '1/2本', amount3: '1本' }, { name: '味噌', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' },
    { name: 'だしの素', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' },
  ] },
  { id: 'b-14', name: 'さばの味噌煮', cookMinutes: 20, isCustom: false, ingredients: [
    { name: 'さば切り身', amount: '1人分 1切れ / 3人分 3切れ', amount1: '1切れ', amount3: '3切れ' }, { name: '味噌', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'しょうが', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' },
    { name: 'みりん', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: '酒', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: '砂糖', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-15', name: 'エビチリ', cookMinutes: 20, isCustom: false, ingredients: [
    { name: 'えび', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: 'ケチャップ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' }, { name: '豆板醤', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' },
    { name: '酒', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: '砂糖', amount: '1人分 小さじ1 / 3人分 小さじ3', amount1: '小さじ1', amount3: '小さじ3' }, { name: '鶏がらスープの素', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' }, { name: 'ごま油', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' }, { name: '片栗粉', amount: '1人分 小さじ1 / 3人分 小さじ3', amount1: '小さじ1', amount3: '小さじ3' },
  ] },
  { id: 'b-16', name: 'チンジャオロース', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '牛または豚細切れ肉', amount: '1人分 75g / 3人分 225g', amount1: '75g', amount3: '225g' }, { name: 'ピーマン', amount: '1人分 2個 / 3人分 6個', amount1: '2個', amount3: '6個' }, { name: 'たけのこ水煮', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' },
    { name: 'しょうゆ', amount: '1人分 大さじ1 / 3人分 大さじ2.5', amount1: '大さじ1', amount3: '大さじ2.5' }, { name: 'オイスターソース', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: '酒', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: '片栗粉', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' },
  ] },
  { id: 'b-17', name: '天かす玉子とじうどん', cookMinutes: 10, isCustom: false, ingredients: [
    { name: 'うどん(冷凍・乾麺可)', amount: '1人分 1玉 / 3人分 3玉', amount1: '1玉', amount3: '3玉' }, { name: '卵', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' }, { name: '天かす', amount: '適量' }, { name: 'めんつゆ', amount: '適量' },
  ] },
  { id: 'b-18', name: 'キーマカレー', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '合いびき肉', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1.5個', amount1: '1/2個', amount3: '1.5個' }, { name: 'カレー粉', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'ご飯', amount: '1人分 1膳分 / 3人分 3膳分', amount1: '1膳分', amount3: '3膳分' },
    { name: 'トマト缶', amount: '1人分 1/2缶 / 3人分 1缶', amount1: '1/2缶', amount3: '1缶' }, { name: 'にんにく', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' }, { name: '塩こしょう', amount: '少々' },
  ] },
  { id: 'b-19', name: '鶏むね肉のチキンソテー', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏むね肉', amount: '1人分 1/2枚 / 3人分 1.5枚', amount1: '1/2枚', amount3: '1.5枚' }, { name: '塩こしょう', amount: '少々' }, { name: 'にんにく', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' },
  ] },
  { id: 'b-20', name: 'ぶり大根', cookMinutes: 30, isCustom: false, ingredients: [
    { name: 'ぶり切り身', amount: '1人分 1切れ / 3人分 3切れ', amount1: '1切れ', amount3: '3切れ' }, { name: '大根', amount: '1人分 1/2本 / 3人分 1本', amount1: '1/2本', amount3: '1本' }, { name: 'しょうゆ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' }, { name: 'みりん', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' },
    { name: '酒', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: '砂糖', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-21', name: '回鍋肉', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚バラ肉', amount: '1人分 75g / 3人分 225g', amount1: '75g', amount3: '225g' }, { name: 'キャベツ', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: '味噌', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: '豆板醤', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' },
    { name: 'しょうゆ', amount: '1人分 小さじ1 / 3人分 小さじ3', amount1: '小さじ1', amount3: '小さじ3' }, { name: '砂糖', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' }, { name: '酒', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: 'ごま油', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' },
  ] },
  { id: 'b-22', name: '豆腐と卵のスープ煮込み', cookMinutes: 10, isCustom: false, ingredients: [
    { name: '豆腐', amount: '1人分 1/2丁 / 3人分 1.5丁', amount1: '1/2丁', amount3: '1.5丁' }, { name: '卵', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' }, { name: '鶏がらスープの素', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-23', name: 'ロールキャベツ', cookMinutes: 35, isCustom: false, ingredients: [
    { name: 'キャベツ', amount: '1人分 3枚 / 3人分 9枚', amount1: '3枚', amount3: '9枚' }, { name: '合いびき肉', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: 'コンソメ', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' },
    { name: '玉ねぎ', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: 'パン粉', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: '卵', amount: '1人分 1/2個 / 3人分 1.5個', amount1: '1/2個', amount3: '1.5個' }, { name: '塩こしょう', amount: '少々' },
  ] },
  { id: 'b-24', name: '鶏むね肉と野菜のポン酢炒め', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏むね肉', amount: '1人分 1/2枚 / 3人分 1.5枚', amount1: '1/2枚', amount3: '1.5枚' }, { name: 'ピーマン', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' }, { name: 'ポン酢', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' },
  ] },
  { id: 'b-25', name: 'たらのホイル焼き', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '生たら切り身', amount: '1人分 1切れ / 3人分 3切れ', amount1: '1切れ', amount3: '3切れ' }, { name: 'きのこ類', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' }, { name: 'バター', amount: '1人分 5g / 3人分 15g', amount1: '5g', amount3: '15g' },
    { name: '塩こしょう', amount: '少々' }, { name: '酒', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-26', name: '牛丼', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '牛こま切れ肉', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1.5個', amount1: '1/2個', amount3: '1.5個' }, { name: 'しょうゆ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' }, { name: 'ご飯', amount: '1人分 1膳分 / 3人分 3膳分', amount1: '1膳分', amount3: '3膳分' },
    { name: 'みりん', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: '酒', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: '砂糖', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-27', name: '八宝菜', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' }, { name: 'えび', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' }, { name: '白菜', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: '中華あんの素', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' },
  ] },
  { id: 'b-28', name: 'ナポリタン', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'パスタ', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: 'ウインナー', amount: '1人分 2本 / 3人分 6本', amount1: '2本', amount3: '6本' }, { name: 'ピーマン', amount: '1人分 1/2個 / 3人分 1.5個', amount1: '1/2個', amount3: '1.5個' }, { name: 'ケチャップ', amount: '1人分 大さじ2 / 3人分 大さじ6', amount1: '大さじ2', amount3: '大さじ6' },
    { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1個', amount1: '1/2個', amount3: '1個' }, { name: 'オリーブオイル', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-29', name: '厚揚げと野菜の煮物', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '厚揚げ', amount: '1人分 1枚 / 3人分 3枚', amount1: '1枚', amount3: '3枚' }, { name: '大根', amount: '1人分 1/4本 / 3人分 1/2本', amount1: '1/4本', amount3: '1/2本' }, { name: 'しょうゆ', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'みりん', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' },
    { name: 'だしの素', amount: '1人分 小さじ1/2 / 3人分 小さじ1.5', amount1: '小さじ1/2', amount3: '小さじ1.5' }, { name: '砂糖', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-30', name: '中華丼', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '1人分 50g / 3人分 150g', amount1: '50g', amount3: '150g' }, { name: '白菜', amount: '1人分 1/4個 / 3人分 1/2個', amount1: '1/4個', amount3: '1/2個' }, { name: 'うずら卵水煮', amount: '1人分 3個 / 3人分 9個', amount1: '3個', amount3: '9個' }, { name: 'ご飯', amount: '1人分 1膳分 / 3人分 3膳分', amount1: '1膳分', amount3: '3膳分' },
    { name: '中華あんの素', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' },
  ] },
  { id: 'b-31', name: 'アジの塩焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'アジ', amount: '1人分 1尾 / 3人分 3尾', amount1: '1尾', amount3: '3尾' }, { name: '塩', amount: '少々' }, { name: '大根おろし', amount: '適量' },
  ] },
  { id: 'b-32', name: 'カルボナーラ風パスタ', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'パスタ', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: 'ベーコン', amount: '1人分 40g / 3人分 120g', amount1: '40g', amount3: '120g' }, { name: '卵', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' }, { name: '粉チーズ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' },
    { name: '塩こしょう', amount: '少々' }, { name: 'にんにく', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' },
  ] },
  { id: 'b-33', name: '鶏の唐揚げ', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '鶏もも肉', amount: '1人分 1/2枚 / 3人分 1.5枚', amount1: '1/2枚', amount3: '1.5枚' }, { name: '片栗粉', amount: '1人分 大さじ2 / 3人分 大さじ6', amount1: '大さじ2', amount3: '大さじ6' }, { name: 'しょうゆ', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: 'しょうが', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' },
    { name: '酒', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: 'にんにく', amount: '1人分 1/2かけ / 3人分 1.5かけ', amount1: '1/2かけ', amount3: '1.5かけ' },
  ] },
  { id: 'b-34', name: '豆腐ハンバーグ', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '豆腐', amount: '1人分 1/2丁 / 3人分 1.5丁', amount1: '1/2丁', amount3: '1.5丁' }, { name: '鶏ひき肉', amount: '1人分 75g / 3人分 225g', amount1: '75g', amount3: '225g' }, { name: '玉ねぎ', amount: '1人分 1/2個 / 3人分 1個', amount1: '1/2個', amount3: '1個' },
    { name: 'パン粉', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' }, { name: '片栗粉', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' }, { name: '塩こしょう', amount: '少々' },
  ] },
  { id: 'b-35', name: 'きのこの和風パスタ', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'パスタ', amount: '1人分 100g / 3人分 300g', amount1: '100g', amount3: '300g' }, { name: 'きのこ類', amount: '1人分 1/2袋 / 3人分 1.5袋', amount1: '1/2袋', amount3: '1.5袋' }, { name: 'めんつゆ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' }, { name: 'バター', amount: '1人分 5g / 3人分 15g', amount1: '5g', amount3: '15g' },
  ] },
  { id: 'b-36', name: '手羽先の甘辛煮', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '鶏手羽先', amount: '1人分 4本 / 3人分 12本', amount1: '4本', amount3: '12本' }, { name: 'しょうゆ', amount: '1人分 大さじ1.5 / 3人分 大さじ4.5', amount1: '大さじ1.5', amount3: '大さじ4.5' }, { name: '砂糖', amount: '1人分 大さじ1 / 3人分 大さじ3', amount1: '大さじ1', amount3: '大さじ3' },
    { name: 'みりん', amount: '1人分 大さじ1/2 / 3人分 大さじ1.5', amount1: '大さじ1/2', amount3: '大さじ1.5' },
  ] },
  { id: 'b-37', name: 'お好み焼き', cookMinutes: 25, isCustom: false, ingredients: [
    { name: 'キャベツ', amount: '1人分 150g(約1/8玉) / 3人分 450g(約1/2玉)', amount1: '150g(約1/8玉)', amount3: '450g(約1/2玉)' },
    { name: '豚バラ薄切り肉', amount: '1人分 40g / 3人分 120g', amount1: '40g', amount3: '120g' },
    { name: '卵', amount: '1人分 1個 / 3人分 3個', amount1: '1個', amount3: '3個' },
    { name: 'お好み焼き粉', amount: '1人分 50g(大さじ4) / 3人分 200g(1袋)', amount1: '50g(大さじ4)', amount3: '200g(1袋)' },
    { name: '水', amount: '1人分 大さじ2 / 3人分 150ml', amount1: '大さじ2', amount3: '150ml' },
    { name: '長芋すりおろし(お好みで)', amount: '1人分 30g / 3人分 100g', amount1: '30g', amount3: '100g' },
    { name: 'お好み焼きソース・マヨネーズ', amount: '適量' },
    { name: '青のり・かつおぶし', amount: '適量' },
  ] },
];
