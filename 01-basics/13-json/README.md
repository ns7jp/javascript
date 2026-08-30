# JSON操作

## この章で学ぶこと

- JSON(JavaScript Object Notation)とは何か、なぜ設定ファイルやAPI(サーバーとやり取りする窓口)でよく使われるのか
- `JSON.stringify` を使って、JavaScriptのオブジェクトを「見やすく整形されたJSON文字列」に変換する方法
- `JSON.parse` を使って、JSON文字列をJavaScriptのオブジェクトに変換する方法(パース = 文字列を解析してデータ構造に変換すること)
- ネストした(入れ子になった)データを扱うときの考え方
- JSONでよくあるエラー(末尾カンマ、シングルクォートの禁止など)と、それを安全に処理する方法

## 解説

### JSONとは何か

JSON(JavaScript Object Notation、読み方は「ジェイソン」)とは、データを文字列として表現するための決まったフォーマット(書き方のルール)です。名前に「JavaScript」と入っていますが、今ではJavaScriptに限らず、Python・Java・Go など多くのプログラミング言語で使われている、いわば「データのやり取りにおける共通言語」です。

サーバー構築の現場では、次のような場面でJSONに触れることになります。

- サーバーの設定ファイル(`config.json` のようなファイル)
- Webサーバーとブラウザ・アプリの間でやり取りするAPIのレスポンス(応答データ)
- ログの保存フォーマット

JSONは見た目こそJavaScriptのオブジェクトリテラル(`{ name: 'server1' }` のような書き方)によく似ていますが、実際には**ただの文字列**です。「JavaScriptのオブジェクト(メモリ上のデータ)」と「JSON文字列(テキストとして保存・送信できる文字列)」は別物である、という点をまず押さえておきましょう。

```javascript
const serverObject = { name: 'server1', port: 8080 }; // これはJavaScriptのオブジェクト
const serverJsonText = '{"name":"server1","port":8080}'; // これはJSON文字列(ただの文字の並び)
```

オブジェクトはファイルに保存したり、ネットワーク越しに送ったりすることはできません。そこで、オブジェクトを文字列に変換(シリアライズ、serializeとも言います)したり、逆に文字列をオブジェクトに戻したり(デシリアライズ、deserializeとも言います)する必要があります。JavaScriptでは、この変換を `JSON.stringify` と `JSON.parse` という2つの組み込み関数(あらかじめ用意されている関数)が担っています。

### JSON.stringify: オブジェクトをJSON文字列に変換する

`JSON.stringify(値)` を使うと、JavaScriptの値(オブジェクトや配列など)をJSON文字列に変換できます。

```javascript
const server = { name: 'server1', port: 8080 };
console.log(JSON.stringify(server)); // '{"name":"server1","port":8080}'
```

このままだと1行にまとまっていて人間には読みにくいので、`JSON.stringify` には第2引数・第3引数を渡すことができます。

```javascript
JSON.stringify(値, replacer, space)
```

- `replacer`(置き換え関数): 特定のプロパティだけを変換・除外したいときに使います。使わない場合は `null` を渡します。
- `space`(インデントの空白数): 見やすく整形(インデントを付けること)したいときの空白の数を指定します。数値の `2` を渡すと、半角スペース2つ分でインデントされます。

```javascript
const server = { name: 'server1', port: 8080 };
console.log(JSON.stringify(server, null, 2));
// {
//   "name": "server1",
//   "port": 8080
// }
```

このように、`space` に `2` を指定して整形されたJSON文字列を作ることを、この演習では「プリティプリント(pretty print、見やすく整形して出力すること)」と呼びます。ログの内容を人が目で確認したいときや、設定ファイルを保存するときによく使われます。

### ネストしたデータの扱い

実際の設定ファイルやAPIレスポンスでは、オブジェクトの中にさらにオブジェクトや配列が入っている「ネストした(入れ子になった)データ」がよく登場します。

```javascript
const serverConfig = {
  name: 'server1',
  network: {
    host: '0.0.0.0', // すべての通信を受け付けるIPアドレスの意味でよく使われる
    port: 8080,
  },
  tags: ['production', 'web'], // 配列もネストできる
};

console.log(JSON.stringify(serverConfig, null, 2));
// {
//   "name": "server1",
//   "network": {
//     "host": "0.0.0.0",
//     "port": 8080
//   },
//   "tags": [
//     "production",
//     "web"
//   ]
// }
```

