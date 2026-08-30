# ログ解析ミニプロジェクト

## この章で学ぶこと

- テキスト形式のログファイルとは何か、なぜサーバー構築エンジニアがログを読む必要があるのか
- 正規表現(regular expression、文字列のパターンを表す特別な書き方)を使って、1行のログから必要な情報だけを取り出す方法
- ステータスコード(後述)ごとの件数など、集計処理の基本的な考え方
- `map`・`filter`・`reduce` という配列操作(配列の要素を1つずつ処理していく方法)を組み合わせて、実践的な集計処理を書く方法
- 「1行のパース」と「複数行の集計」を別々の関数に分けて設計する考え方

## 解説

### ログとは何か、なぜ解析するのか

ログ(log)とは、サーバーで「いつ」「何が」起きたかを記録したテキストです。サーバー構築エンジニアの仕事では、サービスに障害が起きたときに「いつからおかしくなったのか」「どのAPIでエラーが多発しているのか」をログから調査する、という作業が日常的に発生します。この章では、Webサーバーのアクセスログ(誰が・いつ・どのURLに・どのくらいの時間でアクセスしたかを記録したログ)を題材に、テキストを解析(パース)して集計する練習をします。

### この章で扱う独自のログ形式

世の中には、Apache(アパッチ、有名なWebサーバーソフト)の「Common Log Format」や、1行がまるごとJSON形式になっている「構造化ログ」など、さまざまなログ形式があります。この章では学習のために、次のようなシンプルな独自形式を定義します。

```
2026-08-30T10:15:00Z GET /api/users 200 42ms
```

半角スペース区切りで、次の5つの項目が並んでいます。

| 項目 | 例 | 意味 |
| --- | --- | --- |
| 日時 | `2026-08-30T10:15:00Z` | ISO8601形式(国際規格の日時の書き方)の日時。末尾の`Z`は「UTC(協定世界時)である」ことを表す |
| メソッド | `GET` | HTTPメソッド(リクエストの種類)。大文字のアルファベットで書かれる |
| パス | `/api/users` | アクセスされたURLのパス(`/`から始まる部分) |
| ステータスコード | `200` | リクエストの結果を表す3桁の数字(後述) |
| レスポンスタイム | `42ms` | サーバーが応答を返すまでにかかった時間(ミリ秒、`ms`という単位を末尾に付けて表す) |

ステータスコードは、`200`(成功)、`404`(指定されたパスが見つからない)、`401`(認証が必要)、`500`(サーバー内部エラー)など、結果の種類を表す3桁の数字です(3章のHTTPサーバーの演習でも登場しました)。

### 正規表現の基礎

正規表現(regular expression、略してregex)とは、「文字列がどんなパターンに一致するか」を表現するための特別な書き方です。ログのように「決まった形式で並んでいる文字列」から、必要な部分だけを取り出したいときによく使われます。

この章のログ1行を表す正規表現は、次のようになります。

```javascript
const LOG_LINE_PATTERN = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z) ([A-Z]+) (\/\S*) (\d{3}) (\d+)ms$/;
```

読み解くためのポイントは以下の通りです。

- `^` と `$` : それぞれ「行の先頭」「行の末尾」を表す。これを付けることで、「行全体がこの形式にぴったり一致する」ことを要求できる
- `\d` : 「1つの数字(0〜9のいずれか)」を表す。`\d{3}` は「数字がちょうど3つ」という意味
- `[A-Z]+` : 「大文字のアルファベットが1文字以上」という意味。`+` は「直前のパターンが1回以上繰り返される」ことを表す
- `\S` : 「空白文字ではない1文字」を表す。`\S*` は「空白でない文字が0文字以上」という意味
- `( )` : 「キャプチャグループ」と呼ばれ、あとで `match()` を使ったときにその部分だけを個別に取り出せるようにする印

文字列に対して `match()` メソッドを使うと、正規表現にマッチするかどうかを調べられます。

```javascript
const line = '2026-08-30T10:15:00Z GET /api/users 200 42ms';
const result = line.match(LOG_LINE_PATTERN);

console.log(result[0]); // マッチした文字列全体
console.log(result[1]); // 1つ目のキャプチャグループ: "2026-08-30T10:15:00Z"
console.log(result[2]); // 2つ目のキャプチャグループ: "GET"
```

