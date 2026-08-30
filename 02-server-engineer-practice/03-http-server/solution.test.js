const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('./solution');

/**
 * サーバーをランダムな空きポートで起動し、テスト用のベースURLを渡すヘルパー関数。
 *
 * なぜこのヘルパー関数を作るのか:
 * どのテストでも「サーバーを起動する→リクエストを送る→サーバーを閉じる」という
 * 同じ手順を繰り返すことになる。try/finally を使ったこの手順を1箇所にまとめておくことで、
 * 「サーバーを閉じ忘れる」というミス(ポートが使われたまま残ってしまうリソースリーク)を防げる。
 * finally の中で server.close() を呼んでいるので、途中の assert が失敗した場合でも
 * 必ずサーバーが閉じられる。
 *
 * @param {(baseUrl: string) => Promise<void>} callback - テスト内容を書いた非同期関数
 */
async function withServer(callback) {
  const server = createServer();

  // listen(0) の 0 は「OSに空いているポート番号を自動的に選んでもらう」という意味。
  // 決め打ちのポート番号(例えば3000番)を使うと、他のテストや他のプロセスと
  // ポートが衝突してテストが不安定になることがあるため、テストでは0を指定するのが定石。
  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await callback(baseUrl);
  } finally {
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
}

test('createServer: GET / はステータス200とJSONのmessageを返す', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/json; charset=utf-8');

    const body = await response.json();
    // メッセージの中身自体は自由に決めてよい仕様なので、
    // 「文字列のmessageプロパティが存在すること」だけを確認する。
    assert.equal(typeof body.message, 'string');
    assert.ok(body.message.length > 0);
  });
});

test('createServer: GET /health はステータス200と{ status: "ok" }を返す', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);

    const body = await response.json();
    assert.deepEqual(body, { status: 'ok' });
  });
});

test('createServer: 存在しないパスはステータス404と{ error: "Not Found" }を返す', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/no-such-page`);
    assert.equal(response.status, 404);

    const body = await response.json();
    assert.deepEqual(body, { error: 'Not Found' });
  });
});

test('createServer: 境界値として、末尾にスラッシュを付けた/health/は404になる', () => {
  return withServer(async (baseUrl) => {
    // "/health" と "/health/" は違うパスとして扱われるべきで、
    // 曖昧に一致させるのではなく、完全一致だけをOKにするのが今回の仕様である。
    const response = await fetch(`${baseUrl}/health/`);
    assert.equal(response.status, 404);
  });
});

test('createServer: listen()するまではポートを使わないので、複数のサーバーを独立して動かせる', async () => {
  // createServer() はポートを使い始めない設計になっているはずなので、
  // 2つのサーバーを同時に(別々のポートで)起動しても問題なく動くはずである。
  await withServer(async (baseUrlA) => {
    await withServer(async (baseUrlB) => {
      assert.notEqual(baseUrlA, baseUrlB);

      const [responseA, responseB] = await Promise.all([
        fetch(`${baseUrlA}/health`),
        fetch(`${baseUrlB}/health`),
      ]);
      assert.equal(responseA.status, 200);
      assert.equal(responseB.status, 200);
    });
  });
});
