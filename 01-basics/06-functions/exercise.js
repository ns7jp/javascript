// 演習: 関数の基本
//
// このファイルでは、以下の3つの関数を実装してください。
//
// 1. multiply(a, b = 1)
//    aとbを掛け算した結果を返す。bが省略された場合は1として計算する。
//    デフォルト引数を使って実装すること。
//
// 2. sumAll(...numbers)
//    渡された数値すべての合計を返す。引数が1つもなければ0を返す。
//    rest parametersを使って実装すること。
//
// 3. createCounter()
//    呼び出すたびに1ずつ増えていく数値を返す関数を作って返す、ファクトリ関数。
//    クロージャを使って、内部のcountを保持すること。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * aとbを掛け算した結果を返す。bを省略した場合は1として扱う。
 * @param {number} a - 掛けられる数
 * @param {number} [b=1] - 掛ける数(省略時は1)
 * @returns {number} a * b の結果
 */
function multiply(a, b = 1) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 渡された数値すべての合計を返す。
 * @param {...number} numbers - 合計したい数値(いくつでも渡せる)
 * @returns {number} numbersの合計。引数がなければ0
 */
function sumAll(...numbers) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 呼び出すたびに1ずつ増える数値を返す関数を作って返す、ファクトリ関数。
 * @returns {() => number} 呼び出すたびにカウントを1増やして返す関数
 */
function createCounter() {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { multiply, sumAll, createCounter };
