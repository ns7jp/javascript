// 解答例: オブジェクト
//
// README.md の解説と合わせて読んでください。

/**
 * name と age を受け取り、ユーザーオブジェクトを作って返す。
 * @param {string} name - ユーザー名
 * @param {number} age - 年齢
 * @returns {{ name: string, age: number }} 作成したユーザーオブジェクト
 */
function createUser(name, age) {
  // なぜ { name, age } と書けるのか:
  // オブジェクトリテラルの短縮記法(プロパティ名と変数名が同じ場合、
  // { name: name, age: age } を { name, age } と省略できる)を使っている。
  // これにより「引数をそのままプロパティにする」処理を簡潔に書ける。
  return { name, age };
}

/**
 * ユーザーオブジェクトから紹介文を作って返す。
 * @param {{ name: string, age: number }} user - ユーザーオブジェクト
 * @returns {string} "<name>さん(<age>歳)" という形式の文字列
 */
function summarizeUser(user) {
  // なぜ分割代入を使うのか:
  // user.name, user.age と毎回書く代わりに、
  // 最初にまとめて取り出しておくことで、以降のコードが読みやすくなる。
  // 特に使うプロパティが多い場合や、複数回参照する場合に効果が大きい。
  const { name, age } = user;
  return `${name}さん(${age}歳)`;
}

/**
 * デフォルト設定に上書き設定をマージした新しいオブジェクトを返す。
 * @param {object} defaults - デフォルト設定のオブジェクト
 * @param {object} overrides - 上書きしたい設定のオブジェクト
 * @returns {object} マージ後の新しいオブジェクト
 */
function mergeSettings(defaults, overrides) {
  // なぜスプレッド構文を使うのか:
  // { ...defaults, ...overrides } と書くと、まずdefaultsの全プロパティが
  // 展開され、そのあとoverridesの全プロパティが展開される。
  // オブジェクトリテラルでは「後に書かれたプロパティが優先(上書き)される」
  // という性質があるため、結果として「overridesにあるものはoverridesの値、
  // overridesにないものはdefaultsの値」というマージが実現できる。
  // また、引数のdefaultsやoverrides自体は書き換えられず、
  // 常に新しいオブジェクトが作られる点も重要(意図しない副作用を防げる)。
  return { ...defaults, ...overrides };
}

/**
 * オブジェクトが持つプロパティの数を返す。
 * @param {object} obj - 任意のオブジェクト
 * @returns {number} プロパティの数
 */
function countProperties(obj) {
  // なぜObject.keysを使うのか:
  // Object.keys(obj) は、そのオブジェクトが持つプロパティ名を
  // 文字列の配列として返してくれる。
  // その配列のlengthを見れば、プロパティの数がそのまま分かる。
  return Object.keys(obj).length;
}

module.exports = { createUser, summarizeUser, mergeSettings, countProperties };
