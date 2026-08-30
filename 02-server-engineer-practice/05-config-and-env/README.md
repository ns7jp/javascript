# 設定ファイルと環境変数の管理

## この章で学ぶこと

- JSON形式の設定ファイル(config.json)を読み込み、正しい形式かどうかを検証(バリデーション)する方法
- 環境変数を使って、設定ファイルの値をあとから上書き(オーバーライド)する考え方
- `.env`ファイルとは何か、なぜ使われるのか(この章では仕組みを理解するために自作します)
- 「早期に、分かりやすいエラーで失敗させる(fail fast)」という設計の考え方
- 本番環境と開発環境で異なる設定を、安全に切り替えるための基本パターン

## 解説

### 設定ファイルとは

サーバーを動かすプログラムは、「サービス名」「待ち受けるポート番号」「データベースの接続先」など、動作を決めるためのさまざまな値を必要とします。こうした値をプログラムのコードの中に直接書いてしまう(ハードコーディングする、と呼びます)と、環境(開発用のパソコンなのか、本番のサーバーなのか)が変わるたびにコード自体を書き換える必要が出てきてしまいます。

そこで、こうした値をコードの外にある設定ファイル(config file)にまとめておき、プログラムはその設定ファイルを読み込んで動作を決める、という作り方がよく使われます。この章では、次のようなJSON形式の設定ファイルを例にします(同じ内容を `config.example.json` に用意してあります)。

```json
{
  "serviceName": "my-web-service",
  "port": 3000
}
```

Node.jsでは、`fs.readFileSync` で読み込んだ文字列を `JSON.parse()` に渡すことで、JSON形式のテキストをJavaScriptのオブジェクトに変換できます。

```javascript
const fs = require('node:fs');

const configText = fs.readFileSync('./config.example.json', 'utf-8');
const config = JSON.parse(configText);

console.log(config.serviceName); // "my-web-service"
console.log(config.port);        // 3000 (数値)
```

### バリデーションとは、なぜ必要か

バリデーション(validation、検証)とは、「渡されたデータが期待した形になっているか」をチェックする処理のことです。設定ファイルは人間がテキストエディタで手書きすることが多く、`port` の値をうっかり文字列の `"3000"` にしてしまったり、`serviceName` の項目を書き忘れてしまったりする、といったミスが起こりえます。

もしバリデーションをせずにそのまま使ってしまうと、そのミスに気づかないまま処理が進んでしまい、ずっとあとになってから(例えば実際にサーバーを起動しようとした瞬間に)分かりにくいエラーが起きる、ということになりがちです。設定を読み込んだ直後の早い段階で、「何が」「なぜ」問題なのかが一目で分かるエラーメッセージと共に処理を止める、という考え方を「fail fast(早期に失敗させる)」と呼びます。この章の `validateConfig(config)` は、まさにこのfail fastの考え方を実践する関数です。

```javascript
function validateConfig(config) {
  if (typeof config.serviceName !== 'string' || config.serviceName.trim() === '') {
    throw new Error('serviceName は空でない文字列で指定する必要があります');
  }
  // ...portのチェックも同様に行う
}
```

**ここで大事なのは、「型のチェック」と「値の妥当性のチェック」の両方が必要になる場合がある、という点です。** 例えば `port` は、まず「数値であること」を確認するだけでは不十分です。`typeof NaN` は `'number'` になってしまいますし、`3000.5` のような小数も `typeof` だけでは弾けません。そこで `Number.isInteger()`(整数かどうかを正しく判定してくれる標準の関数)も組み合わせてチェックします。さらに、ポート番号は仕様上 `1`〜`65535` の範囲でしか使えないため、その範囲に収まっているかどうかも確認します。

### 環境変数によるオーバーライド

環境変数(environment variable)とは、OSやコンテナ(Dockerなど)がプログラムに渡す、外部からの設定値のことです(1章でも `process.env` として登場しました)。実際の運用では、「設定ファイルの内容は基本的にそのまま使いたいが、ポート番号だけは環境ごとに変えたい」という場面がよくあります。例えば、クラウド上のホスティングサービスの中には、`PORT` という環境変数で「このポート番号でサーバーを起動してください」と指定してくるものもあります。

