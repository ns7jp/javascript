const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  formatGreeting,
  parseCsvLine,
  joinWithComma,
  emphasizeAlert,
  maskSensitiveWord,
  isValidEmailFormat,
  extractIpAddresses,
} = require('./solution');

// --- formatGreeting のテスト ---

test('formatGreeting: 朝の時間帯(5〜11時)はおはようございます', () => {
  assert.equal(formatGreeting('田中', 8), 'おはようございます、田中さん!');
});

test('formatGreeting: 昼の時間帯(12〜17時)はこんにちは', () => {
  assert.equal(formatGreeting('田中', 15), 'こんにちは、田中さん!');
});

test('formatGreeting: 夜の時間帯(18〜4時)はこんばんは', () => {
  assert.equal(formatGreeting('田中', 21), 'こんばんは、田中さん!');
});

test('formatGreeting: 境界値(5時と11時は朝、12時と17時は昼、18時と0時は夜)', () => {
  assert.equal(formatGreeting('鈴木', 5), 'おはようございます、鈴木さん!');
  assert.equal(formatGreeting('鈴木', 11), 'おはようございます、鈴木さん!');
  assert.equal(formatGreeting('鈴木', 12), 'こんにちは、鈴木さん!');
  assert.equal(formatGreeting('鈴木', 17), 'こんにちは、鈴木さん!');
  assert.equal(formatGreeting('鈴木', 18), 'こんばんは、鈴木さん!');
  assert.equal(formatGreeting('鈴木', 0), 'こんばんは、鈴木さん!');
});

// --- parseCsvLine のテスト ---

test('parseCsvLine: カンマ区切りの文字列をトリム済みの配列にする', () => {
  assert.deepEqual(parseCsvLine('web01, 192.168.1.10 , running'), [
    'web01',
    '192.168.1.10',
    'running',
  ]);
});

test('parseCsvLine: スペースが無い場合でも正しく分割できる', () => {
  assert.deepEqual(parseCsvLine('db01,10.0.0.5,stopped'), ['db01', '10.0.0.5', 'stopped']);
});

test('parseCsvLine: カンマが無い1項目のみの文字列もトリムされる', () => {
  assert.deepEqual(parseCsvLine('  onlyOneField  '), ['onlyOneField']);
});

test('parseCsvLine: 空の項目が含まれていてもそのまま残る', () => {
  assert.deepEqual(parseCsvLine('a,,c'), ['a', '', 'c']);
});

// --- joinWithComma のテスト ---

test('joinWithComma: 配列の要素を ", " でつなげる', () => {
  assert.equal(joinWithComma(['web01', 'web02', 'db01']), 'web01, web02, db01');
});

test('joinWithComma: 要素が1つだけならカンマは付かない', () => {
  assert.equal(joinWithComma(['single']), 'single');
});

test('joinWithComma: 空配列は空文字列になる', () => {
  assert.equal(joinWithComma([]), '');
});

// --- emphasizeAlert のテスト ---

test('emphasizeAlert: 大文字化して!!!を付け足す', () => {
  assert.equal(emphasizeAlert('disk usage critical'), 'DISK USAGE CRITICAL!!!');
});

test('emphasizeAlert: すでに大文字を含む場合も正しく変換する', () => {
  assert.equal(emphasizeAlert('Cpu Is Fine'), 'CPU IS FINE!!!');
});

test('emphasizeAlert: 空文字列でも!!!が付く', () => {
  assert.equal(emphasizeAlert(''), '!!!');
});

// --- maskSensitiveWord のテスト ---

test('maskSensitiveWord: 該当箇所を同じ文字数の*でマスクする', () => {
  assert.equal(
    maskSensitiveWord('password=Secret123でログインしました', 'Secret123'),
    'password=*********でログインしました',
  );
});

test('maskSensitiveWord: 該当する文字列が無ければそのまま返す', () => {
  assert.equal(maskSensitiveWord('正常なログです', 'Secret123'), '正常なログです');
});

test('maskSensitiveWord: 複数回登場する場合はすべてマスクする', () => {
  assert.equal(maskSensitiveWord('aaaaa', 'a'), '*****');
});

test('maskSensitiveWord: targetが空文字列の場合はtextをそのまま返す', () => {
  assert.equal(maskSensitiveWord('test', ''), 'test');
});

// --- isValidEmailFormat のテスト ---

test('isValidEmailFormat: 正しい形式のメールアドレスはtrue', () => {
  assert.equal(isValidEmailFormat('tanaka@example.com'), true);
});

test('isValidEmailFormat: @が無い文字列はfalse', () => {
  assert.equal(isValidEmailFormat('invalid-email'), false);
});

test('isValidEmailFormat: ドット(.)が無いドメインはfalse', () => {
  assert.equal(isValidEmailFormat('tanaka@example'), false);
});

test('isValidEmailFormat: @の前に何も無い場合はfalse', () => {
  assert.equal(isValidEmailFormat('@example.com'), false);
});

test('isValidEmailFormat: 空白を含む場合はfalse', () => {
  assert.equal(isValidEmailFormat('tanaka @example.com'), false);
});

// --- extractIpAddresses のテスト ---

test('extractIpAddresses: 文中のIPアドレスらしき文字列を複数抜き出す', () => {
  assert.deepEqual(extractIpAddresses('アクセス元は192.168.1.10と10.0.0.5です'), [
    '192.168.1.10',
    '10.0.0.5',
  ]);
});

test('extractIpAddresses: 見つからない場合は空配列を返す(nullにならない)', () => {
  assert.deepEqual(extractIpAddresses('IPアドレスは含まれていません'), []);
});

test('extractIpAddresses: ドットが3つ以下(3セグメント)の数字列にはマッチしない', () => {
  assert.deepEqual(extractIpAddresses('バージョン1.2.3はマッチしない'), []);
});

test('extractIpAddresses: 実在しない値(999.999.999.999)にもマッチしてしまう簡易パターンである', () => {
  assert.deepEqual(extractIpAddresses('999.999.999.999のような不正な値'), [
    '999.999.999.999',
  ]);
});
