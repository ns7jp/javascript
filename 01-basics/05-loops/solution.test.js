const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sumUpTo, collectEvenNumbers } = require('./solution');

// --- sumUpTo のテスト ---

test('sumUpTo: 1からnまでの合計を正しく計算する', () => {
  assert.equal(sumUpTo(5), 15);
  assert.equal(sumUpTo(10), 55);
});

test('sumUpTo: n=1のときは1を返す(境界値)', () => {
  assert.equal(sumUpTo(1), 1);
});

test('sumUpTo: nが0以下の場合は0を返す', () => {
  assert.equal(sumUpTo(0), 0);
  assert.equal(sumUpTo(-3), 0);
});

// --- collectEvenNumbers のテスト ---

test('collectEvenNumbers: 偶数だけを並び順を保ったまま取り出す', () => {
  assert.deepEqual(collectEvenNumbers([1, 2, 3, 4, 5, 6]), [2, 4, 6]);
});

test('collectEvenNumbers: 空配列を渡すと空配列を返す', () => {
  assert.deepEqual(collectEvenNumbers([]), []);
});

test('collectEvenNumbers: 偶数が1つもない場合は空配列を返す', () => {
  assert.deepEqual(collectEvenNumbers([1, 3, 5]), []);
});

test('collectEvenNumbers: 負の偶数も正しく取り出せる', () => {
  assert.deepEqual(collectEvenNumbers([-4, -3, -2, -1, 0]), [-4, -2, 0]);
});
