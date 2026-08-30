const { test } = require('node:test');
const assert = require('node:assert/strict');
const { multiply, sumAll, createCounter } = require('./solution');

// --- multiply のテスト ---

test('multiply: 両方の引数を渡すと掛け算した結果を返す', () => {
  assert.equal(multiply(3, 4), 12);
  assert.equal(multiply(0, 10), 0);
});

test('multiply: bを省略すると1として計算される(デフォルト引数)', () => {
  assert.equal(multiply(5), 5);
  assert.equal(multiply(-2), -2);
});

test('multiply: bにundefinedを渡した場合もデフォルト値が使われる', () => {
  assert.equal(multiply(7, undefined), 7);
});

// --- sumAll のテスト ---

test('sumAll: 複数の数値を渡すと合計を返す', () => {
  assert.equal(sumAll(1, 2, 3), 6);
  assert.equal(sumAll(1, 2, 3, 4, 5), 15);
});

test('sumAll: 引数が1つだけのときはその値を返す(境界値)', () => {
  assert.equal(sumAll(10), 10);
});

test('sumAll: 引数が1つもない場合は0を返す', () => {
  assert.equal(sumAll(), 0);
});

// --- createCounter のテスト ---

test('createCounter: 呼び出すたびに1ずつ増える', () => {
  const counter = createCounter();
  assert.equal(counter(), 1);
  assert.equal(counter(), 2);
  assert.equal(counter(), 3);
});

test('createCounter: 複数のカウンターは互いに独立している', () => {
  const counter1 = createCounter();
  const counter2 = createCounter();

  counter1();
  counter1();
  assert.equal(counter1(), 3);
  assert.equal(counter2(), 1); // counter1の影響を受けず、1から始まる
});

test('createCounter: 呼び出すたびに新しい関数(異なるクロージャ)が作られる', () => {
  const counterA = createCounter();
  const counterB = createCounter();
  assert.notEqual(counterA, counterB);
});
