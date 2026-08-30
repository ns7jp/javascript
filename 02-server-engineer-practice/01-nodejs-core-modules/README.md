# Node.jsコアモジュール入門

## この章で学ぶこと

- `fs`モジュール(ファイルシステムを操作するための標準モジュール)を使って、ファイルの読み書きをする方法
- `path`モジュールを使って、OSの違いを気にせずにファイルパス(ファイルの場所を表す文字列)を組み立てたり分解したりする方法
- `os`モジュールを使って、実行しているマシン(OS)の情報を取得する方法
- `process.env`(環境変数)を使って、サーバーの設定をコードの外から渡す方法
- これらの標準モジュールが、実際のサーバー構築の現場でどのように使われるか

## 解説

### なぜサーバー構築エンジニアにファイル操作や環境変数の知識が重要か

サーバー構築エンジニア(インフラエンジニア)の仕事では、Webアプリの画面を作ることよりも、「サーバーが正しく動き続けるための土台を整える」ことが中心になります。具体的には、設定ファイル(`config.json` や `.env` ファイルなど)を読み込んでアプリを起動したり、ログファイルを書き出して後から障害の原因を調査したり、本番環境(実際にユーザーが使う環境)と開発環境で異なる設定(データベースの接続先など)を環境変数で切り替えたりする、という作業が日常的に発生します。これらはすべて、これから学ぶ `fs`(ファイルシステム)・`path`(パス操作)・`os`(OS情報)・`process.env`(環境変数)の知識がそのまま土台になります。逆に言えば、この章の内容はWebアプリを作る技術というよりも、「サーバーというコンピューターそのものを操作するための基礎体力」だと考えてください。

### fsモジュール: ファイルの読み書き

`fs`(File Systemの略)は、Node.jsに標準で用意されている、ファイルの読み書きを行うためのモジュール(機能をひとまとめにした部品)です。Node.jsのコアモジュール(標準モジュール、Node.js自体に組み込まれている機能)は、次のように `require('node:fs')` のように読み込んで使います。

```javascript
const fs = require('node:fs');
```

`node:` という接頭辞(先頭に付ける文字列)を付けることで、「これは自分で作ったファイルではなく、Node.js組み込みのモジュールである」ということが読み手にも分かりやすくなります。

ファイルを読み込むには `fs.readFileSync(パス, エンコーディング)` を使います。`Sync` は「同期的(Synchronous)」という意味で、処理が終わるまで次の行に進まない、という動作を表しています(11章の非同期処理と対になる考え方です)。

```javascript
const content = fs.readFileSync('./config.txt', 'utf-8');
console.log(content); // ファイルの中身が文字列として表示される
```

第2引数に `'utf-8'`(文字コードの一種で、日本語を含む多くの文字を正しく扱える標準的な形式)を指定することが重要です。これを省略すると、文字列ではなくバイナリデータ(`Buffer` という、生のデータを表すオブジェクト)が返ってきてしまい、`console.log` で表示しても人間が読める文字列にはなりません。

ファイルへの書き込みには `fs.writeFileSync(パス, 内容, エンコーディング)` を使います。

```javascript
fs.writeFileSync('./output.txt', 'こんにちは、サーバー構築エンジニア', 'utf-8');
```

存在しないファイルを読み込もうとすると、`fs.readFileSync` はエラーをthrowします。このエラーには `error.code` というプロパティがあり、ファイルが存在しない場合は `'ENOENT'`(Error NO ENTryの略で、「そのようなファイルやディレクトリは存在しない」という意味)という文字列が入っています。10章で学んだエラーハンドリングと組み合わせて、次のように「原因が分かりやすいエラーメッセージ」に変換するのが実務でもよく行われる工夫です。

```javascript
function readTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`ファイルが見つかりません: ${filePath}`);
    }
    throw error; // ENOENT以外の想定外のエラーは、そのまま投げ直す
  }
}
```

### pathモジュール: ファイルパスを安全に組み立てる

