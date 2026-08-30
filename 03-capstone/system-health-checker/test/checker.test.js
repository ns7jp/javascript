// test/checker.test.js
//
// checker.js と logger.js が期待通りに動くことを確認する自動テストです。
// Node.js標準の node:test / node:assert/strict のみを使い、外部のテストライブラリは使いません。
//
// テストの中でファイルを作ったり消したりする箇所では、OSの「一時ディレクトリ」
// (os.tmpdir() で取得できる、テンプレートファイルなどを置くための共有ディレクトリ)を使い、
// テストが終わったら必ず後片付け(fs.rmSync)をすることで、
// このリポジトリの中にテスト用のゴミファイルが残らないようにしています。

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { checkService, checkAll } = require('../src/checker');
const { formatSummaryLine, buildLogContent, writeLogFile } = require('../src/logger');

// ---------------------------------------------------------------------------
// checkService のテスト
// ---------------------------------------------------------------------------

test('checkService: 実在するファイルを指定すると status が "UP" になる', () => {
  // os.tmpdir() は、OSが用意している「一時ファイルを置いてよい共有ディレクトリ」を返します。
  // テストのたびに新しいファイル名を使うことで、他のテストと衝突しないようにしています。
  const tempFilePath = path.join(os.tmpdir(), `health-checker-test-up-${Date.now()}.txt`);
  fs.writeFileSync(tempFilePath, 'テスト用の中身です');

  try {
    const result = checkService({ name: 'temp-file', type: 'file', target: tempFilePath });

    assert.equal(result.status, 'UP');
    assert.equal(result.name, 'temp-file');
    // checkedAt はISO 8601形式の日時文字列であることを確認します。
    // new Date(...).toISOString() が同じ文字列を返せば、正しい形式で入っている証拠になります。
    assert.equal(new Date(result.checkedAt).toISOString(), result.checkedAt);
  } finally {
    // テストが成功しても失敗しても、必ず一時ファイルを削除しておきます。
    fs.rmSync(tempFilePath, { force: true });
  }
});

test('checkService: 存在しないパスを指定すると status が "DOWN" になる', () => {
  const nonExistentPath = path.join(os.tmpdir(), `health-checker-test-down-${Date.now()}.txt`);
  // ここでは意図的にファイルを作成しません。存在しないことがこのテストの前提です。

  const result = checkService({ name: 'missing-file', type: 'file', target: nonExistentPath });

  assert.equal(result.status, 'DOWN');
  assert.equal(result.name, 'missing-file');
});

test('checkService: 未対応の type を渡すと分かりやすいエラーで例外が発生する', () => {
  assert.throws(
    () => checkService({ name: 'weird-service', type: 'http', target: 'https://example.com' }),
    (error) => {
      assert.ok(error instanceof Error);
      // エラーメッセージに「どのtypeが未対応なのか」「どのサービス名か」が
      // 含まれていることを確認し、単に例外が飛ぶだけでなく、原因が分かるメッセージに
      // なっていることを検証します。
      assert.match(error.message, /http/);
      assert.match(error.message, /weird-service/);
      return true;
    }
  );
});

// ---------------------------------------------------------------------------
// checkAll のテスト
// ---------------------------------------------------------------------------

test('checkAll: 複数サービスを渡すと、同じ順番・同じ件数の結果配列が返る', () => {
  const tempFilePath = path.join(os.tmpdir(), `health-checker-test-all-${Date.now()}.txt`);
  fs.writeFileSync(tempFilePath, 'ok');
  const missingPath = path.join(os.tmpdir(), `health-checker-test-all-missing-${Date.now()}.txt`);

  try {
    const services = [
      { name: 'service-a', type: 'file', target: tempFilePath },
      { name: 'service-b', type: 'file', target: missingPath },
      { name: 'service-c', type: 'file', target: tempFilePath },
    ];

    const results = checkAll(services);

    // 件数がservicesと一致していること
    assert.equal(results.length, 3);
    // 渡した順番のまま結果が並んでいること(map を使っているため順序は保たれるはずですが、
    // 仕様として明示的に確認しておきます)
    assert.deepEqual(
      results.map((r) => r.name),
      ['service-a', 'service-b', 'service-c']
    );
    assert.equal(results[0].status, 'UP');
    assert.equal(results[1].status, 'DOWN');
    assert.equal(results[2].status, 'UP');
  } finally {
    fs.rmSync(tempFilePath, { force: true });
  }
});

