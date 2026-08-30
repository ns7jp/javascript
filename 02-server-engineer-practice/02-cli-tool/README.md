# CLIツールを作る

## この章で学ぶこと

- `process.argv` を使って、コマンドライン引数(コマンド実行時にターミナルから渡す値)を取得する方法
- 「コアロジック(核となる処理)」と「CLI(コマンドラインインターフェース)部分」を分けて設計する考え方と、そうすることでテストがしやすくなる理由
- `fs.readFileSync` を使ってファイルの中身を文字列として読み込む方法
- 実際にファイルの行数・単語数・文字数を数える、手元で動かせるCLIツールの作り方
- 引数が足りないときやファイルが存在しないときに、正しくエラーを扱う方法

## 解説

### CLIツールとは

CLI(Command Line Interface、コマンドラインインターフェース)ツールとは、ターミナル(コマンドを入力する画面)から実行するプログラムのことです。例えば、これまでの演習で毎回使ってきた `node --test` や `git status` も、すべてCLIツールです。この章では、自分自身でCLIツールを作ってみます。

作るのは、テキストファイルの「行数」「単語数」「文字数」を数えて表示するツールです。これはLinux(サーバーでよく使われるOS)に標準で入っている `wc`(word countの略)というコマンドの、簡易版のようなものだとイメージしてください。サーバー構築の仕事では、ログファイルの行数を数えたり、設定ファイルのサイズを確認したりする場面で、こうした簡単なツールを自作することがよくあります。

### process.argv でコマンドライン引数を受け取る

`process` は、Node.jsが用意しているグローバルオブジェクト(特別な準備をしなくてもどこからでも使える、プログラム自身に関する情報を持ったオブジェクト)です。その中の `process.argv` には、プログラムを実行したときにターミナルから渡された引数(コマンドの後ろに続けて書いた文字列)が、配列として入っています。

例えば、次のようにコマンドを実行したとします。

```bash
node exercise.js sample.txt
```

このとき `process.argv` の中身は、次のようになります。

```javascript
[
  '/usr/local/bin/node',    // process.argv[0] : node実行ファイル自体のパス
  '/path/to/exercise.js',   // process.argv[1] : 実行しているスクリプトファイルのパス
  'sample.txt',              // process.argv[2] : 1つ目のユーザー引数
]
```

つまり、**ユーザーが指定した1つ目の引数は `process.argv[2]` から始まります**。`process.argv[0]` と `process.argv[1]` は、Node.js自身がどのファイルをどう実行しているかという情報であり、ユーザーが渡した値ではありません。この「0番目と1番目は決まって入っている」という点が、初めてCLIツールを作るときに混乱しやすいポイントです。

### コアロジックとCLI部分を分離する設計

この章でもっとも大事な考え方が、「**数える処理**」と「**ファイルを読んで表示する処理**」を、別々の関数に分けるという設計です。

```javascript
// コアロジック: 「テキストを受け取って、数えた結果を返す」だけの関数
function countLinesAndWords(text) {
  // ...数える処理...
  return { lines, words, characters };
}

// CLI部分: 「引数を受け取り、ファイルを読み、結果を表示する」処理
function runCli() {
  const filePath = process.argv[2];
  const text = fs.readFileSync(filePath, 'utf8');
  const result = countLinesAndWords(text);
  console.log(`行数: ${result.lines}`);
  // ...
}
```

なぜわざわざ分けるのでしょうか。理由は「**テストのしやすさ**」にあります。`countLinesAndWords` は、文字列を受け取って結果のオブジェクトを返すだけの、**純粋関数(pure function)**です。純粋関数とは、同じ入力を渡せば必ず同じ結果が返ってきて、ファイルの読み書きや画面表示のような「外の世界に影響を与える処理(副作用、side effect)」を一切含まない関数のことです。この形にしておけば、`solution.test.js` のようなテストコードから直接呼び出して、簡単に結果を確認できます。

もし `countLinesAndWords` の中に `fs.readFileSync` や `console.log` を混ぜて書いてしまうと、テストのたびに実際にファイルを用意したり、ターミナルへの出力を確認したりする必要が出てきて、テストがとても書きにくくなってしまいます。**「入力を受け取って値を返すだけの部分」と「外の世界とやり取りする部分」を分ける**というこの考え方は、CLIツールに限らず、この後の章で学ぶHTTPサーバーなど、あらゆるプログラムの設計で重要になります。

### require.main === module というお決まりの書き方

`exercise.js` や `solution.js` の末尾には、次のようなコードがあります。

```javascript
if (require.main === module) {
  runCli();
}
```

これは、「このファイルが `node solution.js` のようにターミナルから直接実行されたときだけ、CLIの処理を動かす」ためのお決まりの書き方です。`solution.test.js` からは `require('./solution')` によってこのファイルが読み込まれますが、そのときは `require.main` が `solution.test.js` の方を指すため、`runCli()` は実行されません。この仕組みのおかげで、「テストのときはコアロジックの関数だけを使い、直接実行したときはCLIとして動く」という1つのファイルで2つの役割を両立できます。

### ファイルを読み込む: fs.readFileSync

`fs`(file systemの略)は、ファイルの読み書きを行うためのNode.js標準モジュールです。`fs.readFileSync(ファイルパス, 'utf8')` は、指定したファイルの中身を**文字列として**読み込みます。

