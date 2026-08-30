// 解答例: ログ解析ミニプロジェクト
//
// README.md の解説と合わせて読んでください。

// --- ログ1行の形式を表す正規表現 ---
//
// この章で扱うログの形式は次の通り(各項目は半角スペース1つで区切られている)。
//   2026-08-30T10:15:00Z GET /api/users 200 42ms
//
// 正規表現の各部分の意味:
//   ^                                  : 行の先頭
//   (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) : ISO8601形式の日時(例: 2026-08-30T10:15:00Z)
//   ([A-Z]+)                           : HTTPメソッド(GETやPOSTなど、大文字のアルファベット)
//   (\/\S*)                            : "/"で始まる、空白を含まないパス
//   (\d{3})                            : ちょうど3桁の数字(ステータスコード)
//   (\d+)ms                            : 1文字以上の数字のあとに"ms"が続く(レスポンスタイム)
//   $                                  : 行の末尾
// カッコ ( ) で囲んだ部分は「キャプチャグループ」と呼ばれ、
// match() を使ったときにその部分だけを個別に取り出せるようになる。
const LOG_LINE_PATTERN = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) ([A-Z]+) (\/\S*) (\d{3}) (\d+)ms$/;

/**
 * 1行分のログをパースする。
 *
 * なぜnullを返す設計にするのか:
 * ログファイルには、途中でフォーマットが崩れた行や、空行が混ざっていることが
 * 実際の現場でもよくある。そのたびにエラーをthrowしてプログラム全体を
 * 止めてしまうと、「1行おかしいだけで集計処理全体が動かなくなる」という
 * 使いにくい実装になってしまう。そこで、「パースできなかった行はnullを返す」
 * というルールにしておき、呼び出し側(analyze関数)でnullを除外できるようにする。
 *
 * @param {string} line - パースしたい1行のログ文字列
 * @returns {{timestamp: string, method: string, path: string, status: number, durationMs: number} | null}
 *   パースに成功した場合はオブジェクト、行の形式に合わない場合は null
 */
function parseLine(line) {
  // 文字列以外が渡された場合は、そもそもパースのしようがないのでnullを返す。
  if (typeof line !== 'string') {
    return null;
  }

  // 行の前後にある空白(スペースや、Windows形式の改行に含まれる\rなど)を取り除く。
  // trim()しておかないと、例えば行末に\rが残っている場合に
  // 正規表現の$(行末)にうまくマッチしなくなってしまう。
  const trimmedLine = line.trim();

  // 空行(トリムした結果が空文字列になる行)も「有効なログ行ではない」として扱う。
  if (trimmedLine === '') {
    return null;
  }

  // String.prototype.match() は、正規表現にマッチしなかった場合 null を返す。
  // マッチした場合は、match[0]に「マッチした文字列全体」、
  // match[1]以降に「各キャプチャグループの中身」が入った配列風のオブジェクトが返る。
  const match = trimmedLine.match(LOG_LINE_PATTERN);

  if (match === null) {
    return null;
  }

  // 分割代入(destructuring)を使って、match配列からキャプチャグループを取り出す。
  // match[0](マッチした文字列全体)は使わないので、先頭のカンマだけを書いて読み飛ばしている。
  const [, timestamp, method, path, statusText, durationText] = match;

  return {
    timestamp,
    method,
    path,
    // 正規表現でマッチした時点では、statusTextやdurationTextはまだ「数字だけの文字列」であり、
    // 数値(number)型ではない。Number()で明示的に変換しないと、
    // 呼び出し側で足し算をしたときに文字列の連結("200" + "1" が "2001"になる等)が
    // 起きてしまうため、ここで必ず変換しておく。
    status: Number(statusText),
    durationMs: Number(durationText),
  };
}

/**
 * 複数行のログ文字列をまとめて集計する。
 *
 * この関数は、配列操作の3点セットである map・filter・reduce を組み合わせて実装する。
 *   1. split('\n')  : ログ文字列を1行ずつの配列に分割する
 *   2. map()         : 各行をparseLineでパースし、オブジェクトまたはnullの配列にする
 *   3. filter()      : nullを取り除き、パースに成功した行だけを残す
 *   4. reduce()       : 残った行を1つずつ集計していく
 *
 * @param {string} logText - 複数行のログ文字列(改行区切り)
 * @returns {{totalRequests: number, byStatus: Object<string, number>, averageDurationMs: number}}
 */
function analyze(logText) {
  if (typeof logText !== 'string') {
    throw new TypeError('logText は文字列である必要があります');
  }

  // 1行ずつパースし、パースできた行(nullでない行)だけを残す。
  // 不正な行が混ざっていても、その行だけを無視して集計を続けられるのが
  // parseLineがnullを返す設計にしてある理由である。
  const parsedEntries = logText
    .split('\n')
    .map((line) => parseLine(line))
    .filter((entry) => entry !== null);

  const totalRequests = parsedEntries.length;

  // reduce()を使って、ステータスコードごとの件数を1つのオブジェクトにまとめていく。
  // reduceの第2引数 {} は「集計を始める前の初期値」であり、
  // 各要素(entry)を処理するたびに、それまでの集計結果(counts)を更新して返していく。
  const byStatus = parsedEntries.reduce((counts, entry) => {
    // オブジェクトのキーはJavaScriptでは自動的に文字列へ変換されるが、
    // 「集計結果のキーは文字列である」という意図を明確にするため、
    // String()で明示的に変換しておく。
    const statusKey = String(entry.status);
    counts[statusKey] = (counts[statusKey] || 0) + 1;
    return counts;
  }, {});

  // 全リクエストのレスポンスタイムの合計を求めてから、件数で割って平均を出す。
  const totalDurationMs = parsedEntries.reduce((sum, entry) => sum + entry.durationMs, 0);

  // なぜtotalRequestsが0のときを特別扱いするのか:
  // 有効な行が1つもない場合、totalDurationMs / totalRequests は 0 / 0 となり、
  // JavaScriptでは数値として意味を持たない NaN(Not a Number)になってしまう。
  // 呼び出し側が意図せずNaNを受け取って混乱しないよう、ここで明示的に0を返す。
  const averageDurationMs = totalRequests === 0 ? 0 : totalDurationMs / totalRequests;

  return { totalRequests, byStatus, averageDurationMs };
}

module.exports = { parseLine, analyze };
