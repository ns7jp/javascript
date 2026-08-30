# 簡易HTTPサーバーの構築

## この章で学ぶこと

- Node.js標準の `http` モジュールを使って、自分だけのHTTPサーバーを立てる方法
- リクエスト(request、ブラウザやツールから送られてくる要求)とレスポンス(response、サーバーからの返答)の基本的な仕組み
- URLのパス(例: `/health`)によって処理を振り分ける「ルーティング」の基本
- JSON形式でAPIのレスポンスを返す方法
- HTTPステータスコード(200、404など)が何を意味しているか
- テストしやすくするために「サーバーを作ること」と「サーバーを起動(listen)すること」を分けて設計する考え方

## 解説

### HTTPサーバーとは

HTTP(HyperText Transfer Protocol)とは、ブラウザとサーバーがインターネット上でやり取りするための共通のルール(通信規約)です。「Webサイトを見る」「APIからデータを取得する」といった動作は、すべてこのHTTPのやり取りの上に成り立っています。サーバー構築エンジニアにとって、このHTTPの基本的な仕組みを理解しておくことは欠かせません。

Node.jsには、外部のライブラリを何もインストールしなくても、`http` という標準モジュールだけでHTTPサーバーを立てる機能が用意されています。

```javascript
const http = require('node:http');

const server = http.createServer((req, res) => {
  // req(リクエスト): ブラウザなどから送られてきた要求の情報が入っている
  // res(レスポンス): サーバーからの返答を組み立てるためのオブジェクト
  res.statusCode = 200;
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('サーバーがポート3000番で起動しました');
});
```

`http.createServer(コールバック関数)` は、リクエストが来るたびに指定したコールバック関数(あとで呼び出される関数)を実行する `Server` オブジェクトを作ります。そして `server.listen(ポート番号)` を呼び出して初めて、実際にそのポート番号で通信を受け付け始めます。**`createServer()` だけではサーバーはまだ起動しておらず、`listen()` を呼んで初めて動き出す**、という2段階になっている点がポイントです。

### リクエストとレスポンスの基本

コールバック関数の第1引数 `req`(request、リクエスト)には、「どんなHTTPメソッド(`GET` や `POST` など、リクエストの種類)で」「どのパス(URLのうち、ホスト名より後ろの部分)に」アクセスしてきたかという情報が入っています。

```javascript
const server = http.createServer((req, res) => {
  console.log(req.method); // 例: 'GET'
  console.log(req.url);    // 例: '/health?debug=true' (パスとクエリ文字列)
});
```

`req.url` には、パスだけでなく `?debug=true` のようなクエリ文字列(URLの末尾に付く追加情報)まで含まれてしまいます。パスの部分だけを正確に取り出すには、Node.js標準の `URL` クラスを使うのが安全です。

```javascript
const requestUrl = new URL(req.url, `http://${req.headers.host}`);
console.log(requestUrl.pathname); // '/health' (クエリ文字列を除いたパスだけが取れる)
```

第2引数の`http://${req.headers.host}`は、`URL` クラスがパスだけの文字列(例: `/health`)から完全なURLを組み立てるために必要な「土台」として渡しているものです。

第2引数 `res`(response、レスポンス)は、サーバーからの返答を組み立てるためのオブジェクトです。主に次の3つを使います。

- `res.statusCode = 200` : ステータスコード(後述)を設定する
- `res.setHeader(名前, 値)` : レスポンスヘッダー(レスポンスに関する追加情報)を設定する
- `res.end(本文)` : レスポンスの本文を確定し、送信を完了する

**`res.end()` を呼ばないと、ブラウザ側はいつまでもレスポンスを待ち続けてしまいます。** 必ずどの処理ルートを通っても最終的に `res.end()` が呼ばれるように実装しましょう。

### ルーティング: パスによって処理を振り分ける

ルーティング(routing)とは、リクエストされたパス(とメソッド)に応じて、実行する処理を振り分けることです。この章では、`if` 文を使ったもっとも基本的な形でルーティングを実装します。

