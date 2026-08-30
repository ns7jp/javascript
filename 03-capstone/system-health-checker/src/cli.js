#!/usr/bin/env node
// src/cli.js
//
// このファイルが「システムヘルスチェッカー」の入り口(エントリーポイント)です。
// 実際に行っていることは次の4ステップだけです。
//   1. services.config.json を読み込む
//   2. checker.js でチェックを実行する
//   3. 結果をターミナルに見やすく表示する
//   4. logger.js でログファイルに保存する
// 「チェックする(checker.js)」「記録する(logger.js)」というコアロジックは
// すでに別ファイルに切り出してあるので、このファイルは
// 「それらをどんな順番で呼び出すか」という進行役に徹しています。
// こうしておくと、コアロジック側は自動テスト(test/checker.test.js)で検証しつつ、
// このファイルは「実際に動かしたときの見た目」だけに集中できます。

const fs = require('node:fs');
const path = require('node:path');
const { checkAll } = require('./checker');
const { writeLogFile } = require('./logger');

// このモジュール(03-capstone/system-health-checker/)のルートディレクトリです。
// __dirname は「このファイル(cli.js)が置かれているディレクトリ」を表すNode.jsの特殊変数なので、
// そこから1つ上の階層(src/の親)を指すことで、実行時のカレントディレクトリ(cwd)に関係なく
// 常に同じ場所を指せるようにしています。
const moduleRootDir = path.join(__dirname, '..');
const configFilePath = path.join(moduleRootDir, 'services.config.json');
const logsDir = path.join(moduleRootDir, 'logs');

/**
 * このツールの本体処理です。
 * 「設定を読む → チェックする → 表示する → ログに残す」という一連の流れをまとめています。
 */
function runHealthCheck() {
  // ステップ1: 設定ファイルを読み込む
  // fs.readFileSync は「ファイルを最後まで読み終えるまで次の行に進まない」同期処理です。
  // CLIツールは基本的に「上から下に順番に処理が進めば十分」なことが多いため、
  // 非同期(async/await)を使わずシンプルに書いています。
  const configText = fs.readFileSync(configFilePath, 'utf8');
  const services = JSON.parse(configText);

  // services.config.json の target は「このモジュールディレクトリからの相対パス」として書く
  // 決まりにしています。そのままだと実行時のカレントディレクトリ次第で挙動が変わってしまうため、
  // ここで絶対パスに変換してからcheckAllに渡します。
  // (checker.js自体はパスの意味を知らず、渡された文字列をそのままfs.existsSyncに渡すだけです)
  const resolvedServices = services.map((service) => ({
    ...service,
    target: path.resolve(moduleRootDir, service.target),
  }));

  // ステップ2: 全サービスをチェックする
  const results = checkAll(resolvedServices);

  // ステップ3: 結果をターミナルに見やすく表示する
  // 絵文字は使わず、"[UP]" / "[NG]" という文字ラベルで視覚的に区別できるようにしています。
  // (サーバーのターミナル環境によっては絵文字が正しく表示されないことがあるため、
  //  実務のCLIツールでは文字だけで状態が伝わるようにしておくのが安全です)
  console.log('=== システムヘルスチェック ===');
  for (const result of results) {
    const label = result.status === 'UP' ? '[UP]' : '[NG]';
    console.log(`${label} ${result.name} (checked at ${result.checkedAt})`);
  }

  const downCount = results.filter((result) => result.status === 'DOWN').length;
  const upCount = results.length - downCount;
  console.log(`--- 合計: ${results.length}件中 UP=${upCount} / DOWN=${downCount} ---`);

  // ステップ4: ログファイルに保存する
  const writtenLogPath = writeLogFile(results, logsDir);
  console.log(`ログファイルを書き出しました: ${writtenLogPath}`);

  // 1件でもDOWNがあれば、プロセスの終了コードを1(異常終了)にします。
  // 終了コード(exit code)とは、プログラムが終わったときにOSへ返す小さな数字のことで、
  // 0は「正常終了」、0以外は「何らかの異常があった」ことを意味する慣習があります。
  // 監視ツールやCI(継続的インテグレーション)のパイプラインは、この終了コードを見て
  // 「後続処理を止めるべきか」「アラートを飛ばすべきか」を自動的に判断します。
  // console.logの文字だけでは自動化された仕組みに異常を伝えられないため、
  // サーバー運用の現場では「終了コードで異常を知らせる」設計がとても重要になります。
  if (downCount > 0) {
    process.exit(1);
  }
}

// require.main === module は「このファイルが直接 `node cli.js` として実行されたときだけ true」
// になる書き方です。他のファイル(例えばテストコード)からrequireで読み込んだだけのときは
// falseになるため、テストの中でうっかりprocess.exit(1)が呼ばれてテストごと落ちてしまう、
// といった副作用を防げます。
if (require.main === module) {
  runHealthCheck();
}

module.exports = { runHealthCheck };
