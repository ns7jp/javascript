// 解答例: 演算子と型変換
//
// README.md の解説と合わせて読んでください。

/**
 * a と b を === (厳密等価演算子) で比較した結果を返す。
 * @param {*} a - 比較したい値1
 * @param {*} b - 比較したい値2
 * @returns {boolean} a === b の結果
 */
function isStrictlyEqual(a, b) {
  // なぜ === を使うのか:
  // == は比較の前に暗黙の型変換を行ってしまい、
  // 「型が違うのに true になる」という直感に反する結果を生みやすい。
  // === は型変換を一切行わないため、意図通りの比較結果を確実に得られる。
  return a === b;
}

/**
 * value を数値に変換する。変換できなければ null を返す。
 * @param {*} value - 数値に変換したい値
 * @returns {number|null} 変換できた場合は数値、できなければ null
 */
function coerceToNumber(value) {
  // まず Number() で変換を試みる。
  // Number() は文字列・真偽値・null・undefined など、様々な型を
  // 数値に変換しようとしてくれる組み込み関数。
  const converted = Number(value);

  // なぜ `converted === NaN` で判定しないのか:
  // NaN は「自分自身とも等しくない」という特殊な値のため、
  // NaN === NaN は常に false になってしまい、この書き方では判定できない。
  // 代わりに専用の判定関数 Number.isNaN() を使う必要がある。
  if (Number.isNaN(converted)) {
    // 呼び出し側が「変換に失敗した」ことを明確に扱えるように、
    // 扱いにくい NaN のままではなく、null という分かりやすい値で失敗を表す。
    return null;
  }

  return converted;
}

module.exports = { isStrictlyEqual, coerceToNumber };
