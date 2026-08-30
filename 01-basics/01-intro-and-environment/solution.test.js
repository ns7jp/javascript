const { test } = require('node:test');
const assert = require('node:assert/strict');
const { greet, add } = require('./solution');

test('greet: 名前を渡すとあいさつ文を返す', () => {
  assert.equal(greet('田中'), 'こんにちは、田中さん！');
});

test('greet: 別の名前でも正しく組み立てられる', () => {
  assert.equal(greet('鈴木'), 'こんにちは、鈴木さん！');
});

test('greet: 空文字を渡しても文字列としてつながる', () => {
  // 境界値: 名前が空文字の場合でもエラーにならず、
  // "こんにちは、さん！" という文字列になることを確認する
  assert.equal(greet(''), 'こんにちは、さん！');
});

test('add: 正の整数同士を足し算できる', () => {
  assert.equal(add(2, 3), 5);
});

test('add: 負の数を含む計算ができる', () => {
  assert.equal(add(-5, 10), 5);
});

test('add: 0を渡しても正しく計算できる（境界値）', () => {
  assert.equal(add(0, 0), 0);
});
