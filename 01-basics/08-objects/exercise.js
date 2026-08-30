// 演習: オブジェクト
//
// このファイルでは、以下の4つの関数を実装してください。
//
// 1. createUser(name, age)
//    name と age を受け取り、{ name, age } の形のオブジェクトを返す。
//
// 2. summarizeUser(user)
//    { name, age } を持つオブジェクトを受け取り、
//    分割代入を使って "<name>さん(<age>歳)" という文字列を返す。
//
// 3. mergeSettings(defaults, overrides)
//    2つのオブジェクトを受け取り、スプレッド構文を使って
//    defaultsにoverridesを上書きマージした新しいオブジェクトを返す。
//
// 4. countProperties(obj)
//    オブジェクトを受け取り、Object.keysを使ってプロパティ数を返す。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * name と age を受け取り、ユーザーオブジェクトを作って返す。
 * @param {string} name - ユーザー名
 * @param {number} age - 年齢
 * @returns {{ name: string, age: number }} 作成したユーザーオブジェクト
 */
function createUser(name, age) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * ユーザーオブジェクトから紹介文を作って返す。
 * @param {{ name: string, age: number }} user - ユーザーオブジェクト
 * @returns {string} "<name>さん(<age>歳)" という形式の文字列
 */
function summarizeUser(user) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * デフォルト設定に上書き設定をマージした新しいオブジェクトを返す。
 * @param {object} defaults - デフォルト設定のオブジェクト
 * @param {object} overrides - 上書きしたい設定のオブジェクト
 * @returns {object} マージ後の新しいオブジェクト
 */
function mergeSettings(defaults, overrides) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * オブジェクトが持つプロパティの数を返す。
 * @param {object} obj - 任意のオブジェクト
 * @returns {number} プロパティの数
 */
function countProperties(obj) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { createUser, summarizeUser, mergeSettings, countProperties };
