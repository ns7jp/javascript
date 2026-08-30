/**
 * 解答例: 変数とデータ型
 *
 * README.md の解説と合わせて読んでください。
 */

// describeType: 値のtypeofの結果を、日本語の説明文にして返す関数
function describeType(value) {
  // なぜこう書くのか:
  // typeof演算子は値の型を文字列として返してくれる。
  // その結果をそのままテンプレートリテラルに埋め込むことで、
  // どんな型が来ても同じロジックで説明文を組み立てられる。
  // (例: "number" が返ってきたら "これはnumber型です" になる)
  const typeName = typeof value;
  return `これは${typeName}型です`;
}

// sumSafely: 2つの引数が両方numberであることを確認してから足し算する関数
function sumSafely(a, b) {
  // なぜこう書くのか:
  // JavaScriptでは "2" + 3 のように、文字列と数値を+演算子で
  // 混ぜてしまうと、意図しない文字列連結（"23"のような結果）が
  // 起きてしまう。これを防ぐため、計算する前に
  // typeofで両方の引数がnumber型であるかどうかを確認し、
  // 型が違う場合は早めにエラーを投げる（=呼び出し側にすぐ気づかせる）。
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('sumSafelyには数値を渡してください');
  }
  return a + b;
}

module.exports = { describeType, sumSafely };
