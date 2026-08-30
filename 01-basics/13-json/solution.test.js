const { test } = require('node:test');
const assert = require('node:assert/strict');
const { toPrettyJson, parseJsonSafely, mergeConfigFromJson } = require('./solution');

// --- toPrettyJson のテスト ---

test('toPrettyJson: シンプルなオブジェクトを整形されたJSON文字列にする', () => {
  const result = toPrettyJson({ name: 'server1' });
  assert.equal(result, '{\n  "name": "server1"\n}');
});

test('toPrettyJson: ネストしたオブジェクトも正しく整形される', () => {
  const result = toPrettyJson({ name: 'server1', network: { port: 8080 } });
  assert.equal(
    result,
    '{\n  "name": "server1",\n  "network": {\n    "port": 8080\n  }\n}',
  );
});

test('toPrettyJson: 配列を渡した場合もJSON.stringifyと同じ結果になる', () => {
  const result = toPrettyJson(['a', 'b', 'c']);
  assert.equal(result, JSON.stringify(['a', 'b', 'c'], null, 2));
});

// --- parseJsonSafely のテスト ---

test('parseJsonSafely: 正しいJSON文字列をオブジェクトに変換する', () => {
  const result = parseJsonSafely('{"port":8080,"host":"localhost"}');
  assert.deepEqual(result, { port: 8080, host: 'localhost' });
});

test('parseJsonSafely: 不正なJSON文字列を渡すとnullを返す(例外は投げない)', () => {
  assert.equal(parseJsonSafely('これはJSONではない'), null);
});

test('parseJsonSafely: 末尾カンマがあるJSON文字列(よくあるミス)もnullを返す', () => {
  assert.equal(parseJsonSafely('{"port":8080,}'), null);
});

test('parseJsonSafely: シングルクォートで書かれたJSON文字列(よくあるミス)もnullを返す', () => {
  assert.equal(parseJsonSafely("{'port':8080}"), null);
});

test('parseJsonSafely: JSONの配列文字列も正しく変換する', () => {
  const result = parseJsonSafely('[1,2,3]');
  assert.deepEqual(result, [1, 2, 3]);
});

// --- mergeConfigFromJson のテスト ---

test('mergeConfigFromJson: overrideの値でbaseObjectの値を上書きする', () => {
  const base = { host: 'localhost', port: 8080, debug: false };
  const result = mergeConfigFromJson(base, '{"port": 9090, "debug": true}');
  assert.deepEqual(result, { host: 'localhost', port: 9090, debug: true });
});

test('mergeConfigFromJson: overrideにしかないキーは新しく追加される', () => {
  const base = { host: 'localhost' };
  const result = mergeConfigFromJson(base, '{"timeout": 3000}');
  assert.deepEqual(result, { host: 'localhost', timeout: 3000 });
});

test('mergeConfigFromJson: baseObject自体は変更されない(新しいオブジェクトが返る)', () => {
  const base = { host: 'localhost', port: 8080 };
  const result = mergeConfigFromJson(base, '{"port": 9090}');
  assert.deepEqual(base, { host: 'localhost', port: 8080 }); // baseは変わっていない
  assert.notEqual(result, base); // 別のオブジェクトである
});

test('mergeConfigFromJson: 不正なJSONを渡すと分かりやすいメッセージのエラーがthrowされる', () => {
  assert.throws(
    () => mergeConfigFromJson({ port: 8080 }, '不正なJSON'),
    (error) => {
      assert.ok(error instanceof Error);
      assert.ok(error.message.startsWith('設定のJSONが不正です: '));
      return true;
    },
  );
});

test('mergeConfigFromJson: 末尾カンマのJSONを渡した場合もエラーがthrowされる', () => {
  assert.throws(() => mergeConfigFromJson({ port: 8080 }, '{"port": 9090,}'), Error);
});