```javascript
if (req.method === 'GET' && pathname === '/health') {
  res.statusCode = 200;
  res.end(JSON.stringify({ status: 'ok' }));
  return;
}
```

**このように、あくまで最小構成の学習用の実装です。** 実務では、Express(エクスプレス)のような「Webフレームワーク」を使うことがほとんどで、フレームワークを使えばルーティングやエラー処理をもっと簡潔に書けます。しかし、フレームワークが裏側で何をしているのかを理解するために、まずは `http` モジュールだけで小さなサーバーを組み立ててみる経験は非常に役に立ちます。

### JSON形式でレスポンスを返す

JSON(JavaScript Object Notation)は、プログラム同士がデータをやり取りするときによく使われる、テキストベースのデータ形式です。JavaScriptのオブジェクトや配列を、`JSON.stringify()` を使って文字列に変換できます。

```javascript
const data = { status: 'ok' };
const jsonText = JSON.stringify(data);
console.log(jsonText); // '{"status":"ok"}' (文字列であることに注意)

res.end(jsonText);
```

**`res.end(data)` にオブジェクトをそのまま渡してはいけません。** `res.end()` が受け取れるのは文字列(またはバイナリデータ)だけなので、オブジェクトを直接渡すと `[object Object]` という意味のない文字列に変換されて送られてしまいます。必ず `JSON.stringify()` で文字列に変換してから渡しましょう。

また、レスポンスがJSON形式であることを相手(ブラウザやAPIを呼び出すプログラム)に伝えるために、`Content-Type`(コンテンツの種類を表すレスポンスヘッダー)を `application/json; charset=utf-8` に設定します。`charset=utf-8` を付けておくことで、日本語などのマルチバイト文字が文字化けせずに伝わることを保証できます。

```javascript
res.setHeader('Content-Type', 'application/json; charset=utf-8');
```

### HTTPステータスコードの意味

ステータスコード(status code)は、レスポンスの結果を3桁の数字で表したものです。この章では、次の2つだけを扱います。

- **200 (OK)**: リクエストが成功したことを表す、もっとも基本的な成功のステータスコード
- **404 (Not Found)**: リクエストされたパス(ページやAPI)が見つからなかったことを表す、非常によく使われるステータスコード

他にも、`500`(サーバー内部でエラーが起きたことを表す)や `201`(新しいデータが作成されたことを表す)など、たくさんの種類がありますが、まずはこの2つの意味をしっかり押さえておきましょう。

### テストしやすい設計: listen()を呼ばずにServerを返す

この章の演習で作る `createServer()` 関数は、**`http.createServer()` は呼ぶが、`server.listen()` は呼ばずに、`Server` インスタンスをそのまま返す**という設計にします。

```javascript
function createServer() {
  const server = http.createServer((req, res) => {
    // ...ルーティング処理...
  });
  return server; // listen() はまだ呼ばない
}
```

なぜこうするのでしょうか。もし `createServer()` の中で `server.listen(3000)` のように固定のポート番号を指定してしまうと、テストを実行するたびに3000番ポートが使われることになります。何度もテストを実行したり、複数のテストを同時に実行したりすると、「ポートがすでに使われています」というエラーで失敗してしまうことがあります。

そこで、`createServer()` は「サーバーを組み立てるところまで」を担当し、実際にどのポートで起動するかは呼び出し側(CLIから起動する場合は3000番、テストから起動する場合はランダムな空きポート)に任せる設計にしています。テストコード(`solution.test.js`)では、次のように `listen(0)` を使ってOSに空いているポートを自動で選んでもらい、`server.address().port` で実際に割り当てられたポート番号を取得しています。

```javascript
const server = createServer();
await new Promise((resolve) => server.listen(0, resolve));
const { port } = server.address();
```

