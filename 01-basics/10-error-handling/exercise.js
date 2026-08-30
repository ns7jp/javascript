// 演習: エラーハンドリング
//
// このファイルでは、以下のクラスと2つの関数を実装してください。
//
// 1. class ValidationError extends Error
//    message を1つ受け取るコンストラクタを持つ、Errorを継承したカスタムエラークラス。
//    super(message) を呼び出したうえで、this.name に 'ValidationError' を設定する。
//
// 2. safeDivide(a, b)
//    aをbで割った結果を返す。bが0の場合は ValidationError をthrowする。
//
// 3. parseAndDivide(aStr, bStr)
//    文字列として渡された数値を変換し、safeDivideで計算する。
//    try/catch/finallyを使い、失敗した場合も分かりやすいメッセージの文字列を返す。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * 入力値の検証エラーを表すカスタムエラークラス。
 */
class ValidationError extends Error {
  constructor(message) {
    // TODO: ここに実装してください
    // ヒント: super(message) を呼び出したあと、this.name = 'ValidationError' を設定する
    throw new Error('未実装です');
  }
}

/**
 * aをbで割った結果を返す。bが0の場合はValidationErrorをthrowする。
 * @param {number} a - 割られる数
 * @param {number} b - 割る数
 * @returns {number} a / b の計算結果
 */
function safeDivide(a, b) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 文字列として渡された2つの数値をパースし、割り算した結果を分かりやすい文字列で返す。
 * @param {string} aStr - 割られる数(文字列)
 * @param {string} bStr - 割る数(文字列)
 * @returns {string} "計算結果: <値>" または "エラー: <メッセージ>" という形式の文字列
 */
function parseAndDivide(aStr, bStr) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { ValidationError, safeDivide, parseAndDivide };
