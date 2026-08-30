// 演習: 簡易HTTPサーバーの構築
//
// このファイルでは、以下の1つの関数を実装してください。
//
// 1. createServer()
//    http.createServer() を使ってHTTPサーバーを作り、
//    (listen() は呼ばずに) Serverインスタンスをそのまま返す。
//    ルーティングの仕様は以下の通り。
//      - GET /       -> ステータス200、JSONで { message: "..." } を返す
//      - GET /health -> ステータス200、JSONで { status: "ok" } を返す
//      - それ以外     -> ステータス404、JSONで { error: "Not Found" } を返す
//    どのレスポンスも Content-Type: application/json; charset=utf-8 にすること。
//
// CLI(コマンドライン)部分(ファイルの下の方にある if (require.main === module) の中身)は
// あらかじめ実装済みです。createServer を実装し終えたら、
// 実際にターミナルから `node exercise.js` のように実行して、
// 自分の実装がどう動くか確認してみましょう。
//
// 詳しい仕様や具体例は README.md を確認してください。

const http = require('node:http');

/**
 * HTTPサーバーを作って返す(まだ listen() はしない)。
 * @returns {import('node:http').Server} listenする前のHTTPサーバー
 */
function createServer() {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * CLIとして実行されたときの処理をまとめた関数。
 * (この関数は実装済みです。変更しなくてもテストは通ります)
 */
function runCli() {
  const server = createServer();
  const port = 3000;

  server.listen(port, () => {
    console.log(`サーバーが起動しました: http://localhost:${port}`);
    console.log('以下のURLにブラウザやcurlでアクセスしてみましょう:');
    console.log(`  http://localhost:${port}/`);
    console.log(`  http://localhost:${port}/health`);
    console.log('終了するには Ctrl+C を押してください。');
  });
}

if (require.main === module) {
  runCli();
}

module.exports = { createServer };
