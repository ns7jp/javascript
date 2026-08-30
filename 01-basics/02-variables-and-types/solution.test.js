const { test } = require('node:test');
const assert = require('node:assert/strict');
const { describeType, sumSafely } = require('./solution');

test('describeType: 数値を渡すとnumber型と判定する', () => {
  assert.equal(describeType(25), 'これはnumber型です');
});

test('describeType: 文字列を渡すとstring型と判定する', () => {
  assert.equal(describeType('こんにちは'), 'これはstring型です');
});

test('describeType: 真偽値を渡すとboolean型と判定する', () => {
  assert.equal(describeType(true), 'これはboolean型です');
});

test('describeType: undefinedを渡すとundefined型と判定する（境界値）', () => {
  assert.equal(describeType(undefined), 'これはundefined型です');
});

test('describeType: nullを渡すとobject型と判定する（typeofの仕様上のクセ）', () => {
  // typeof null は歴史的な経緯により "object" になる、というJavaScript特有の仕様
  assert.equal(describeType(null), 'これはobject型です');
});

test('sumSafely: 数値同士なら正しく足し算できる', () => {
  assert.equal(sumSafely(2, 3), 5);
});

test('sumSafely: 負の数や0を含んでも正しく計算できる（境界値）', () => {
  assert.equal(sumSafely(-5, 0), -5);
});

test('sumSafely: 片方が文字列の場合はエラーをthrowする（異常系）', () => {
  assert.throws(() => sumSafely('2', 3), Error);
});

test('sumSafely: 両方が数値でない場合もエラーをthrowする（異常系）', () => {
  assert.throws(() => sumSafely('2', '3'), /数値/);
});
