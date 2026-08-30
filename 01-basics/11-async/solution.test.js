const { test } = require('node:test');
const assert = require('node:assert/strict');
const { delay, fetchUserById, fetchAllUsers } = require('./solution');

// --- delay のテスト ---

test('delay: Promiseを返す', () => {
  const result = delay(10);
  assert.ok(result instanceof Promise);
});

test('delay: 指定時間が経過するまでは解決しない', async () => {
  let resolved = false;
  const promise = delay(50).then(() => {
    resolved = true;
  });

  // delay呼び出し直後(まだ50ms経っていないはず)はfalseのまま
  assert.equal(resolved, false);

  await promise;

  // awaitし終えた後はtrueになっているはず
  assert.equal(resolved, true);
});

test('delay: awaitすると指定時間分きちんと待つ', async () => {
  const before = Date.now();
  await delay(30);
  const after = Date.now();

  // 実行環境によって多少の誤差はあるが、タイマーの性質上
  // 指定した時間より早く解決することは基本的にないため、
  // 余裕を持ったマージンで検証する。
  assert.ok(after - before >= 20);
});

// --- fetchUserById のテスト ---

test('fetchUserById: id=1のとき、ダミーユーザーでresolveする', async () => {
  const user = await fetchUserById(1);
  assert.deepEqual(user, { id: 1, name: '田中太郎', email: 'tanaka@example.com' });
});

test('fetchUserById: id=2やid=3でも、対応するユーザーが返る', async () => {
  const user2 = await fetchUserById(2);
  const user3 = await fetchUserById(3);
  assert.equal(user2.id, 2);
  assert.equal(user3.id, 3);
  // idが異なれば、ユーザー情報も異なるはず
  assert.notEqual(user2.name, user3.name);
});

test('fetchUserById: 範囲外のidのときはErrorでrejectされる', async () => {
  await assert.rejects(() => fetchUserById(999), Error);
});

test('fetchUserById: id=0のときもrejectされる', async () => {
  await assert.rejects(() => fetchUserById(0), Error);
});

// --- fetchAllUsers のテスト ---

test('fetchAllUsers: 複数のidから、対応するユーザーの配列を取得する(順序を保つ)', async () => {
  const users = await fetchAllUsers([1, 2, 3]);
  assert.equal(users.length, 3);
  assert.equal(users[0].id, 1);
  assert.equal(users[1].id, 2);
  assert.equal(users[2].id, 3);
});

test('fetchAllUsers: 空配列を渡すと空配列でresolveする', async () => {
  const users = await fetchAllUsers([]);
  assert.deepEqual(users, []);
});

test('fetchAllUsers: 1つでも無効なidが含まれるとrejectされる', async () => {
  await assert.rejects(() => fetchAllUsers([1, 999, 2]), Error);
});

test('fetchAllUsers: 複数idの取得が直列よりも十分速く終わる(並行実行の確認)', async () => {
  const before = Date.now();
  await fetchAllUsers([1, 2, 3]);
  const after = Date.now();

  // fetchUserByIdは1件あたり約20ms待つ。直列に3件処理すると
  // 60ms以上かかるはずだが、Promise.allで並行に処理していれば
  // 20ms強で終わるはずなので、余裕を持って50ms未満であることを確認する。
  assert.ok(after - before < 50);
});