**マッチしなかった場合、`match()` は `null` を返します。** これを確認せずに `result[1]` のようにアクセスしようとすると、「`null`のプロパティは読み取れない」というエラーになってしまいます。

### parseLine: 1行をパースする

1行のログ文字列を、扱いやすいオブジェクトに変換する処理を「パース(parse、構文解析)する」と呼びます。この章の `parseLine(line)` は、次のような流れで実装します。

```javascript
function parseLine(line) {
  const trimmedLine = line.trim(); // 前後の余分な空白を取り除く
  const match = trimmedLine.match(LOG_LINE_PATTERN);

  if (match === null) {
    return null; // 形式に合わない行は null を返す
  }

  const [, timestamp, method, path, statusText, durationText] = match;

  return {
    timestamp,
    method,
    path,
    status: Number(statusText),       // 文字列 -> 数値に変換
    durationMs: Number(durationText), // 文字列 -> 数値に変換
  };
}
```

**必ず数値に変換する(`Number()`を使う)ことが重要です。** 正規表現でマッチした時点では、`statusText` は `"200"` という**文字列**であり、数値の `200` ではありません。文字列のまま扱ってしまうと、あとで集計するときに `"200" + "1"` が `201` ではなく `"2001"`(文字列の連結)になってしまう、という事故が起きます。

### analyze: 複数行をまとめて集計する

`analyze(logText)` は、複数行のログ文字列(1行ずつ改行 `\n` で区切られたもの)を受け取り、全体を集計します。ここでは、配列操作の代表的な3つのメソッド、`map`・`filter`・`reduce` を組み合わせて実装します。

```javascript
const parsedEntries = logText
  .split('\n')                          // 1. 1行ずつの配列に分割する
  .map((line) => parseLine(line))       // 2. 各行をパースする(オブジェクト or null の配列になる)
  .filter((entry) => entry !== null);   // 3. パースに失敗した行(null)を取り除く
```

- `split('\n')` : 文字列を改行で分割し、1行ずつの文字列の配列を作る
- `map(関数)` : 配列の各要素に関数を適用し、その結果からなる新しい配列を作る。ここでは「各行の文字列」を「パース結果のオブジェクト(またはnull)」に変換している
- `filter(関数)` : 配列の各要素のうち、関数が `true` を返したものだけを残した新しい配列を作る。ここでは「nullでない要素」だけを残している

こうして残った `parsedEntries`(パースに成功した行だけの配列)を使って、`reduce` で集計します。

```javascript
// ステータスコードごとの件数を集計する
const byStatus = parsedEntries.reduce((counts, entry) => {
  const statusKey = String(entry.status);
  counts[statusKey] = (counts[statusKey] || 0) + 1;
  return counts;
}, {});
```

`reduce(関数, 初期値)` は、配列の要素を1つずつ処理しながら、「これまでの集計結果」を次の処理に引き継いでいくメソッドです。第2引数の `{}` が「集計を始める前の初期状態(空のオブジェクト)」にあたります。コールバック関数の第1引数 `counts` には、1つ前の処理までの集計結果が渡され、最後に `return counts` することで、その更新後の値が次の要素の処理に引き継がれていきます。

平均レスポンスタイムも、同じように `reduce` で合計を求めてから、件数で割ることで計算できます。

```javascript
const totalDurationMs = parsedEntries.reduce((sum, entry) => sum + entry.durationMs, 0);
const averageDurationMs = totalRequests === 0 ? 0 : totalDurationMs / totalRequests;
```

**有効な行が1つもないとき(`totalRequests` が `0`)は、必ず特別扱いする必要があります。** 何もチェックせずに `totalDurationMs / totalRequests` を計算すると、`0 / 0` はJavaScriptでは `NaN`(Not a Number、数値として意味を持たない値)になってしまいます。

## つまずきやすいポイント

