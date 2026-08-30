const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseLine, analyze } = require('./solution');

// --- parseLine のテスト ---

test('parseLine: 正常な行を正しくパースできる', () => {
  const line = '2026-08-30T10:15:00Z GET /api/users 200 42ms';

  const result = parseLine(line);

  assert.deepEqual(result, {
    timestamp: '2026-08-30T10:15:00Z',
    method: 'GET',
    path: '/api/users',
    status: 200,
    durationMs: 42,
  });
});

test('parseLine: POSTメソッドや複数桁のレスポンスタイムも正しくパースできる', () => {
  const line = '2026-08-30T10:16:30Z POST /api/orders 201 1234ms';

  const result = parseLine(line);

  assert.deepEqual(result, {
    timestamp: '2026-08-30T10:16:30Z',
    method: 'POST',
    path: '/api/orders',
    status: 201,
    durationMs: 1234,
  });
  // statusとdurationMsは文字列ではなく数値型になっている必要がある
  assert.equal(typeof result.status, 'number');
  assert.equal(typeof result.durationMs, 'number');
});

test('parseLine: 境界値として、前後に余分な空白や\\rが付いていてもtrimして正しくパースできる', () => {
  const line = '  2026-08-30T10:15:00Z GET /api/users 200 42ms  \r';

  const result = parseLine(line);

  assert.equal(result.status, 200);
  assert.equal(result.durationMs, 42);
});

test('parseLine: 形式に合わない行はnullを返す', () => {
  assert.equal(parseLine(''), null);
  assert.equal(parseLine('   '), null);
  assert.equal(parseLine('これはログ行ではありません'), null);
  // ステータスコードが2桁しかない(3桁固定の仕様に合わない)
  assert.equal(parseLine('2026-08-30T10:15:00Z GET /api/users 20 42ms'), null);
  // メソッドが小文字(仕様は大文字のみ)
  assert.equal(parseLine('2026-08-30T10:15:00Z get /api/users 200 42ms'), null);
  // レスポンスタイムの単位がmsではない
  assert.equal(parseLine('2026-08-30T10:15:00Z GET /api/users 200 42seconds'), null);
});

test('parseLine: 文字列以外を渡すとnullを返す', () => {
  assert.equal(parseLine(null), null);
  assert.equal(parseLine(undefined), null);
  assert.equal(parseLine(12345), null);
});

// --- analyze のテスト ---

test('analyze: 複数行のログを正しく集計できる', () => {
  const logText = [
    '2026-08-30T10:00:00Z GET /api/users 200 100ms',
    '2026-08-30T10:00:01Z GET /api/users 200 200ms',
    '2026-08-30T10:00:02Z POST /api/login 404 50ms',
    '2026-08-30T10:00:03Z GET /api/orders 500 150ms',
  ].join('\n');

  const result = analyze(logText);

  assert.equal(result.totalRequests, 4);
  assert.deepEqual(result.byStatus, { '200': 2, '404': 1, '500': 1 });
  // 合計 (100 + 200 + 50 + 150) / 4 = 125
  assert.equal(result.averageDurationMs, 125);
});

test('analyze: 不正な行や空行が混ざっていても、有効な行だけを集計する', () => {
  const logText = [
    '2026-08-30T10:00:00Z GET /api/users 200 100ms',
    '',
    'これは不正な行です',
    '2026-08-30T10:00:05Z GET /api/orders 404 50ms',
  ].join('\n');

  const result = analyze(logText);

  assert.equal(result.totalRequests, 2);
  assert.deepEqual(result.byStatus, { '200': 1, '404': 1 });
  assert.equal(result.averageDurationMs, 75);
});

test('analyze: 境界値として、有効な行が1つもない場合はtotalRequestsが0でaverageDurationMsもNaNにならず0になる', () => {
  const result = analyze('');

  assert.deepEqual(result, { totalRequests: 0, byStatus: {}, averageDurationMs: 0 });
});

test('analyze: logTextが文字列でない場合はTypeErrorをthrowする', () => {
  assert.throws(() => analyze(null), TypeError);
  assert.throws(() => analyze(12345), TypeError);
});