この「実際に動く処理」と「起動のタイミングや設定」を分ける考え方は、前の章(CLIツールを作る)で学んだ「コアロジックとCLI部分の分離」と同じ発想です。テストのしやすさを考えて設計する、というのはサーバー構築エンジニアにとっても重要なスキルです。

## つまずきやすいポイント

- **`res.end()` を呼び忘れて、ブラウザがずっと「読み込み中」のままになる**: `if` 文で処理を分けているとき、どこかのルートで `res.end()` を呼ぶのを忘れると、そのリクエストに対してはいつまでもレスポンスが返らなくなってしまいます。すべてのルート(分岐)で、最終的に必ず1回だけ `res.end()` が呼ばれるようにしましょう。
- **オブジェクトをそのまま `res.end()` に渡してしまう**: `res.end({ status: 'ok' })` のようにオブジェクトを直接渡すと、意図した通りのJSON文字列にはならず、`[object Object]` という文字列が送られてしまいます。必ず `JSON.stringify()` で変換してから渡しましょう。
- **`req.url` にクエリ文字列も含まれることを忘れる**: `req.url` は `/health?debug=true` のように、パスとクエリ文字列がつながった状態で入っています。単純に `req.url === '/health'` と比較すると、クエリ文字列が付いた瞬間に一致しなくなってしまいます。`new URL()` を使って `pathname` だけを取り出してから比較しましょう。
- **テストでサーバーを閉じ忘れる**: `server.listen()` で起動したサーバーは、`server.close()` を呼ぶまでポートを使い続けます。テストの中で `server.close()` を呼び忘れる(特に、途中で `assert` が失敗して処理が止まってしまう)と、ポートが使われたまま残ってしまい、次のテスト実行に影響することがあります。`try...finally` を使い、テストの成功・失敗に関わらず必ず `server.close()` が呼ばれるようにしましょう。

## 演習問題

`exercise.js` に、次の1つの関数を実装してください(CLI部分の `runCli` 関数はすでに実装済みなので、変更する必要はありません)。

### `createServer()`

- 引数: なし
- 戻り値: `http.createServer()` で作った `Server` インスタンス(**`listen()` はこの関数の中で呼ばないこと**)
- ルーティングの仕様:
  - `GET /` へのリクエスト → ステータスコード `200`、レスポンスボディは `{ "message": "..." }` という形のJSON(`message` の中身は自由な文字列でよい)
  - `GET /health` へのリクエスト → ステータスコード `200`、レスポンスボディは `{ "status": "ok" }` というJSON
  - 上記以外のパス、または `GET` 以外のメソッドでのリクエスト → ステータスコード `404`、レスポンスボディは `{ "error": "Not Found" }` というJSON
- どのレスポンスも、`Content-Type` ヘッダーを `application/json; charset=utf-8` にすること
- 例: `GET /` にリクエストすると、ステータス `200` で `{"message": "何かしらの文字列"}` が返る
- 例: `GET /unknown-path` にリクエストすると、ステータス `404` で `{"error": "Not Found"}` が返る

**ヒント:** `req.url` をそのままパスとして比較するのではなく、`new URL(req.url, 'http://localhost')` のようにして `pathname` プロパティを取り出してから比較すると安全です。`res.statusCode` にステータスコードを、`res.setHeader('Content-Type', ...)` にヘッダーを設定してから、`res.end(JSON.stringify({...}))` でレスポンスを送信する、という流れになります。

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 02-server-engineer-practice/03-http-server/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める

さらに、実際にサーバーを起動してブラウザやcurlからアクセスしてみましょう。

```bash
node 02-server-engineer-practice/03-http-server/solution.js
```

起動したら、別のターミナルで次のように `curl`(コマンドラインからHTTP通信を行うためのツール)を使ってアクセスできます。

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/no-such-page
```

自分の `exercise.js` を実装し終えたあとは、`solution.js` の部分を `exercise.js` に置き換えて、同じように起動できるか試してみてください。サーバーを終了するときは `Ctrl+C` を押します。
