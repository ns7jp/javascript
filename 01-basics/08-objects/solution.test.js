const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createUser, summarizeUser, mergeSettings, countProperties } = require('./solution');

// --- createUser のテスト ---

test('createUser: nameとageからユーザーオブジェクトを作成する', () => {
  assert.deepEqual(createUser('田中', 25), { name: '田中', age: 25 });
});

test('createUser: 年齢が0でも正しくオブジェクトを作れる', () => {
  assert.deepEqual(createUser('赤ちゃん', 0), { name: '赤ちゃん', age: 0 });
});

test('createUser: 異なる値の組み合わせでも正しく反映される', () => {
  assert.deepEqual(createUser('佐藤', 40), { name: '佐藤', age: 40 });
});

// --- summarizeUser のテスト ---

test('summarizeUser: name歳の紹介文を作る', () => {
  assert.equal(summarizeUser({ name: '田中', age: 25 }), '田中さん(25歳)');
});

test('summarizeUser: 別の値でも正しく文字列を組み立てる', () => {
  assert.equal(summarizeUser({ name: '鈴木', age: 5 }), '鈴木さん(5歳)');
});

test('summarizeUser: 他のプロパティが含まれていても無視して組み立てる', () => {
  const user = { name: '山田', age: 30, email: 'yamada@example.com' };
  assert.equal(summarizeUser(user), '山田さん(30歳)');
});

// --- mergeSettings のテスト ---

test('mergeSettings: overridesの値でdefaultsを上書きする', () => {
  const defaults = { timeout: 30, retry: 3 };
  const overrides = { timeout: 60 };
  assert.deepEqual(mergeSettings(defaults, overrides), { timeout: 60, retry: 3 });
});

test('mergeSettings: overridesにしかないプロパティも結果に含まれる', () => {
  const defaults = { timeout: 30 };
  const overrides = { retry: 5 };
  assert.deepEqual(mergeSettings(defaults, overrides), { timeout: 30, retry: 5 });
});

test('mergeSettings: 引数のオブジェクト自体は変更されない', () => {
  const defaults = { timeout: 30, retry: 3 };
  const overrides = { timeout: 60 };
  mergeSettings(defaults, overrides);
  assert.deepEqual(defaults, { timeout: 30, retry: 3 });
  assert.deepEqual(overrides, { timeout: 60 });
});

// --- countProperties のテスト ---

test('countProperties: プロパティの数を正しく数える', () => {
  assert.equal(countProperties({ a: 1, b: 2, c: 3 }), 3);
});

test('countProperties: 空オブジェクトは0を返す', () => {
  assert.equal(countProperties({}), 0);
});

test('countProperties: プロパティが1つの場合も正しく数える', () => {
  assert.equal(countProperties({ onlyOne: 'value' }), 1);
});
