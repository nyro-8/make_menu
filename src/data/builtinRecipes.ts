import type { Recipe } from '../types';

// 時短・材料が手に入りやすい定番の簡単レシピ集。
// 自分で登録したメニューだけでは埋まらない日を自動で補うために使う。
export const builtinRecipes: Recipe[] = [
  { id: 'b-01', name: '豚肉の生姜焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '200g' }, { name: '玉ねぎ', amount: '1/2個' },
    { name: 'しょうが(チューブ可)', amount: '小さじ1' }, { name: 'キャベツ(付け合わせ)', amount: '適量' },
  ] },
  { id: 'b-02', name: '肉じゃが', cookMinutes: 30, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '150g' }, { name: 'じゃがいも', amount: '3個' },
    { name: '玉ねぎ', amount: '1個' }, { name: 'にんじん', amount: '1/2本' },
  ] },
  { id: 'b-03', name: '鶏の照り焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏もも肉', amount: '1枚' }, { name: 'しょうゆ', amount: '大さじ2' }, { name: 'みりん', amount: '大さじ2' },
  ] },
  { id: 'b-04', name: '麻婆豆腐', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豆腐', amount: '1丁' }, { name: '豚ひき肉', amount: '100g' }, { name: '長ねぎ', amount: '1/2本' },
    { name: '麻婆豆腐の素', amount: '1袋' },
  ] },
  { id: 'b-05', name: '野菜炒め', cookMinutes: 10, isCustom: false, ingredients: [
    { name: 'キャベツ', amount: '1/4個' }, { name: 'もやし', amount: '1袋' }, { name: '豚こま切れ肉', amount: '100g' },
  ] },
  { id: 'b-06', name: 'カレーライス', cookMinutes: 35, isCustom: false, ingredients: [
    { name: '豚肉または鶏肉', amount: '200g' }, { name: 'じゃがいも', amount: '2個' },
    { name: '玉ねぎ', amount: '1個' }, { name: 'にんじん', amount: '1/2本' }, { name: 'カレールー', amount: '1/2箱' },
  ] },
  { id: 'b-07', name: '鮭の塩焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '生鮭切り身', amount: '2切れ' }, { name: '塩', amount: '少々' }, { name: '大根おろし', amount: '適量' },
  ] },
  { id: 'b-08', name: 'オムライス', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '卵', amount: '3個' }, { name: 'ご飯', amount: '2膳分' }, { name: '鶏むね肉', amount: '100g' },
    { name: 'ケチャップ', amount: '大さじ3' },
  ] },
  { id: 'b-09', name: '親子丼', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏もも肉', amount: '1枚' }, { name: '卵', amount: '2個' }, { name: '玉ねぎ', amount: '1/2個' }, { name: 'ご飯', amount: '2膳分' },
  ] },
  { id: 'b-10', name: '焼きそば', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '焼きそば麺', amount: '2玉' }, { name: 'キャベツ', amount: '1/4個' }, { name: '豚こま切れ肉', amount: '100g' },
    { name: '焼きそばソース', amount: '1袋' },
  ] },
  { id: 'b-11', name: 'ハンバーグ', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '合いびき肉', amount: '250g' }, { name: '玉ねぎ', amount: '1/2個' }, { name: 'パン粉', amount: '大さじ3' }, { name: '卵', amount: '1個' },
  ] },
  { id: 'b-12', name: '餃子', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '豚ひき肉', amount: '200g' }, { name: 'キャベツ', amount: '1/4個' }, { name: 'にら', amount: '1束' }, { name: '餃子の皮', amount: '1袋' },
  ] },
  { id: 'b-13', name: '豚汁', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '100g' }, { name: '大根', amount: '1/4本' }, { name: 'にんじん', amount: '1/2本' }, { name: '味噌', amount: '大さじ3' },
  ] },
  { id: 'b-14', name: 'さばの味噌煮', cookMinutes: 20, isCustom: false, ingredients: [
    { name: 'さば切り身', amount: '2切れ' }, { name: '味噌', amount: '大さじ2' }, { name: 'しょうが', amount: '1かけ' },
  ] },
  { id: 'b-15', name: 'エビチリ', cookMinutes: 20, isCustom: false, ingredients: [
    { name: 'えび', amount: '200g' }, { name: 'ケチャップ', amount: '大さじ3' }, { name: '豆板醤', amount: '小さじ1' },
  ] },
  { id: 'b-16', name: 'チンジャオロース', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '牛または豚細切れ肉', amount: '150g' }, { name: 'ピーマン', amount: '4個' }, { name: 'たけのこ水煮', amount: '1袋' },
  ] },
  { id: 'b-17', name: '天かす玉子とじうどん', cookMinutes: 10, isCustom: false, ingredients: [
    { name: 'うどん(冷凍・乾麺可)', amount: '2玉' }, { name: '卵', amount: '2個' }, { name: '天かす', amount: '適量' }, { name: 'めんつゆ', amount: '適量' },
  ] },
  { id: 'b-18', name: 'キーマカレー', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '合いびき肉', amount: '200g' }, { name: '玉ねぎ', amount: '1個' }, { name: 'カレー粉', amount: '大さじ2' }, { name: 'ご飯', amount: '2膳分' },
  ] },
  { id: 'b-19', name: '鶏むね肉のチキンソテー', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏むね肉', amount: '1枚' }, { name: '塩こしょう', amount: '少々' }, { name: 'にんにく', amount: '1かけ' },
  ] },
  { id: 'b-20', name: 'ぶり大根', cookMinutes: 30, isCustom: false, ingredients: [
    { name: 'ぶり切り身', amount: '2切れ' }, { name: '大根', amount: '1/2本' }, { name: 'しょうゆ', amount: '大さじ3' }, { name: 'みりん', amount: '大さじ3' },
  ] },
  { id: 'b-21', name: '回鍋肉', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚バラ肉', amount: '150g' }, { name: 'キャベツ', amount: '1/4個' }, { name: '味噌', amount: '大さじ1' }, { name: '豆板醤', amount: '小さじ1' },
  ] },
  { id: 'b-22', name: '豆腐と卵のスープ煮込み', cookMinutes: 10, isCustom: false, ingredients: [
    { name: '豆腐', amount: '1丁' }, { name: '卵', amount: '2個' }, { name: '鶏がらスープの素', amount: '大さじ1' },
  ] },
  { id: 'b-23', name: 'ロールキャベツ', cookMinutes: 35, isCustom: false, ingredients: [
    { name: 'キャベツ', amount: '6枚' }, { name: '合いびき肉', amount: '200g' }, { name: 'コンソメ', amount: '2個' },
  ] },
  { id: 'b-24', name: '鶏むね肉と野菜のポン酢炒め', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '鶏むね肉', amount: '1枚' }, { name: 'ピーマン', amount: '2個' }, { name: 'ポン酢', amount: '大さじ3' },
  ] },
  { id: 'b-25', name: 'たらのホイル焼き', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '生たら切り身', amount: '2切れ' }, { name: 'きのこ類', amount: '1袋' }, { name: 'バター', amount: '10g' },
  ] },
  { id: 'b-26', name: '牛丼', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '牛こま切れ肉', amount: '200g' }, { name: '玉ねぎ', amount: '1個' }, { name: 'しょうゆ', amount: '大さじ3' }, { name: 'ご飯', amount: '2膳分' },
  ] },
  { id: 'b-27', name: '八宝菜', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '100g' }, { name: 'えび', amount: '100g' }, { name: '白菜', amount: '1/4個' }, { name: '中華あんの素', amount: '1袋' },
  ] },
  { id: 'b-28', name: 'ナポリタン', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'パスタ', amount: '200g' }, { name: 'ウインナー', amount: '4本' }, { name: 'ピーマン', amount: '1個' }, { name: 'ケチャップ', amount: '大さじ4' },
  ] },
  { id: 'b-29', name: '厚揚げと野菜の煮物', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '厚揚げ', amount: '2枚' }, { name: '大根', amount: '1/4本' }, { name: 'しょうゆ', amount: '大さじ2' }, { name: 'みりん', amount: '大さじ2' },
  ] },
  { id: 'b-30', name: '中華丼', cookMinutes: 15, isCustom: false, ingredients: [
    { name: '豚こま切れ肉', amount: '100g' }, { name: '白菜', amount: '1/4個' }, { name: 'うずら卵水煮', amount: '6個' }, { name: 'ご飯', amount: '2膳分' },
  ] },
  { id: 'b-31', name: 'アジの塩焼き', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'アジ', amount: '2尾' }, { name: '塩', amount: '少々' }, { name: '大根おろし', amount: '適量' },
  ] },
  { id: 'b-32', name: 'カルボナーラ風パスタ', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'パスタ', amount: '200g' }, { name: 'ベーコン', amount: '80g' }, { name: '卵', amount: '2個' }, { name: '粉チーズ', amount: '大さじ3' },
  ] },
  { id: 'b-33', name: '鶏の唐揚げ', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '鶏もも肉', amount: '1枚' }, { name: '片栗粉', amount: '大さじ4' }, { name: 'しょうゆ', amount: '大さじ2' }, { name: 'しょうが', amount: '1かけ' },
  ] },
  { id: 'b-34', name: '豆腐ハンバーグ', cookMinutes: 20, isCustom: false, ingredients: [
    { name: '豆腐', amount: '1丁' }, { name: '鶏ひき肉', amount: '150g' }, { name: '玉ねぎ', amount: '1/2個' },
  ] },
  { id: 'b-35', name: 'きのこの和風パスタ', cookMinutes: 15, isCustom: false, ingredients: [
    { name: 'パスタ', amount: '200g' }, { name: 'きのこ類', amount: '1袋' }, { name: 'めんつゆ', amount: '大さじ3' }, { name: 'バター', amount: '10g' },
  ] },
  { id: 'b-36', name: '手羽先の甘辛煮', cookMinutes: 25, isCustom: false, ingredients: [
    { name: '鶏手羽先', amount: '8本' }, { name: 'しょうゆ', amount: '大さじ3' }, { name: '砂糖', amount: '大さじ2' },
  ] },
];
