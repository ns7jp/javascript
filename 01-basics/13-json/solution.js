// 解答例: JSON操作
//
// README.md の解説と合わせて読んでください。

/**
 * オブジェクトを、見やすく整形された(インデント2文字の)JSON文字列に変換する。
 * @param {*} obj - JSON文字列に変換したい値(オブジェクトや配列など)
 * @returns {string} インデント2文字で整形されたJSON文字列
 */
function toPrettyJson(obj) {
  // なぜ第3引数に2を渡すのか:
  // JSON.stringifyは、第3引数(space)を省略すると1行にまとめた文字列を返す。
  // ログファイルや設定ファイルに保存する際、人間が読みやすいように
  // インデント(字下げ)を付けたい場合が多いため、ここでは半角スペース2つ分の
  // インデントを指定している。第2引数(replacer)は今回使わないためnullを渡す。
  return JSON.stringify(obj, null, 2);
}

/**
 * JSON文字列を安全にパースする。失敗した場合は例外を投げずにnullを返す。
 * @param {string} jsonString - パースしたいJSON文字列
 * @returns {*} パースに成功した場合はその値、失敗した場合はnull
 */
function parseJsonSafely(jsonString) {
  // なぜtry/catchで囲むのか:
  // JSON.parseは、渡された文字列が正しいJSONの形式でない場合、
  // SyntaxError(構文エラー)をthrowする。設定ファイルやAPIのレスポンスなど、
  // 外部から来る文字列は必ずしも正しい形式とは限らないため、
  // エラーが起きてもプログラム全体が止まらないよう、ここで受け止めている。
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // 失敗した場合は「呼び出し側が扱いやすい」ようにnullを返す設計にしている。
    // こうしておくことで、呼び出し側は if (result === null) だけで
    // 失敗を判定でき、try/catchを毎回書かずに済む。
    return null;
  }
}

/**
 * baseObjectに、overrideJsonStringをパースした内容をマージした新しいオブジェクトを返す。
 * overrideJsonStringが不正なJSONの場合は、分かりやすいメッセージのエラーをthrowする。
 * @param {object} baseObject - 基本となる設定オブジェクト
 * @param {string} overrideJsonString - 上書きしたい設定が入ったJSON文字列
 * @returns {object} baseObjectとパース結果をマージした新しいオブジェクト
 */
function mergeConfigFromJson(baseObject, overrideJsonString) {
  let overrideObject;

  try {
    overrideObject = JSON.parse(overrideJsonString);
  } catch (error) {
    // なぜここでエラーメッセージを作り直すのか:
    // JSON.parseが投げるSyntaxErrorのメッセージ(例: "Unexpected token ...")は、
    // JavaScriptの内部的な表現であり、設定ファイルを書いた人にとっては
    // 何が問題なのか分かりにくい。そこで「これは設定のJSONが原因のエラーである」
    // ということが一目で分かるように、独自のメッセージを付けたErrorに包んで
    // (元のエラーメッセージも残しつつ)投げ直している。
    throw new Error(`設定のJSONが不正です: ${error.message}`);
  }

  // なぜスプレッド構文でマージするのか:
  // { ...baseObject, ...overrideObject } と書くと、baseObjectのプロパティを
  // すべて展開したあとに、overrideObjectのプロパティを展開して上書きする。
  // 後から展開した方が優先されるというルールにより、
  // 「基本設定 + 環境ごとの上書き設定」という組み合わせを1行で表現できる。
  // なお、baseObject自体は変更されず、常に新しいオブジェクトが作られる点にも注意。
  return { ...baseObject, ...overrideObject };
}

module.exports = { toPrettyJson, parseJsonSafely, mergeConfigFromJson };