ファイルの場所を表す文字列のことを「パス」と呼びます。パスの区切り文字は、実はOSによって異なります。Linux/macOSでは `/`(スラッシュ)ですが、Windowsでは `\`(バックスラッシュ)が使われます。もし自分で文字列を `+` で連結してパスを組み立てると、開発環境ではうまく動いても、本番サーバー(多くはLinux)に持って行ったときに動かない、というトラブルの原因になります。

`path`モジュールを使うと、こうしたOSごとの違いを気にせずにパスを安全に扱えます。

```javascript
const path = require('node:path');

// path.join: 複数のパスの断片を、OSに合った区切り文字でつなげる
console.log(path.join('var', 'log', 'app.log')); // Linux/macOSでは "var/log/app.log"

// path.extname: パスの中から拡張子(ファイルの種類を表す部分、.jsonや.txtなど)を取り出す
console.log(path.extname('config.json')); // ".json"
console.log(path.extname('README'));      // ""(拡張子がない場合は空文字列)

// path.basename: パスの中から、最後の部分(ファイル名そのもの)を取り出す
console.log(path.basename('/var/log/app.log')); // "app.log"
```

`path.join` を使う一番のメリットは、「文字列を `+` で連結するよりも安全である」という点です。区切り文字の付け忘れ・付けすぎ(`'var' + 'log'` のようにスラッシュを忘れる、逆に `'var/' + '/log'` のように二重になる)といったミスを防げます。

### osモジュール: 実行環境の情報を取得する

`os`モジュールを使うと、Node.jsが実行されているマシン(サーバー)そのものの情報を取得できます。

```javascript
const os = require('node:os');