`JSON.stringify` は、オブジェクトの中にオブジェクトや配列があっても、自動的に再帰的(同じ処理を繰り返し適用すること)に変換してくれます。私たちが階層の深さを気にして特別なコードを書く必要はありません。

### JSON.parse: JSON文字列をオブジェクトに戻す

`JSON.parse(文字列)` を使うと、JSON文字列を元のJavaScriptの値(オブジェクトや配列)に戻すことができます。`JSON.stringify` とは逆の操作です。

```javascript
const jsonText = '{"name":"server1","port":8080}';
const server = JSON.parse(jsonText);
console.log(server.name); // "server1"
console.log(server.port); // 8080(文字列ではなく数値として復元される)
```

### JSON.parseが失敗するケースとエラーハンドリング

`JSON.parse` に渡す文字列が、JSONとして正しい形式(妥当なJSON、valid JSONと言います)でない場合、`SyntaxError`(構文エラー)がthrowされます。設定ファイルやAPIのレスポンスは、外部(ファイルやネットワークの向こう側)から来るデータであり、必ずしも正しい形式とは限りません。そのため、10章で学んだ `try` / `catch` を使ったエラーハンドリングと組み合わせて使うのが定石(決まったやり方)です。

```javascript
function parseJsonSafely(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null; // パースに失敗したら、例外を投げずにnullを返す
  }
}

console.log(parseJsonSafely('{"port":8080}')); // { port: 8080 }
console.log(parseJsonSafely('これはJSONではない')); // null(エラーにならず、静かにnullが返る)
```

このように「失敗したらnullを返す」という設計にしておくと、呼び出し側は `if (result === null) { ... }` のようにシンプルに失敗を確認できます。プログラム全体が予期せず停止してしまう事態を防げるため、設定ファイルの読み込みなどでよく使われる考え方です。

### よくあるJSONのエラー: 末尾カンマとシングルクォート

JSONは、JavaScriptのオブジェクトリテラルの書き方とよく似ていますが、いくつかの点で**JSONの方がルールが厳しい**です。この違いを知らないと「JavaScriptでは動くのに、JSONとしてはエラーになる」という状況にはまりがちです。

```javascript
// JavaScriptのオブジェクトリテラルとしては、どちらも正しく動く
const okInJs1 = { name: 'server1', };       // 末尾にカンマがあってもOK
const okInJs2 = { name: 'server1' };        // シングルクォートを使ってもOK
```

```javascript
// しかし、これらをJSON文字列として JSON.parse に渡すとエラーになる
JSON.parse('{"name": "server1",}'); // SyntaxError: 末尾カンマ(trailing comma)は禁止
JSON.parse("{'name': 'server1'}");  // SyntaxError: シングルクォートは禁止(ダブルクォートのみ有効)
```

JSONの仕様(ルール)では、次のように決められています。

