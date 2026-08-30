const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Animal, Dog, Temperature } = require('./solution');

// --- Animal のテスト ---

test('Animal: nameを保持し、speak()で紹介文を返す', () => {
  const animal = new Animal('モモ');
  assert.equal(animal.name, 'モモ');
  assert.equal(animal.speak(), 'モモが鳴きます');
});

test('Animal: 異なる名前でも正しく反映される', () => {
  const animal = new Animal('ポチ');
  assert.equal(animal.speak(), 'ポチが鳴きます');
});

test('Animal: newを付けずに呼び出すとエラーになる', () => {
  assert.throws(() => Animal('モモ'), TypeError);
});

// --- Dog のテスト ---

test('Dog: Animalを継承している(instanceof)', () => {
  const dog = new Dog('ポチ', '柴犬');
  assert.ok(dog instanceof Dog);
  assert.ok(dog instanceof Animal);
});

test('Dog: nameとbreedの両方を保持する', () => {
  const dog = new Dog('ポチ', '柴犬');
  assert.equal(dog.name, 'ポチ');
  assert.equal(dog.breed, '柴犬');
});

test('Dog: speak()はAnimalのものをオーバーライドしている', () => {
  const dog = new Dog('ポチ', '柴犬');
  assert.equal(dog.speak(), 'ポチ: ワン!');
});

test('Dog: 別の名前・犬種でも正しく反映される', () => {
  const dog = new Dog('ハチ', '秋田犬');
  assert.equal(dog.speak(), 'ハチ: ワン!');
});

test('Dog: describe()はsuper.speak()の結果(親クラス本来の鳴き声)を含む', () => {
  const dog = new Dog('ポチ', '柴犬');
  assert.equal(dog.describe(), '柴犬種のポチです。もとの鳴き声は「ポチが鳴きます」');
});

// --- Temperature のテスト ---

test('Temperature: 摂氏0度は華氏32度になる', () => {
  const t = new Temperature(0);
  assert.equal(t.fahrenheit, 32);
});

test('Temperature: 摂氏100度は華氏212度になる', () => {
  const t = new Temperature(100);
  assert.equal(t.fahrenheit, 212);
});

test('Temperature: fahrenheitに代入するとcelsiusが更新される', () => {
  const t = new Temperature(0);
  t.fahrenheit = 32;
  assert.equal(t.celsius, 0);
});

test('Temperature: 華氏212度を設定すると摂氏100度になる', () => {
  const t = new Temperature(0);
  t.fahrenheit = 212;
  assert.equal(t.celsius, 100);
});

test('Temperature: 摂氏と華氏が一致する-40度でも正しく変換できる', () => {
  const t = new Temperature(-40);
  assert.equal(t.fahrenheit, -40);

  t.fahrenheit = -40;
  assert.equal(t.celsius, -40);
});
