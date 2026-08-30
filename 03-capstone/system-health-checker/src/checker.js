// src/checker.js
//
// 「サービスが生きているかどうか」を実際にチェックする、このツールの中心となるロジックです。
// ここには「ファイルを読み込んで表示する」「ログに書き出す」といった処理は一切書きません。
// チェックのロジックだけを独立させておくことで、
//   - CLI(コマンドライン)から呼び出しても
//   - テストコードから直接呼び出しても
// 同じ結果になることが保証され、テストがとても書きやすくなります。
// (これは 02-server-engineer-practice/02-cli-tool で学んだ「コアロジックとCLIの分離」と同じ考え方です)

const fs = require('node:fs');

// このツールが対応している「チェックの種類(type)」の一覧です。
// 今後 type を増やすときは、ここにも追記しておくと「対応表」として分かりやすくなります。
//   - "file" : 指定したパスのファイル(またはディレクトリ)が存在するかどうかを確認する
const SUPPORTED_TYPES = ['file'];

/**
 * 1つのサービス定義を受け取り、実際にチェックを行って結果オブジェクトを返します。
 *
 * @param {{ name: string, type: string, target: string }} service
 *   チェック対象の情報。
 *   - name   : サービスの名前(ログや画面表示に使う人間向けの名前)
 *   - type   : チェックの種類。現時点では "file" のみ対応
 *   - target : チェック対象を指し示す文字列(type: "file" の場合はファイルパス)
 * @returns {{ name: string, status: "UP" | "DOWN", checkedAt: string }}
 *   - status    : 生きていれば "UP"、死んでいれば(異常であれば) "DOWN"
 *   - checkedAt : いつチェックしたかを表すISO 8601形式の日時文字列
 */
function checkService(service) {
  const { name, type, target } = service;

  // まず、対応していない type が来た場合はここで気づけるようにします。
  // 「サイレントに何も起きない」よりも「はっきりエラーで教えてくれる」方が、
  // 運用ツールとしては安全です(気づかないまま監視が機能していない、という事故を防げます)。
  if (!SUPPORTED_TYPES.includes(type)) {
    throw new Error(
      `未対応のチェック種別です: "${type}"(サービス名: "${name}")。` +
        `対応している種別は ${SUPPORTED_TYPES.map((t) => `"${t}"`).join(', ')} のみです。`
    );
  }

  // 現時点では type は "file" しかありませんが、
  // 将来 type が増えたときに困らないよう if文で分岐する形にしています。
  let isUp = false;
  if (type === 'file') {
    // fs.existsSync は「指定したパスにファイル(またはディレクトリ)が存在するかどうか」を
    // 同期的(処理が終わるまで次の行に進まない方式)に真偽値で返してくれる関数です。
    // 本来 fs.existsSync は「存在確認だけして後で使おうとすると、その間に消えているかもしれない」
    // という競合状態(レースコンディション)の弱点がありますが、
    // 今回のような「単純な死活チェック」の用途では十分にシンプルで実用的です。
    isUp = fs.existsSync(target);
  }

  return {
    name,
    status: isUp ? 'UP' : 'DOWN',
    // new Date().toISOString() は「いつ実行したか」を誰が見ても一意に分かる形式で記録するためのものです。
    // 例: "2026-08-30T03:15:00.000Z" のような文字列になります。
    checkedAt: new Date().toISOString(),
  };
}

/**
 * 複数のサービス定義をまとめてチェックします。
 *
 * @param {Array<{ name: string, type: string, target: string }>} services
 * @returns {Array<{ name: string, status: "UP" | "DOWN", checkedAt: string }>}
 *   services と同じ順番・同じ件数の結果配列
 */
function checkAll(services) {
  // Array.prototype.map は「配列の各要素を1つずつ関数に渡し、
  // その戻り値を集めた新しい配列を作る」メソッドです。
  // for文で1件ずつpushしていくのと結果は同じですが、
  // 「入力の配列と同じ形の配列を作る」という意図がひと目で伝わるため、
  // ここではmapを使っています。
  return services.map((service) => checkService(service));
}

module.exports = { checkService, checkAll };
