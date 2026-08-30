// 演習: 演算子と型変換
//
// このファイルでは、以下の2つの関数を実装してください。
//
// 1. isStrictlyEqual(a, b)
//    a と b を「厳密等価演算子(===)」で比較した結果(true/false)を返す。
//
// 2. coerceToNumber(value)
//    value を数値に変換できればその数値を返す。
//    変換できない場合は NaN ではなく、明示的に null を返す。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * a と b を === (厳密等価演算子) で比較した結果を返す。
 * @param {*} a - 比較したい値1
 * @param {*} b - 比較したい値2
 * @returns {boolean} a === b の結果
 */
function isStrictlyEqual(a, b) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * value を数値に変換する。変換できなければ null を返す。
 * @param {*} value - 数値に変換したい値
 * @returns {number|null} 変換できた場合は数値、できなければ null
 */
function coerceToNumber(value) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { isStrictlyEqual, coerceToNumber };
