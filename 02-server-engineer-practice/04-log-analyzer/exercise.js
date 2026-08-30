// 演習: ログ解析ミニプロジェクト
//
// このファイルでは、以下の2つの関数を実装してください。
//
// 1. parseLine(line)
//    1行分のログ文字列をパースして、
//    { timestamp, method, path, status, durationMs } という形のオブジェクトを返す。
//    行の形式に一致しない(不正な)行を渡された場合は null を返す。
//
// 2. analyze(logText)
//    複数行のログ文字列(1行ずつ改行 \n で区切られたもの)を受け取り、
//    { totalRequests, byStatus, averageDurationMs } という形のオブジェクトを返す。
//
// この章で扱うログの形式は次の通りです(詳しくはREADME.mdを参照してください)。
//   2026-08-30T10:15:00Z GET /api/users 200 42ms
//   (ISO8601形式の日時) (HTTPメソッド) (パス) (ステータスコード、3桁) (レスポンスタイム)ms
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * 1行分のログをパースする。
 * @param {string} line - パースしたい1行のログ文字列
 * @returns {{timestamp: string, method: string, path: string, status: number, durationMs: number} | null}
 *   パースに成功した場合はオブジェクト、行の形式に合わない場合は null
 */
function parseLine(line) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 複数行のログ文字列をまとめて集計する。
 * @param {string} logText - 複数行のログ文字列(改行区切り)
 * @returns {{totalRequests: number, byStatus: Object<string, number>, averageDurationMs: number}}
 *   totalRequests: パースできた行の総数
 *   byStatus: ステータスコード(文字列)ごとの件数
 *   averageDurationMs: パースできた行のレスポンスタイムの平均値(有効な行が0件のときは0)
 */
function analyze(logText) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { parseLine, analyze };