```javascript
const fs = require('node:fs');

const text = fs.readFileSync('sample.txt', 'utf8');
console.log(text); // ファイルの中身がそのまま表示される
```

第2引数の `'utf8'`(文字コードの指定)を省略すると、文字列ではなく `Buffer`(バイナリデータを表すオブジェクト)がそのまま返ってきてしまい、日本語が文字化けしたり、`split` のような文字列用のメソッドが正しく使えなかったりします。**テキストファイルを扱うときは `'utf8'` を必ず指定する**、と覚えておきましょう。

存在しないファイルパスを渡すと、`fs.readFileSync` はエラーを投げます(`throw` されます)。このため、実際のCLI部分では `try...catch` を使ってエラーを捕まえ、分かりやすいメッセージを表示してからプログラムを終了しています。

### process.exit でプログラムを終了する

`process.exit(終了コード)` は、その場でプログラムを終了させる関数です。慣習として、正常終了は `0`、何らかのエラーで終了するときは `1` を渡します。この章では、「引数が渡されなかったとき」と「ファイルが読み込めなかったとき」に、使い方や原因を表示してから `process.exit(1)` で終了しています。

## つまずきやすいポイント

- **`process.argv[0]` や `[1]` をユーザーの引数だと勘違いする**: ユーザーが渡した1つ目の引数は `process.argv[2]` です。`process.argv[0]` (nodeのパス)や `process.argv[1]` (実行中のファイルのパス)まで含めて数えてしまい、「引数がずれる」というミスがとても多いです。
- **`fs.readFileSync` に `'utf8'` を付け忘れる**: 付け忘れると `Buffer` オブジェクトがそのまま返ってきて、文字列用のメソッド(`split` など)を呼び出そうとしたときにエラーになったり、日本語が正しく表示されなかったりします。
- **末尾の改行を1行分だと数えてしまう**: テキストファイルは末尾に改行を1つ付けて保存するのが一般的です。単純に `text.split('\n')` の結果の長さをそのまま行数とすると、末尾に空文字列が1つ余計に含まれてしまい、実際より1行多く数えてしまいます。この章の実装では、末尾がちょうど空文字列のときだけ取り除くようにしています。
- **コアロジックとCLI部分を分けずに1つの関数にまとめてしまう**: `countLinesAndWords` の中で `fs.readFileSync` や `console.log` まで呼び出してしまうと、テストコードから結果だけを確認することができなくなります。「値を受け取って値を返す部分」と「ファイルや画面など外の世界とやり取りする部分」は、必ず分けて設計しましょう。

## 演習問題

`exercise.js` に、次の1つの関数を実装してください(CLI部分の `runCli` 関数はすでに実装済みなので、変更する必要はありません)。

### `countLinesAndWords(text)`

- 引数: `text`(文字列、数える対象のテキスト)
- 戻り値: `{ lines, words, characters }` という形のオブジェクト
  - `lines`(行数、数値): `text` を改行(`\n`)で区切ったときの行数。ただし、**末尾がちょうど改行で終わっている場合、その末尾の改行によってできる余分な空文字列は1行として数えない**こと(例: `"a\nb\n"` は2行、`"a\nb"` も2行)
  - `words`(単語数、数値): `text` の前後の空白を取り除いたあと、空白(半角スペース・タブ・改行など)の連続を区切りとして分割したときの要素数。空白しかない、または空文字列の場合は `0`
  - `characters`(文字数、数値): `text.length`(そのままの文字数)
- 異常系: `text` が文字列でない場合(数値、`null`、`undefined` など)は、`TypeError` を投げること
- 例: `countLinesAndWords("Hello world\nThis is a test\n")` → `{ lines: 2, words: 6, characters: 27 }`
- 例: `countLinesAndWords("")` → `{ lines: 0, words: 0, characters: 0 }`
- 例: `countLinesAndWords("a\n\nb\n")` → `{ lines: 3, words: 2, characters: 5 }`(空行も1行として数える)

**ヒント:** `text.split('\n')` で行の配列を作り、配列の最後の要素が空文字列 `''` だったときだけ `.pop()` で取り除いてから `.length` を数えるとうまくいきます。単語数は `text.trim().split(/\s+/)` の考え方が使えますが、`trim()` した結果が空文字列 `''` になる場合は特別に `0` を返す必要がある点に注意してください。

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 02-server-engineer-practice/02-cli-tool/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める

さらに、実際にCLIツールとして動かして手応えを確認してみましょう。

```bash
node 02-server-engineer-practice/02-cli-tool/solution.js 02-server-engineer-practice/02-cli-tool/sample.txt
```

同じディレクトリにある `sample.txt` を使って、行数・単語数・文字数が表示されます。自分の `exercise.js` を実装し終えたあとは、`solution.js` の部分を `exercise.js` に置き換えて、同じように実行できるか試してみてください。

```bash
node 02-server-engineer-practice/02-cli-tool/exercise.js 02-server-engineer-practice/02-cli-tool/sample.txt
```

引数を何も指定せずに実行すると、使い方が表示されて終了することも確認してみましょう。

```bash
node 02-server-engineer-practice/02-cli-tool/solution.js
```