- 文字列やキー(プロパティ名)は必ず**ダブルクォート(`"`)** で囲む。シングルクォート(`'`)やバッククォート(`` ` ``)は使えない
- 配列やオブジェクトの**最後の要素の後ろにカンマを付けてはいけない**(末尾カンマ禁止)
- コメント(`//` や `/* */`)を書くことはできない

これらのルールに違反したJSON文字列を `JSON.parse` に渡すと `SyntaxError` が発生します。前述の `parseJsonSafely` のように、`try` / `catch` で必ず受け止められるようにしておくことが重要です。

### スプレッド構文を使った設定のマージ(merge)

サーバー構築の現場では、「基本の設定(デフォルト値)」に対して、「環境ごとの上書き設定」をJSON文字列で受け取り、2つを合体(マージ)させるという処理がよく発生します。この演習では、8章で学んだスプレッド構文(`...`、オブジェクトや配列の中身を展開する書き方)を使って、この合体処理を実装します。

```javascript
const baseConfig = { host: 'localhost', port: 8080, debug: false };
const overrideJsonString = '{"port": 9090, "debug": true}';

const overrideConfig = JSON.parse(overrideJsonString);
const mergedConfig = { ...baseConfig, ...overrideConfig };

console.log(mergedConfig); // { host: 'localhost', port: 9090, debug: true }
```

スプレッド構文で `{ ...baseConfig, ...overrideConfig }` のように書くと、「後から展開した方(ここでは `overrideConfig`)の値が優先される」という順番のルールがあります。同じキー(`port` や `debug`)があれば、後ろに書いた `overrideConfig` の値で上書きされます。

## つまずきやすいポイント

- **JSONの文字列はダブルクォートのみ**: JavaScriptのコードではシングルクォート `'...'` をよく使いますが、JSON文字列としては**必ずダブルクォート `"..."`** を使わなければなりません。`JSON.parse("{'name': 'a'}")` のようにシングルクォートで書かれたJSON文字列を渡すと `SyntaxError` になります。
- **末尾カンマ(trailing comma)は許可されない**: JavaScriptのオブジェクトリテラルでは `{ a: 1, b: 2, }` のように最後にカンマを付けても問題なく動きますが、JSON文字列として `'{"a":1,"b":2,}'` を `JSON.parse` に渡すとエラーになります。「JavaScriptで動くから」と油断せず、JSON文字列は別ルールだと意識しましょう。
- **`undefined` や関数はJSONにならずに消える**: `JSON.stringify({ a: 1, b: undefined, c: () => {} })` を実行すると、結果は `'{"a":1}'` となり、`b` と `c` はプロパティごと消えてしまいます(エラーにはなりません)。「値を入れたはずなのに、JSON化したら消えていた」と混乱しやすいポイントです。
- **スプレッド構文によるマージは「浅い(shallow)」マージである**: `{ ...baseObject, ...overrideObject }` は、あくまで一番上の階層(トップレベル)のプロパティだけを比較して上書きします。ネストしたオブジェクト(オブジェクトの中のオブジェクト)がある場合、そのネストしたオブジェクトは丸ごと置き換えられてしまい、内部だけを部分的に上書きすることはできません。例えば `baseObject.network` の中身を1つだけ変えたつもりでも、`overrideObject.network` がある限り `network` オブジェクト全体が置き換わります。

## 演習問題

`exercise.js` に、次の3つの関数を実装してください。

### 1. `toPrettyJson(obj)`

- 引数: `obj`(JSONに変換したいオブジェクトや配列など)
- `JSON.stringify(obj, null, 2)` と同じ結果になる文字列を返す(見やすく整形された、インデント2文字のJSON文字列)
- 例: `toPrettyJson({ name: 'server1' })` → `'{\n  "name": "server1"\n}'`(実際に `console.log` すると2行に整形されて表示される)

### 2. `parseJsonSafely(jsonString)`

- 引数: `jsonString`(JSONとして解釈したい文字列)
- `try` / `catch` を使って `JSON.parse(jsonString)` を試す
- パースに成功したら、その結果(オブジェクトや配列など)を返す
- パースに失敗したら(`SyntaxError` が発生したら)、例外を外に投げずに `null` を返す
- 例: `parseJsonSafely('{"port":8080}')` → `{ port: 8080 }`
- 例: `parseJsonSafely('これはJSONではない')` → `null`

### 3. `mergeConfigFromJson(baseObject, overrideJsonString)`

- 引数: `baseObject`(基本となる設定オブジェクト)、`overrideJsonString`(上書きしたい設定が入ったJSON文字列)
- `overrideJsonString` を `JSON.parse` でパースする
- パースに失敗した場合、`new Error('設定のJSONが不正です: ' + パース時のエラーメッセージ)` のような、原因が分かりやすいメッセージのエラーを `throw` する(この演習ではエラーメッセージの先頭が `'設定のJSONが不正です: '` から始まっていることをテストで確認します)
- パースに成功した場合、`{ ...baseObject, ...パース結果 }` のように、スプレッド構文を使って新しいオブジェクトを作って返す(`baseObject` 自体は変更しないこと)
- 例: `mergeConfigFromJson({ host: 'localhost', port: 8080 }, '{"port": 9090}')` → `{ host: 'localhost', port: 9090 }`
- 例: `mergeConfigFromJson({ port: 8080 }, '不正なJSON')` → エラーがthrowされる

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/13-json/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
