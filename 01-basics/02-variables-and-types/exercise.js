/**
 * 演習: 変数とデータ型
 *
 * このファイルでは、次の2つの関数を実装します。
 *
 * 1. describeType(value)
 *    - 引数 value（どんな型の値でも良い）を受け取り、
 *      typeof value の結果を使って "これは<型名>型です" という
 *      日本語の文字列を返す
 *    - 例: describeType(25) => "これはnumber型です"
 *    - 例: describeType('こんにちは') => "これはstring型です"
 *
 * 2. sumSafely(a, b)
 *    - 引数 a と b の両方が number 型であれば、a + b を返す
 *    - どちらか一方でも number 型でなければ、
 *      意味の分かるメッセージを持った Error を throw する
 *    - 例: sumSafely(2, 3) => 5
 *    - 例: sumSafely('2', 3) => エラーがthrowされる
 *
 * 実装が終わったら、ターミナルで次のコマンドを実行してテストを確認してください。
 *   node --test 01-basics/02-variables-and-types
 */

function describeType(value) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

function sumSafely(a, b) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { describeType, sumSafely };
