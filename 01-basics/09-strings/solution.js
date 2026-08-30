// 解答例: 文字列操作
//
// README.md の解説と合わせて読んでください。

/**
 * 時刻に応じた挨拶文を作って返す。
 * @param {string} name - ユーザー名
 * @param {number} time - 0〜23の時刻
 * @returns {string} 時間帯に応じた挨拶文
 */
function formatGreeting(name, time) {
  // なぜ if / else if / else で時間帯を分けるのか:
  // 「朝(5〜11時)」「昼(12〜17時)」「それ以外(18〜4時)」の3つに分岐させたいので、
  // まず greetingWord に入れる文字列だけを決めてから、
  // 最後にテンプレートリテラルでまとめて組み立てている。
  // こうすることで「文字列の組み立て方」と「時間帯の判定ロジック」を分離でき、
  // 読みやすいコードになる。
  let greetingWord;
  if (time >= 5 && time < 12) {
    greetingWord = 'おはようございます';
  } else if (time >= 12 && time < 18) {
    greetingWord = 'こんにちは';
  } else {
    greetingWord = 'こんばんは';
  }

  // テンプレートリテラルを使うと、+ による文字列連結よりも
  // 「どこに変数が入るか」が一目で分かりやすいコードになる。
  return `${greetingWord}、${name}さん!`;
}

/**
 * カンマ区切りの1行を、トリム済みの配列に変換する。
 * @param {string} line - カンマ区切りの1行の文字列
 * @returns {string[]} 前後の空白を取り除いた項目の配列
 */
function parseCsvLine(line) {
  // なぜ split の後に map で trim するのか:
  // split(",") だけでは、区切り文字の前後にあるスペースがそのまま残ってしまう
  // (例: "web01, 192.168.1.10 " → " 192.168.1.10 " のように前後に空白が残る)。
  // そこで map を使い、分割した各項目それぞれに trim() を適用することで、
  // 全ての項目からきれいに空白を取り除いている。
  return line.split(',').map((field) => field.trim());
}

/**
 * 文字列の配列を ", " でつなげた1つの文字列にする。
 * @param {string[]} items - 文字列の配列
 * @returns {string} ", " でつなげた文字列
 */
function joinWithComma(items) {
  // なぜ join(", ") なのか:
  // join の引数を省略すると "," (スペースなし)で連結されてしまい、
  // 人が読んだときに見づらくなる。区切り文字を明示的に ", " と指定することで、
  // 意図がコードを読むだけで伝わるようにしている。
  // 空配列の場合は join しても "" (空文字列)になる。
  return items.join(', ');
}

/**
 * アラートメッセージを大文字にして強調する。
 * @param {string} message - アラートメッセージ
 * @returns {string} 大文字化して "!!!" を付け足した文字列
 */
function emphasizeAlert(message) {
  // toUpperCase() で英字を全て大文字に変換し、
  // テンプレートリテラルで末尾に "!!!" を付け足すことで、
  // 「緊急性の高いメッセージ」らしい見た目にしている。
  return `${message.toUpperCase()}!!!`;
}

/**
 * text の中に含まれる target を、同じ文字数の "*" でマスクする。
 * @param {string} text - 対象の文字列
 * @param {string} target - マスクしたい文字列
 * @returns {string} マスク後の文字列(該当がなければ text のまま)
 */
function maskSensitiveWord(text, target) {
  // なぜ最初に target === '' をチェックするのか:
  // replaceAll('', mask) は「文字と文字の間すべて」にマッチしてしまい、
  // 意図しない結果(例: "abc" → "-a-b-c-")になってしまう。
  // これを防ぐため、target が空文字列の場合は何もせず text をそのまま返す。
  //
  // なぜ includes で事前にチェックするのか:
  // target が text に含まれていない場合、そもそもマスクする必要がない。
  // includes を使うことで「置換が必要かどうか」を明確に判定できる。
  if (target === '' || !text.includes(target)) {
    return text;
  }

  // target と同じ文字数の "*" を作り(例: "abc" なら "***")、
  // replaceAll で該当箇所を全て置き換える。
  const mask = '*'.repeat(target.length);
  return text.replaceAll(target, mask);
}

// メールアドレスらしい形式かどうかを判定する正規表現。
// 「空白でも@でもない文字が1文字以上」+ "@" + 「空白でも@でもない文字が1文字以上」
// + "." + 「空白でも@でもない文字が1文字以上」という並びを表している。
// あくまで簡易チェックであり、本格的なバリデーションではない。
const emailFormatPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * メールアドレスらしい形式かどうかを簡易的に判定する。
 * (本格的なバリデーションではない)
 * @param {string} email - 判定したい文字列
 * @returns {boolean} メールアドレスらしい形式なら true
 */
function isValidEmailFormat(email) {
  // test() は「パターンに合っているかどうか」だけを true/false で返してくれる。
  // 正規表現オブジェクトを関数の外(モジュールの先頭)で定義しているのは、
  // 関数を呼び出すたびに毎回同じパターンを作り直す無駄を避けるため。
  return emailFormatPattern.test(email);
}

// IPアドレスらしき部分を探すための正規表現。
// \d{1,3} は「1〜3桁の数字」を意味し、それが "." を挟んで4つ並ぶパターンを表す。
// gフラグを付けることで、最初の1つだけでなく、見つかった全ての部分を取得できる。
// 注意: 999.999.999.999 のような実在しない値にもマッチしてしまう簡易的なパターン。
const ipAddressPattern = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;

/**
 * 文字列の中からIPアドレスらしき部分をすべて抜き出す。
 * (本格的なバリデーションではない)
 * @param {string} text - 検索対象の文字列
 * @returns {string[]} 見つかったIPアドレスらしき文字列の配列(なければ空配列)
 */
function extractIpAddresses(text) {
  // なぜ ipAddressPattern を関数の中で使い回すのか:
  // gフラグ付きの正規表現はモジュール内で共有すると内部状態(lastIndex)が
  // 呼び出しをまたいで残ってしまう場合があるが、match() メソッドは
  // 呼び出しのたびに正規表現の lastIndex を自動的に0にリセットしてくれるため、
  // ここでは安全に使い回すことができる。
  //
  // なぜ null チェックが必要なのか:
  // match() は1つもマッチしなかった場合、空配列ではなく null を返す。
  // そのまま呼び出し元に null を返すと、呼び出し側で .length などを
  // 呼び出したときにエラーになってしまうため、ここで空配列に変換している。
  const matches = text.match(ipAddressPattern);
  return matches ? matches : [];
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