こうした「設定ファイルの値を、環境変数があればそちらで上書きする」という考え方を実装するのが `loadConfigWithEnvOverride(config, env)` です。

```javascript
function loadConfigWithEnvOverride(config, env) {
  const mergedConfig = { ...config }; // configをコピーした新しいオブジェクトを作る

  if (env.PORT !== undefined) {
    mergedConfig.port = Number(env.PORT); // 文字列を数値に変換してから上書きする
  }

  return mergedConfig;
}
```

**`{ ...config }` というスプレッド構文(spread syntax)を使っている点に注目してください。** これは、`config` の中身をすべてコピーした、新しいオブジェクトを作るための書き方です。もし `mergedConfig` の代わりに `config` そのものを直接書き換えてしまうと、この関数を呼び出した側が持っている元のオブジェクトまで変わってしまいます。「入力を受け取って、新しい値を返すだけで、元のデータには一切手を触れない」という関数を**純粋関数(pure function)**と呼び、2章のCLIツールの回でも登場した考え方です。テストのしやすさやバグの少なさの面で、こうした設計は非常に重要です。

### .envファイルとは

`.env` ファイルとは、環境変数を「`KEY=値`」という形で1行ずつ書いておくための、シンプルなテキストファイルです。開発中に使うデータベースのパスワードや、ポート番号などをこのファイルにまとめておき、プログラムの起動時に読み込んで `process.env` に反映させる、という使い方が一般的です。

```
PORT=4000
SERVICE_NAME=my-other-service
```

**本番運用ではdotenvのようなパッケージがよく使われますが、ここでは仕組みを理解するために自前で実装します。** (この章の演習では、実際に `.env` ファイルを読み込んで `process.env` に反映させる処理までは実装しません。`.env.example` というサンプルファイルを用意して、「どんな形のファイルなのか」をイメージしてもらうことが目的です。) もし自分で読み込み処理を実装するとしたら、次のように「1行ずつ `=` で分割し、`#` から始まる行はコメントとして無視する」というような処理になります。

```javascript
// あくまでイメージをつかむための参考コード(この章の演習では実装しません)
function parseEnvFile(text) {
  const result = {};
  for (const line of text.split('\n')) {
    const trimmedLine = line.trim();
    if (trimmedLine === '' || trimmedLine.startsWith('#')) {
      continue; // 空行やコメント行は無視する
    }
    const [key, value] = trimmedLine.split('=');
    result[key] = value;
  }
  return result;
}
```

`.env` ファイルには、パスワードのような機密情報が書かれることも多いため、**`.env` ファイル自体はGitの管理対象から外す(`.gitignore` に追加する)のが一般的な習慣です。** その代わりに、値を空にした(または仮の値を入れた)`.env.example` というファイルだけをGitで管理し、「どんな項目が必要か」をチームで共有する、というやり方がよく使われます。この章に用意した `.env.example` も、その習慣にならったものです。

## つまずきやすいポイント

- **`typeof config.port === 'number'` だけでportのチェックを済ませてしまう**: `NaN`(Not a Number)や `3000.5`(小数)も `typeof` では `'number'` と判定されてしまいます。整数かどうかまで正しく確認するには `Number.isInteger()` を組み合わせる必要があります。
- **環境変数の値が文字列であることを忘れる**: `process.env` や `env` オブジェクトから取れる値は常に文字列です。`env.PORT` が `"4000"` のように数字に見えても、`Number()` で変換しない限り、文字列のまま計算やオブジェクトへの代入に使ってしまうミスが起こりがちです(1章の `process.env` の解説も参照)。
- **`loadConfigWithEnvOverride` の中で元のconfigオブジェクトを直接書き換えてしまう**: `config.port = 4000` のように、スプレッド構文でコピーせずに直接代入してしまうと、呼び出し元が持っている元のオブジェクトまで変わってしまいます。「新しいオブジェクトを作って返す」という純粋関数の設計を崩さないようにしましょう。
- **配列も`typeof`では`'object'`と判定されることを忘れる**: `typeof ['a', 'b']` は `'object'` になります。「配列ではなく、通常のオブジェクトであること」まで確認したい場合は、`Array.isArray()` を追加でチェックする必要があります。

