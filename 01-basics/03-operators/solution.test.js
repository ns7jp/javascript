const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isStrictlyEqual, coerceToNumber } = require('./solution');

// --- isStrictlyEqual のテスト ---

test('isStrictlyEqual: 型も値も同じ数値同士はtrue', () => {
  assert.equal(isStrictlyEqual(1, 1), true);
});

test('isStrictlyEqual: 値は同じでも型が違う場合はfalse(数値と文字列)', () => {
  // === では型変換をしないため、1 と "1" は不一致になる
  assert.equal(isStrictlyEqual(1, '1'), false);
});

test('isStrictlyEqual: nullとundefinedは型が異なるのでfalse', () => {
  assert.equal(isStrictlyEqual(null, undefined), false);
});

test('isStrictlyEqual: 同じ文字列同士はtrue', () => {
  assert.equal(isStrictlyEqual('hello', 'hello'), true);
});

// --- coerceToNumber のテスト ---

test('coerceToNumber: 数値に変換できる文字列は数値を返す', () => {
  assert.equal(coerceToNumber('42'), 42);
  assert.equal(coerceToNumber('3.14'), 3.14);
});

test('coerceToNumber: 変換できない文字列はNaNではなくnullを返す', () => {
  const result = coerceToNumber('abc');
  assert.equal(result, null);
  // NaNのまま返していないことを明示的に確認する
  assert.notEqual(Number.isNaN(result), true);
});

test('coerceToNumber: 空文字列は0に変換される(Number("")の仕様)', () => {
  assert.equal(coerceToNumber(''), 0);
});

test('coerceToNumber: undefinedはnullを返す', () => {
  assert.equal(coerceToNumber(undefined), null);
});

test('coerceToNumber: すでに数値の場合はそのまま返す', () => {
  assert.equal(coerceToNumber(100), 100);
});
