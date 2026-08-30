// 解答例: 簡易HTTPサーバーの構築
//
// README.md の解説と合わせて読んでください。

const http = require('node:http');

/**
 * HTTPサーバーを作って返す(まだ listen() はしない)。
 *
 * なぜ listen() をこの関数の中で呼ばないのか:
 * listen() を呼んでしまうと、この関数を呼び出した瞬間に実際のポートが
 * 使われ始めてしまい、テストのたびに「毎回同じポート番号が衝突しないか」を
 * 気にする必要が出てくる。そこでこの関数では http.createServer() で
 * Server インスタンスを作るところまでを担当し、実際に listen する
 * (=ポートを使い始める)かどうかは呼び出し側に任せている。
 * これにより、テストコード側で `server.listen(0)` (0番を指定すると、
 * OSが自動的に空いているポート番号を割り当ててくれる)として、
 * 他のテストと衝突しない安全なポートで検証できるようになる。
 *
 * @returns {import('node:http').Server} listenする前のHTTPサーバー
 */
function createServer() {
  const server = http.createServer((req, res) => {
    // req.method には 'GET' や 'POST' などのHTTPメソッドが入っている。
    const { method } = req;

    // req.url には、パス(例: "/health")だけでなく、
    // クエリ文字列(例: "?page=2")まで含まれた文字列が入っている。
    // new URL() を使うことで、パス部分(pathname)だけを安全に取り出せる。
    // 第2引数のベースURLは今回使わないが、URLコンストラクタの仕様上、
    // 完全なURLを組み立てるために必要なので、ホスト名は仮の値を渡している。
    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = requestUrl.pathname;

    // このサーバーはJSON(JavaScript Object Notation、データをやり取りするための
    // 軽量なテキスト形式)だけを返すAPIサーバーなので、
    // すべてのレスポンスで共通のContent-Type(レスポンスの中身が何の形式かを
    // 伝えるヘッダー)を設定しておく。charset=utf-8 を付けておくことで、
    // 日本語などのマルチバイト文字が文字化けせずに伝わることを保証している。
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // --- ルーティング ---
    // ルーティングとは、「どのパス(URL)に対して、どの処理を行うか」を
    // 振り分けることをいう。ここでは if 文を使って、method と pathname の
    // 組み合わせで振り分けている(実務ではExpressなどのフレームワークが
    // この振り分けを簡単に書けるように手伝ってくれる)。

    if (method === 'GET' && pathname === '/') {
      // 200番台のステータスコードは「リクエストが成功した」ことを表す。
      // その中でも200は「OK」、つまり最も基本的な成功を意味する。
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'Hello from the simple HTTP server!' }));
      return;
    }

    if (method === 'GET' && pathname === '/health') {
      // /health のようなエンドポイント(URLのパス)は「ヘルスチェック」と呼ばれ、
      // サーバーが正常に動作しているかを外部から確認するために使われる。
      // 実際の現場でも、監視システムがこのようなパスに定期的にアクセスして、
      // サーバーが生きているかどうかを確認することがよくある。
      res.statusCode = 200;
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    // ここまでの if に当てはまらなかった場合(未定義のパス、
    // またはGET以外のメソッドでのアクセス)は、すべて404として扱う。
    // 404は「Not Found」、つまり「指定されたリソース(ページやAPI)が
    // 見つからなかった」ことを表す、非常によく使われるステータスコードである。
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  return server;
}

if (require.main === module) {
  const server = createServer();
  const port = 3000;

  // ここで初めて実際にポートを使い始める(listenする)。
  server.listen(port, () => {
    console.log(`サーバーが起動しました: http://localhost:${port}`);
    console.log('以下のURLにブラウザやcurlでアクセスしてみましょう:');
    console.log(`  http://localhost:${port}/`);
    console.log(`  http://localhost:${port}/health`);
    console.log('終了するには Ctrl+C を押してください。');
  });
}

module.exports = { createServer };