test('checkAll: 空配列を渡すと空配列が返る(境界値)', () => {
  const results = checkAll([]);
  assert.deepEqual(results, []);
});

// ---------------------------------------------------------------------------
// logger.js のテスト
// ---------------------------------------------------------------------------

test('formatSummaryLine: サービス名とUP/DOWNの表記を含む1行の文字列になる', () => {
  const line = formatSummaryLine({
    name: 'readme-file',
    status: 'UP',
    checkedAt: '2026-08-30T03:15:00.000Z',
  });

  assert.match(line, /readme-file/);
  assert.match(line, /UP/);
  assert.match(line, /2026-08-30T03:15:00\.000Z/);
});

test('formatSummaryLine: DOWNのときはDOWNという表記を含む', () => {
  const line = formatSummaryLine({
    name: 'missing-service',
    status: 'DOWN',
    checkedAt: '2026-08-30T03:15:00.000Z',
  });

  assert.match(line, /missing-service/);
  assert.match(line, /DOWN/);
});

test('buildLogContent: 各行のサービス結果とUP/DOWNの件数サマリーを含む', () => {
  const results = [
    { name: 'service-a', status: 'UP', checkedAt: '2026-08-30T03:15:00.000Z' },
    { name: 'service-b', status: 'DOWN', checkedAt: '2026-08-30T03:15:00.000Z' },
    { name: 'service-c', status: 'UP', checkedAt: '2026-08-30T03:15:00.000Z' },
  ];

  const content = buildLogContent(results);

  // 各サービスの行が含まれていること
  assert.match(content, /service-a/);
  assert.match(content, /service-b/);
  assert.match(content, /service-c/);
  // UP=2, DOWN=1 という件数サマリーが含まれていること
  assert.match(content, /UP=2/);
  assert.match(content, /DOWN=1/);
  assert.match(content, /TOTAL=3/);
});

test('buildLogContent: 結果が0件のときもUP=0 DOWN=0のサマリーになる(境界値)', () => {
  const content = buildLogContent([]);

  assert.match(content, /UP=0/);
  assert.match(content, /DOWN=0/);
  assert.match(content, /TOTAL=0/);
});

test('writeLogFile: 一時ディレクトリにログファイルを書き出し、そのパスを返す', () => {
  const tempLogDir = fs.mkdtempSync(path.join(os.tmpdir(), 'health-checker-logtest-'));

  try {
    const results = [{ name: 'service-a', status: 'UP', checkedAt: new Date().toISOString() }];

    const writtenPath = writeLogFile(results, tempLogDir);

    // 返り値のパスが実際に存在するファイルを指していること
    assert.ok(fs.existsSync(writtenPath));
    // 指定したディレクトリの配下にファイルが作られていること
    assert.equal(path.dirname(writtenPath), tempLogDir);
    // ファイル名が仕様通り "health-check-" から始まり ".log" で終わること
    assert.match(path.basename(writtenPath), /^health-check-.+\.log$/);

    // 中身がbuildLogContentと同じ形式になっていること
    const fileContent = fs.readFileSync(writtenPath, 'utf8');
    assert.match(fileContent, /service-a/);
    assert.match(fileContent, /UP=1/);
  } finally {
    // 後片付け: recursive/forceを指定し、ディレクトリごと安全に削除します。
    fs.rmSync(tempLogDir, { recursive: true, force: true });
  }
});

test('writeLogFile: logDirが存在しない場合でも自動的に作成してから書き出す', () => {
  const tempBaseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'health-checker-logtest-nested-'));
  // わざと「まだ存在しないネストしたディレクトリ」を指定します。
  const nestedLogDir = path.join(tempBaseDir, 'nested', 'logs');

  try {
    assert.equal(fs.existsSync(nestedLogDir), false);

    const results = [{ name: 'service-x', status: 'DOWN', checkedAt: new Date().toISOString() }];
    const writtenPath = writeLogFile(results, nestedLogDir);

    assert.ok(fs.existsSync(nestedLogDir));
    assert.ok(fs.existsSync(writtenPath));
  } finally {
    fs.rmSync(tempBaseDir, { recursive: true, force: true });
  }
});
