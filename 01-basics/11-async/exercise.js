// 演習: 非同期処理
//
// このファイルでは、以下の3つの関数を実装してください。
//
// 1. delay(ms)
//    ms ミリ秒待ってから解決する(resolveする)Promiseを返す。
//    setTimeoutを使って実装すること。
//
// 2. fetchUserById(id)
//    idが1〜3のときは、delayで少し待ってから、ダミーのユーザーオブジェクトで
//    resolveするPromiseを返す。それ以外のときは、delayで少し待ってから、
//    Errorでrejectする(擬似的な非同期API)。
//
// 3. fetchAllUsers(ids)
//    idの配列を受け取り、Promise.allを使って複数のfetchUserByIdを
//    並行して実行し、取得したユーザーの配列でresolveするPromiseを返す。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * 指定したミリ秒だけ待ってから解決するPromiseを返す。
 * @param {number} ms - 待つ時間(ミリ秒)
 * @returns {Promise<void>} ms経過後にresolveされるPromise
 */
function delay(ms) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * idからユーザー情報を非同期に取得する(擬似的なAPI呼び出し)。
 * idが1〜3のときはdelay後にダミーユーザーでresolveし、
 * それ以外のときはdelay後にErrorでrejectする。
 * @param {number} id - 取得したいユーザーのID
 * @returns {Promise<{id: number, name: string, email: string}>} ユーザー情報のPromise
 */
async function fetchUserById(id) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 複数のidから複数のユーザー情報をまとめて(並行して)取得する。
 * @param {number[]} ids - 取得したいユーザーIDの配列
 * @returns {Promise<Array<{id: number, name: string, email: string}>>} 取得したユーザー情報の配列のPromise(idsの順序を保つ)
 */
async function fetchAllUsers(ids) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { delay, fetchUserById, fetchAllUsers };
