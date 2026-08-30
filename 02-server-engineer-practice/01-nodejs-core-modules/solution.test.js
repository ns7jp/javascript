const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { readTextFile, getFileExtension, getEnvOrDefault } = require('./solution');

// --- readTextFile のテスト ---
// os.tmpdir()(一時ファイル置き場)にテスト用のファイルを作成し、
// 読み込みを確認したあとにfs.unlinkSyncで削除する、という流れでテストする。

test('readTextFile: 一時ファイルを作成して正しく読み込める', () => {
  const tempFilePath = path.join(os.tmpdir(), `nodejs-core-modules-test-${Date.now()}.txt`);
  const content = 'こんにちは、サーバー構築エンジニア';

  fs.writeFileSync(tempFilePath, content, 'utf-8');

  try {
    const result = readTextFile(tempFilePath);
    assert.equal(result, content);
  } finally {
    // テスト後は必ず一時ファイルを削除し、環境を汚さないようにする
    fs.unlinkSync(tempFilePath);
  }
});

test('readTextFile: 空のファイルを読み込むと空文字列が返る', () => {
  const tempFilePath = path.join(os.tmpdir(), `nodejs-core-modules-test-empty-${Date.now()}.txt`);
  fs.writeFileSync(tempFilePath, '', 'utf-8');

  try {
    assert.equal(readTextFile(tempFilePath), '');
  } finally {
    fs.unlinkSync(tempFilePath);
  }
});

test('readTextFile: 存在しないファイルを指定すると分かりやすいメッセージのエラーがthrowされる', () => {
  const missingFilePath = path.join(os.tmpdir(), 'nodejs-core-modules-test-not-exist.txt');

  assert.throws(
    () => readTextFile(missingFilePath),
    (error) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, `ファイルが見つかりません: ${missingFilePath}`);
      return true;
    },
  );
});

// --- getFileExtension のテスト ---

test('getFileExtension: 一般的なファイル名から拡張子を取り出す', () => {
  assert.equal(getFileExtension('config.json'), '.json');
});

test('getFileExtension: 複数のドットを含むファイル名では最後の拡張子のみ返す', () => {
  assert.equal(getFileExtension('archive.tar.gz'), '.gz');
});

test('getFileExtension: 拡張子がないファイル名では空文字列を返す', () => {
  assert.equal(getFileExtension('README'), '');
});

test('getFileExtension: ディレクトリを含むパスでも正しく拡張子を取り出せる', () => {
  assert.equal(getFileExtension('/var/log/app.log'), '.log');
});

// --- getEnvOrDefault のテスト ---
// process.envを一時的に書き換えてテストし、テスト後は必ず元の状態に戻す。

test('getEnvOrDefault: 環境変数が設定されていればその値を返す', () => {
  const originalValue = process.env.NODEJS_CORE_MODULES_TEST_VAR;

  process.env.NODEJS_CORE_MODULES_TEST_VAR = '8080';
  try {
    assert.equal(getEnvOrDefault('NODEJS_CORE_MODULES_TEST_VAR', '3000'), '8080');
  } finally {
    // 元々存在しなかった環境変数であれば削除し、環境を汚さないようにする
    if (originalValue === undefined) {
      delete process.env.NODEJS_CORE_MODULES_TEST_VAR;
    } else {
      process.env.NODEJS_CORE_MODULES_TEST_VAR = originalValue;
    }
  }
});

test('getEnvOrDefault: 環境変数が設定されていなければdefaultValueを返す', () => {
  delete process.env.NODEJS_CORE_MODULES_TEST_VAR_UNSET;

  assert.equal(getEnvOrDefault('NODEJS_CORE_MODULES_TEST_VAR_UNSET', '3000'), '3000');
});

test('getEnvOrDefault: 環境変数が空文字列の場合はdefaultValueではなく空文字列を返す', () => {
  const originalValue = process.env.NODEJS_CORE_MODULES_TEST_VAR_EMPTY;

  process.env.NODEJS_CORE_MODULES_TEST_VAR_EMPTY = '';
  try {
    // ||演算子で実装すると、空文字列はfalsyなためdefaultValueが返ってしまう。
    // ここではundefinedとの比較で正しく判定できているかを確認する。
    assert.equal(getEnvOrDefault('NODEJS_CORE_MODULES_TEST_VAR_EMPTY', 'default'), '');
  } finally {
    if (originalValue === undefined) {
      delete process.env.NODEJS_CORE_MODULES_TEST_VAR_EMPTY;
    } else {
      process.env.NODEJS_CORE_MODULES_TEST_VAR_EMPTY = originalValue;
    }
  }
});
