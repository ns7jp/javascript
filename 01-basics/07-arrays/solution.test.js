const { test } = require('node:test');
const assert = require('node:assert/strict');
const { doubleAll, filterAdults, totalPrice, mergeUnique } = require('./solution');

// --- doubleAll のテスト ---

test('doubleAll: 各要素が2倍になった新しい配列を返す', () => {
  assert.deepEqual(doubleAll([1, 2, 3]), [2, 4, 6]);
});

test('doubleAll: 空配列を渡すと空配列を返す', () => {
  assert.deepEqual(doubleAll([]), []);
});

test('doubleAll: 負の数や0を含んでいても正しく計算される', () => {
  assert.deepEqual(doubleAll([-2, 0, 5]), [-4, 0, 10]);
});

test('doubleAll: 元の配列は変更されない(非破壊的)', () => {
  const numbers = [1, 2, 3];
  doubleAll(numbers);
  assert.deepEqual(numbers, [1, 2, 3]);
});

// --- filterAdults のテスト ---

test('filterAdults: 18歳以上の人だけを返す', () => {
  const people = [
    { name: 'A', age: 20 },
    { name: 'B', age: 10 },
    { name: 'C', age: 30 },
  ];
  assert.deepEqual(filterAdults(people), [
    { name: 'A', age: 20 },
    { name: 'C', age: 30 },
  ]);
});

test('filterAdults: 境界値18歳ちょうどは含まれる', () => {
  const people = [{ name: 'D', age: 18 }, { name: 'E', age: 17 }];
  assert.deepEqual(filterAdults(people), [{ name: 'D', age: 18 }]);
});

test('filterAdults: 該当者がいなければ空配列を返す', () => {
  const people = [{ name: 'F', age: 5 }, { name: 'G', age: 12 }];
  assert.deepEqual(filterAdults(people), []);
});

// --- totalPrice のテスト ---

test('totalPrice: 複数商品の合計金額を計算する', () => {
  assert.equal(totalPrice([{ price: 100 }, { price: 200 }, { price: 300 }]), 600);
});

test('totalPrice: 空配列の場合は0を返す', () => {
  assert.equal(totalPrice([]), 0);
});

test('totalPrice: 商品が1件のみでも正しく計算される', () => {
  assert.equal(totalPrice([{ price: 500 }]), 500);
});

// --- mergeUnique のテスト ---

test('mergeUnique: 重複する要素を取り除いて結合する', () => {
  assert.deepEqual(mergeUnique([1, 2, 3], [2, 3, 4]), [1, 2, 3, 4]);
});

test('mergeUnique: 片方が空配列でも正しく重複を除去する', () => {
  assert.deepEqual(mergeUnique([], [1, 1, 2]), [1, 2]);
});

test('mergeUnique: 重複がない場合はそのまま結合される', () => {
  assert.deepEqual(mergeUnique(['a', 'b'], ['c', 'd']), ['a', 'b', 'c', 'd']);
});