console.log(os.platform()); // 例: "linux"、"darwin"(macOS)、"win32"(Windows)
console.log(os.tmpdir());   // 一時ファイルを置くためのディレクトリのパス(例: "/tmp")
console.log(os.homedir());  // 現在のユーザーのホームディレクトリのパス
```

`os.tmpdir()` は、この章の演習のテストコードでも活用します。「実際にファイルを作って、読み込んで、最後に削除する」というテストをする際、プロジェクトのフォルダの中に一時ファイルを作ってしまうとゴミが残ってしまいます。そこで、OSが用意している「一時ファイル置き場」を使うことで、テストの後片付け(クリーンアップ)がしやすくなります。

### processオブジェクトと環境変数(process.env)

`process` は、Node.jsのプログラム自身(今動いているプロセス)に関する情報や機能をまとめたオブジェクトです。`require` する必要はなく、Node.jsのプログラムであればどこからでも使うことができます。

その中でも特によく使われるのが `process.env` です。これは、OSやコンテナ(Dockerなど)から渡された「環境変数」を保持しているオブジェクトです。環境変数とは、プログラムの外側から渡す設定値のことで、「本番環境ではデータベースのアドレスをA、開発環境ではBにしたい」というように、コードを書き換えずに動作を変えたいときに使われます。

```javascript
console.log(process.env.PORT); // 環境変数 PORT が設定されていればその値、なければ undefined
```

環境変数は必ず設定されているとは限らないため、「設定されていなければデフォルト値(既定値)を使う」という処理をよく書きます。

```javascript
function getEnvOrDefault(name, defaultValue) {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

console.log(getEnvOrDefault('PORT', '3000')); // PORTが未設定なら "3000"
```

10章でも学んだとおり、`process.env` から取れる値は**常に文字列**です。`process.env.PORT` が `"8080"` のように数字に見えても、実際は文字列型のデータなので、計算に使うときは `Number()` などで変換する必要がある、という点を覚えておきましょう。

## つまずきやすいポイント

- **`fs.readFileSync` の第2引数(エンコーディング)を省略してしまう**: `fs.readFileSync(filePath)` のようにエンコーディングを省略すると、返ってくるのは文字列ではなく `Buffer`(バイナリデータを表すオブジェクト)です。`console.log` すると `<Buffer 41 42 43 ...>` のような16進数の羅列が表示されてしまい、「なぜ文字列として表示されないのか」と戸惑いがちです。テキストファイルを扱うときは、必ず `'utf-8'` を第2引数に渡しましょう。
- **`process.env` の値を数値と勘違いして計算してしまう**: `process.env.PORT` は常に文字列です。`process.env.PORT + 1` のように書くと、数値の足し算(加算)ではなく文字列の連結になってしまい、`"3000" + 1` は `"30001"` という文字列になってしまいます。数値として使う前には `Number(process.env.PORT)` のような変換が必要です。
- **`getEnvOrDefault` を `process.env[name] || defaultValue` のように `||`(OR演算子)で書いてしまう**: 一見正しそうに見えますが、環境変数が空文字列 `""` に設定されている場合(「値は設定したが、あえて空にしている」場合)にも、空文字列は「偽(falsy、falseとして扱われる値)」なので、意図せずデフォルト値が使われてしまいます。「環境変数が存在するかどうか」を正しく判定するには、`value === undefined` のように、値そのものを比較する必要があります。
- **相対パスと絶対パスの違いを意識せずファイルを操作する**: `fs.readFileSync('./config.json')` のような相対パス(現在の場所を基準にしたパス)は、Node.jsのプログラムをどのフォルダから実行するか(カレントディレクトリ、current directory)によって、指す場所が変わってしまいます。サーバーの起動スクリプトなどでは、意図した場所を確実に指せるよう、絶対パス(`/var/app/config.json` のように、どこからでも同じ場所を指すパス)を使うことがよくあります。

## 演習問題

`exercise.js` に、次の3つの関数を実装してください。

### 1. `readTextFile(filePath)`

- 引数: `filePath`(読み込みたいファイルのパス、文字列)
- `fs.readFileSync(filePath, 'utf-8')` を使って、ファイルの中身を文字列として読み込んで返す
- ファイルが存在しない場合(`error.code === 'ENOENT'`)は、`try` / `catch` で受け止めて `new Error('ファイルが見つかりません: ' + filePath)` を `throw` する(元のエラーメッセージより分かりやすくするため)
- `ENOENT` 以外の想定外のエラーが発生した場合は、そのまま `throw error;` で投げ直す
- 例: 存在するファイルのパスを渡すと、そのファイルの中身の文字列が返る
- 例: 存在しないパスを渡すと `Error`(メッセージは `'ファイルが見つかりません: '` から始まる)がthrowされる

### 2. `getFileExtension(filePath)`

- 引数: `filePath`(ファイルパス、文字列)
- `path.extname(filePath)` を使って、拡張子(ドットを含む、例: `.json`)を返す
- 拡張子がない場合は空文字列 `''` が返る(`path.extname` の標準の挙動をそのまま利用する)
- 例: `getFileExtension('config.json')` → `'.json'`
- 例: `getFileExtension('archive.tar.gz')` → `'.gz'`(最後の拡張子のみ)
- 例: `getFileExtension('README')` → `''`

### 3. `getEnvOrDefault(name, defaultValue)`

- 引数: `name`(環境変数の名前、文字列)、`defaultValue`(環境変数が存在しないときに使う既定値)
- `process.env[name]` の値が `undefined` でなければその値を返す
- `process.env[name]` が `undefined`(環境変数が設定されていない)であれば `defaultValue` を返す
- **注意**: `||`(OR演算子)は使わないこと。空文字列 `''` が設定されている場合、そのまま空文字列を返す必要がある(つまずきやすいポイントを参照)
- 例: `process.env.APP_PORT = '8080'` のとき `getEnvOrDefault('APP_PORT', '3000')` → `'8080'`
- 例: `APP_PORT` が未設定のとき `getEnvOrDefault('APP_PORT', '3000')` → `'3000'`
- 例: `process.env.APP_MODE = ''` のとき `getEnvOrDefault('APP_MODE', 'default')` → `''`(デフォルト値ではなく、空文字列が返る)

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 02-server-engineer-practice/01-nodejs-core-modules/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
