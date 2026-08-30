// 演習: JSON操作
//
// このファイルでは、以下の3つの関数を実装してください。
//
// 1. toPrettyJson(obj)
//    オブジェクトを、見やすく整形された(インデント2文字の)JSON文字列に変換する。
//
// 2. parseJsonSafely(jsonString)
//    JSON文字列をパースしてオブジェクトに変換する。失敗したら例外を投げずにnullを返す。
//
// 3. mergeConfigFromJson(baseObject, overrideJsonString)
//    overrideJsonStringをパースし、baseObjectにスプレッド構文でマージした
//    新しいオブジェクトを返す。パースに失敗した場合は分かりやすいエラーをthrowする。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * オブジェクトを、見やすく整形された(インデント2文字の)JSON文字列に変換する。
 * @param {*} obj - JSON文字列に変換したい値(オブジェクトや配列など)
 * @returns {string} インデント2文字で整形されたJSON文字列
 */
function toPrettyJson(obj) {
  // TODO: ここに実装してください
  // ヒント: JSON.stringify(obj, null, 2) を使う
  throw new Error('未実装です');
}

/**
 * JSON文字列を安全にパースする。失敗した場合は例外を投げずにnullを返す。
 * @param {string} jsonString - パースしたいJSON文字列
 * @returns {*} パースに成功した場合はその値、失敗した場合はnull
 */
function parseJsonSafely(jsonString) {
  // TODO: ここに実装してください
  // ヒント: try/catchでJSON.parseを囲み、catchブロックでnullを返す
  throw new Error('未実装です');
}

/**
 * baseObjectに、overrideJsonStringをパースした内容をマージした新しいオブジェクトを返す。
 * overrideJsonStringが不正なJSONの場合は、分かりやすいメッセージのエラーをthrowする。
 * @param {object} baseObject - 基本となる設定オブジェクト
 * @param {string} overrideJsonString - 上書きしたい設定が入ったJSON文字列
 * @returns {object} baseObjectとパース結果をマージした新しいオブジェクト
 */
function mergeConfigFromJson(baseObject, overrideJsonString) {
  // TODO: ここに実装してください
  // ヒント: JSON.parseをtry/catchで囲み、失敗したら
  //         new Error('設定のJSONが不正です: ' + error.message) をthrowする
  //         成功したら { ...baseObject, ...パース結果 } を返す
  throw new Error('未実装です');
}

module.exports = { toPrettyJson, parseJsonSafely, mergeConfigFromJson };
