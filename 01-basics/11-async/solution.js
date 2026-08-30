// 解答例: 非同期処理
//
// README.md の解説と合わせて読んでください。

/**
 * 指定したミリ秒だけ待ってから解決するPromiseを返す。
 * @param {number} ms - 待つ時間(ミリ秒)
 * @returns {Promise<void>} ms経過後にresolveされるPromise
 */
function delay(ms) {
  // なぜnew Promiseで包むのか:
  // setTimeoutはコールバック関数を渡す古いスタイルのAPIなので、
  // そのままではawaitできない。Promiseコンストラクタで包み、
  // setTimeoutのコールバックが呼ばれたタイミングでresolve()を呼ぶことで、
  // 「ms経過したら解決するPromise」に変換している。
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

// なぜここでダミーデータを用意するのか:
// 本物のデータベースやAPIの代わりに、idをキーにしたオブジェクトを
// 用意しておくことで、「非同期でデータを取得する」処理を手軽に再現できる。
const dummyUsers = {
  1: { id: 1, name: '田中太郎', email: 'tanaka@example.com' },
  2: { id: 2, name: '鈴木花子', email: 'suzuki@example.com' },
  3: { id: 3, name: '佐藤次郎', email: 'sato@example.com' },
};

/**
 * idからユーザー情報を非同期に取得する(擬似的なAPI呼び出し)。
 * idが1〜3のときはdelay後にダミーユーザーでresolveし、
 * それ以外のときはdelay後にErrorでrejectする。
 * @param {number} id - 取得したいユーザーのID
 * @returns {Promise<{id: number, name: string, email: string}>} ユーザー情報のPromise
 */
async function fetchUserById(id) {
  // なぜasync/awaitを使うのか:
  // 「delayが終わるのを待ってから、次の処理(ユーザーを探す)に進みたい」
  // という意図を、.thenをネストするより素直に(同期処理のように)書ける。
  await delay(20);

  const user = dummyUsers[id];
  if (!user) {
    // なぜthrowでエラーを表すのか:
    // async関数の中でthrowすると、その関数が返すPromiseは自動的に
    // reject状態になる。呼び出し側はtry/catchや.catchでこれを捕まえられる。
    throw new Error(`ユーザーが見つかりません: id=${id}`);
  }

  return user;
}

/**
 * 複数のidから複数のユーザー情報をまとめて(並行して)取得する。
 * @param {number[]} ids - 取得したいユーザーIDの配列
 * @returns {Promise<Array<{id: number, name: string, email: string}>>} 取得したユーザー情報の配列のPromise(idsの順序を保つ)
 */
async function fetchAllUsers(ids) {
  // なぜPromise.allを使うのか:
  // fetchUserByIdをidsの数だけ1つずつawaitすると、「1件取得し終わって
  // から次を取得する」という直列(逐次)処理になり、時間がかかってしまう。
  // 先にids.mapで全てのfetchUserById呼び出しを開始しておくと
  // (この時点でそれぞれの処理が並行に進み始める)、Promise.allで
  // まとめて待つだけで、全体の待ち時間を「一番時間がかかった1件分」に
  // 短縮できる。
  const promises = ids.map((id) => fetchUserById(id));
  const users = await Promise.all(promises);
  return users;
}

module.exports = { delay, fetchUserById, fetchAllUsers };