- **`match()` が `null` を返す可能性を忘れる**: 正規表現がマッチしなかった場合、`match()` は `null` を返します。これを確認せずに `match[1]` のようにアクセスすると、「`null` のプロパティは読み取れない」というエラーになります。必ず `if (match === null) { return null; }` のようなチェックを先に入れましょう。
- **ステータスコードやレスポンスタイムを文字列のまま扱ってしまう**: 正規表現でマッチした直後の値は、すべて**文字列**です。`"200"` を数値の `200` だと思い込んで計算に使うと、期待通りに動きません。`Number()` を使って明示的に数値へ変換することを忘れないようにしましょう。
- **不正な行(`null`)を除外せずに集計処理へ渡してしまう**: `map` でパースした結果には `null` が混ざっている可能性があります。`filter` で `null` を取り除く前に `reduce` や別の処理で `entry.status` のようにアクセスしてしまうと、「`null` のプロパティは読み取れない」というエラーになります。必ず「パース → nullを除外 → 集計」という順番を守りましょう。
- **有効な行が0件のときに0で割ってしまう**: 平均を計算する際、対象の件数が0件のときに単純に「合計 ÷ 件数」を計算すると `NaN` になります。件数が0のときは、あらかじめ `0` を返すなどの特別な処理が必要です。

## 演習問題

`exercise.js` に、次の2つの関数を実装してください。

### 1. `parseLine(line)`

- 引数: `line`(文字列、1行分のログ)
- 戻り値:
  - 正しい形式の行であれば、`{ timestamp, method, path, status, durationMs }` という形のオブジェクト
    - `timestamp`(文字列): 日時の部分(例: `"2026-08-30T10:15:00Z"`)
    - `method`(文字列): HTTPメソッド(例: `"GET"`)
    - `path`(文字列): パス(例: `"/api/users"`)
    - `status`(数値): ステータスコード(例: `200`)
    - `durationMs`(数値): レスポンスタイム、ミリ秒(例: `42`)
  - 形式に合わない行(空行、項目が足りない行、ステータスコードが3桁でない行など)であれば `null`
  - `line` が文字列でない場合も `null`
- 行の形式: `<日時> <メソッド> <パス> <ステータスコード> <レスポンスタイム>ms`(半角スペース区切り。詳しくは「解説」の表を参照)
- 例: `parseLine('2026-08-30T10:15:00Z GET /api/users 200 42ms')` → `{ timestamp: '2026-08-30T10:15:00Z', method: 'GET', path: '/api/users', status: 200, durationMs: 42 }`
- 例: `parseLine('これは不正な行です')` → `null`

### 2. `analyze(logText)`

- 引数: `logText`(文字列、複数行のログ。1行ずつ改行 `\n` で区切られている)
- 戻り値: `{ totalRequests, byStatus, averageDurationMs }` という形のオブジェクト
  - `totalRequests`(数値): `parseLine` でパースに成功した行の総数(不正な行・空行はカウントしない)
  - `byStatus`(オブジェクト): ステータスコード(文字列のキー、例: `"200"`)ごとの件数。例: `{ "200": 3, "404": 1 }`
  - `averageDurationMs`(数値): パースに成功した行のレスポンスタイムの平均値。有効な行が1件もない場合は `0`
- 異常系: `logText` が文字列でない場合は `TypeError` を投げる
- 例: 3行のログ(すべて `status: 200`、`durationMs` がそれぞれ `10`, `20`, `30`)を渡すと、`{ totalRequests: 3, byStatus: { "200": 3 }, averageDurationMs: 20 }` が返る

**ヒント:** `parseLine` は `logText.split('\n').map(parseLine).filter(...)` という形で `analyze` の中から呼び出すと、不正な行を簡単に除外できます。集計には `Array.prototype.reduce` が便利です。

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 02-server-engineer-practice/04-log-analyzer/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める

さらに、同じディレクトリにある `sample.log`(8行のサンプルログ)を実際に読み込んで、`analyze` の結果を確認してみましょう。

```bash
node -e "const fs = require('node:fs'); const { analyze } = require('./02-server-engineer-practice/04-log-analyzer/solution'); console.log(analyze(fs.readFileSync('./02-server-engineer-practice/04-log-analyzer/sample.log', 'utf-8')));"
```

`sample.log` の中身を書き換えて、集計結果がどう変わるかも試してみてください。