## 演習問題

`exercise.js` に、次の2つの関数を実装してください。

### 1. `validateConfig(config)`

- 引数: `config`(検証したい設定オブジェクト。どんな値が渡されるかは分からない)
- 戻り値: なし(検証に問題がなければ何も返さない。呼び出し側は「throwされなければOK」と判断する)
- 検証内容(いずれかに違反したら、分かりやすいメッセージの `Error` を `throw` すること):
  - `config` がオブジェクトであること(`null`、配列、文字列、数値などはNG)
  - `config.serviceName` が、空でない文字列であること(空白だけの文字列もNG)
  - `config.port` が、整数の数値であること(文字列の `"3000"` や小数の `3000.5` はNG)
  - `config.port` が `1`〜`65535` の範囲に収まっていること
- 例: `validateConfig({ serviceName: 'my-service', port: 3000 })` → 何も起きない(正常終了)
- 例: `validateConfig({ serviceName: 'my-service', port: '3000' })` → `Error` がthrowされる(portが文字列のため)
- 例: `validateConfig({ port: 3000 })` → `Error` がthrowされる(serviceNameが存在しないため)

### 2. `loadConfigWithEnvOverride(config, env)`

- 引数:
  - `config`(オブジェクト、ベースとなる設定。例: `{ serviceName: 'my-service', port: 3000 }`)
  - `env`(オブジェクト、環境変数を表す。例: `{ PORT: '4000' }`。`process.env` を渡すことを想定しているが、テストのためにただのオブジェクトを渡してもよい)
- 戻り値: `config` を元にした**新しいオブジェクト**
  - `env.PORT` が指定されている(`undefined` でない)場合、`Number(env.PORT)` で数値に変換した値を、返すオブジェクトの `port` として使う
  - `env.PORT` が指定されていない場合は、`config.port` の値をそのまま使う
  - `env.PORT` が指定されているが `Number()` で数値に変換できない文字列(例: `"abc"`)の場合は、`Error` を `throw` する
  - 元の `config` オブジェクトを直接書き換えてはいけない(純粋関数として実装すること)
- 例: `loadConfigWithEnvOverride({ serviceName: 'my-service', port: 3000 }, { PORT: '4000' })` → `{ serviceName: 'my-service', port: 4000 }`
- 例: `loadConfigWithEnvOverride({ serviceName: 'my-service', port: 3000 }, {})` → `{ serviceName: 'my-service', port: 3000 }`

**ヒント:** `validateConfig` は `typeof` と `Number.isInteger()`、`Array.isArray()` を組み合わせて実装します。`loadConfigWithEnvOverride` は、`{ ...config }` で新しいオブジェクトを作ってから、必要なときだけ `port` プロパティを上書きするとうまくいきます。

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 02-server-engineer-practice/05-config-and-env/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める

さらに、同じディレクトリにある `config.example.json` を実際に読み込んで、`validateConfig` と `loadConfigWithEnvOverride` を試してみましょう。

```bash
node -e "
const fs = require('node:fs');
const { validateConfig, loadConfigWithEnvOverride } = require('./02-server-engineer-practice/05-config-and-env/solution');
const config = JSON.parse(fs.readFileSync('./02-server-engineer-practice/05-config-and-env/config.example.json', 'utf-8'));
validateConfig(config);
console.log('検証OK:', config);
console.log('環境変数で上書き:', loadConfigWithEnvOverride(config, { PORT: '4000' }));
"
```

`.env.example` の中身も読んで、「実際のプロジェクトではこういう情報を環境変数として扱うことが多いのだな」というイメージを掴んでおきましょう。
