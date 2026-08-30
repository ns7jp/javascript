const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ValidationError, safeDivide, parseAndDivide } = require('./solution');

// --- ValidationError のテスト ---

test('ValidationError: messageとnameが正しく設定される', () => {
  const error = new ValidationError('テストメッセージ');
  assert.equal(error.message, 'テストメッセージ');
  assert.equal(error.name, 'ValidationError');
});

test('ValidationError: Errorのインスタンスでもある(継承が正しい)', () => {
  const error = new ValidationError('テスト');
  assert.ok(error instanceof Error);
  assert.ok(error instanceof ValidationError);
});

test('ValidationError: throwして通常のErrorと同じようにcatchできる', () => {
  assert.throws(
    () => {
      throw new ValidationError('例外テスト');
    },
    (error) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, '例外テスト');
      return true;
    },
  );
});

// --- safeDivide のテスト ---

test('safeDivide: 正しく割り算した結果を返す', () => {
  assert.equal(safeDivide(10, 2), 5);
});

test('safeDivide: 負の数やマイナスの結果になる場合も正しく計算する', () => {
  assert.equal(safeDivide(-9, 3), -3);
});

test('safeDivide: 割り切れない場合も正しく計算する', () => {
  assert.equal(safeDivide(7, 2), 3.5);
});

test('safeDivide: 0で割るとValidationErrorがthrowされる', () => {
  assert.throws(
    () => safeDivide(5, 0),
    (error) => {
      assert.ok(error instanceof ValidationError);
      assert.equal(error.message, '0で割ることはできません。');
      return true;
    },
  );
});

// --- parseAndDivide のテスト ---

test('parseAndDivide: 正常な文字列を計算結果の文字列として返す', () => {
  assert.equal(parseAndDivide('10', '2'), '計算結果: 5');
});

test('parseAndDivide: 0で割ろうとするとエラーメッセージの文字列を返す(throwしない)', () => {
  assert.equal(parseAndDivide('10', '0'), 'エラー: 0で割ることはできません。');
});

test('parseAndDivide: 数値として解釈できない文字列はエラーメッセージを返す', () => {
  assert.equal(
    parseAndDivide('abc', '2'),
    'エラー: "abc" または "2" は数値として解釈できません。',
  );
});

test('parseAndDivide: 空文字列はNumber("")の挙動によって0として扱われる', () => {
  // Number("") は NaN ではなく 0 になる、というJavaScript特有の挙動を確認するテスト。
  assert.equal(parseAndDivide('', '5'), '計算結果: 0');
});

test('parseAndDivide: 成功時でもfinallyブロックのログが必ず出力される', () => {
  const originalLog = console.log;
  const logs = [];
  console.log = (message) => logs.push(message);

  try {
    parseAndDivide('20', '4');
  } finally {
    console.log = originalLog;
  }

  assert.ok(logs.includes('parseAndDivideの処理を終了しました。'));
});

test('parseAndDivide: エラー時でもfinallyブロックのログが必ず出力される', () => {
  const originalLog = console.log;
  const logs = [];
  console.log = (message) => logs.push(message);

  try {
    parseAndDivide('10', '0');
  } finally {
    console.log = originalLog;
  }

  assert.ok(logs.includes('parseAndDivideの処理を終了しました。'));
});
