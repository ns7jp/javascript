const { test } = require('node:test');
const assert = require('node:assert/strict');
const { classifyScore, judgeWithSwitch } = require('./solution');

// --- classifyScore のテスト ---

test('classifyScore: 90点以上は"優"', () => {
  assert.equal(classifyScore(95), '優');
  assert.equal(classifyScore(100), '優');
});

test('classifyScore: 境界値90はちょうど"優"になる', () => {
  assert.equal(classifyScore(90), '優');
});

test('classifyScore: 70点以上90点未満は"良"', () => {
  assert.equal(classifyScore(70), '良');
  assert.equal(classifyScore(89), '良');
});

test('classifyScore: 50点以上70点未満は"可"', () => {
  assert.equal(classifyScore(50), '可');
  assert.equal(classifyScore(69), '可');
});

test('classifyScore: 50点未満は"不可"', () => {
  assert.equal(classifyScore(49), '不可');
  assert.equal(classifyScore(0), '不可');
});

// --- judgeWithSwitch のテスト ---

test('judgeWithSwitch: 0は日曜日、6は土曜日', () => {
  assert.equal(judgeWithSwitch(0), '日曜日');
  assert.equal(judgeWithSwitch(6), '土曜日');
});

test('judgeWithSwitch: 平日の番号も正しく変換される', () => {
  assert.equal(judgeWithSwitch(1), '月曜日');
  assert.equal(judgeWithSwitch(3), '水曜日');
  assert.equal(judgeWithSwitch(5), '金曜日');
});

test('judgeWithSwitch: 範囲外の数値はエラーメッセージを返す', () => {
  assert.equal(judgeWithSwitch(7), '不正な曜日番号です');
  assert.equal(judgeWithSwitch(-1), '不正な曜日番号です');
});
