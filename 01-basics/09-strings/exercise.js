// 演習: 文字列操作
//
// このファイルでは、以下の7つの関数を実装してください。
//
// 1. formatGreeting(name, time)
//    name(ユーザー名)と time(0〜23の時刻)を受け取り、
//    テンプレートリテラルを使って時間帯に応じた挨拶文を返す。
//
// 2. parseCsvLine(line)
//    カンマ区切りの1行の文字列を受け取り、split と trim を使って
//    各項目の前後の空白を取り除いた配列を返す。
//
// 3. joinWithComma(items)
//    文字列の配列を受け取り、join を使って ", " でつなげた文字列を返す。
//
// 4. emphasizeAlert(message)
//    メッセージを受け取り、toUpperCase で大文字にし、
//    末尾に "!!!" を付け足した文字列を返す。
//
// 5. maskSensitiveWord(text, target)
//    text の中に target が含まれていれば、includes で確認したうえで
//    replaceAll を使い、target と同じ文字数の "*" に置き換えて返す。
//    含まれていない、または target が空文字列の場合は text をそのまま返す。
//
// 6. isValidEmailFormat(email)
//    正規表現の test を使って、メールアドレスらしい形式かどうかを判定する。
//    (本格的なバリデーションではない、簡易チェックであることに注意)
//
// 7. extractIpAddresses(text)
//    正規表現の match を使って、IPアドレスらしき文字列をすべて抜き出す。
//    見つからない場合は空配列を返す。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * 時刻に応じた挨拶文を作って返す。
 * @param {string} name - ユーザー名
 * @param {number} time - 0〜23の時刻
 * @returns {string} 時間帯に応じた挨拶文
 */
function formatGreeting(name, time) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * カンマ区切りの1行を、トリム済みの配列に変換する。
 * @param {string} line - カンマ区切りの1行の文字列
 * @returns {string[]} 前後の空白を取り除いた項目の配列
 */
function parseCsvLine(line) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 文字列の配列を ", " でつなげた1つの文字列にする。
 * @param {string[]} items - 文字列の配列
 * @returns {string} ", " でつなげた文字列
 */
function joinWithComma(items) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * アラートメッセージを大文字にして強調する。
 * @param {string} message - アラートメッセージ
 * @returns {string} 大文字化して "!!!" を付け足した文字列
 */
function emphasizeAlert(message) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * text の中に含まれる target を、同じ文字数の "*" でマスクする。
 * @param {string} text - 対象の文字列
 * @param {string} target - マスクしたい文字列
 * @returns {string} マスク後の文字列(該当がなければ text のまま)
 */
function maskSensitiveWord(text, target) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * メールアドレスらしい形式かどうかを簡易的に判定する。
 * (本格的なバリデーションではない)
 * @param {string} email - 判定したい文字列
 * @returns {boolean} メールアドレスらしい形式なら true
 */
function isValidEmailFormat(email) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 文字列の中からIPアドレスらしき部分をすべて抜き出す。
 * (本格的なバリデーションではない)
 * @param {string} text - 検索対象の文字列
 * @returns {string[]} 見つかったIPアドレスらしき文字列の配列(なければ空配列)
 */
function extractIpAddresses(text) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = {
  formatGreeting,
  parseCsvLine,
  joinWithComma,
  emphasizeAlert,
  maskSensitiveWord,
  isValidEmailFormat,
  extractIpAddresses,
};
