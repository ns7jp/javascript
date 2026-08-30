# エラーハンドリング

## この章で学ぶこと

- `try` / `catch` / `finally` を使って、エラーが起きた場合の処理を書く方法
- `throw` 文を使って、自分から意図的にエラーを発生させる方法
- JavaScriptの `Error` オブジェクトが持つ `message` / `name` などのプロパティ
- `class ValidationError extends Error` のように、独自の(自作の)エラークラスを作る方法
- 「エラーを黙って握りつぶさない」「エラーの種類によって処理を分ける」という、実務でも重要な考え方

## 解説

### なぜエラーハンドリングが必要なのか

プログラムは、常に想定通りに動くとは限りません。例えば、サーバーの台数を設定ファイルから読み込むはずが、設定ファイルの中身が空だったり、数値のはずが文字列になっていたりすることがあります。こうした「想定外の状況」が起きたときに、プログラムがいきなり停止してしまったり、原因の分からないまま処理を続けてしまったりするのは困りものです。

エラーハンドリング(error handling、エラー処理)とは、「こういう想定外の状況が起きたら、こう対処する」という処理をあらかじめ書いておくことです。特にサーバー構築の現場では、「設定ファイルの値が不正だった」「外部サービスへの接続に失敗した」といった状況が日常的に起こるため、エラーハンドリングの知識は欠かせません。

### throw文とErrorオブジェクト

`throw` 文を使うと、自分の意思でエラーを発生させることができます。何をエラーとして投げるかは自由ですが、基本的には組み込みの `Error` オブジェクト(またはそれを継承したクラス)を使うのが慣習です。

```javascript
function checkServerCount(count) {
  if (count <= 0) {
    throw new Error('サーバー台数は1台以上である必要があります。');
  }
  return count;
}
```

`Error` オブジェクトは `message`(エラーの内容を表す文字列)というプロパティを持っています。`new Error('メッセージ')` のように、コンストラクタ(オブジェクトを作るときに呼ばれる特別な関数)にメッセージを渡すことで、`error.message` からそのメッセージを取り出せるようになります。`error.name` というプロパティもあり、標準の `Error` では `"Error"` という文字列が入っています(後述するカスタムエラークラスでは、この `name` を変更できます)。

### try / catch / finally

`throw` されたエラーをキャッチ(捕まえる)して、プログラムが停止しないように処理を続けるには `try` / `catch` を使います。

```javascript
try {
  checkServerCount(0); // ここでエラーがthrowされる
  console.log('ここは実行されない');
} catch (error) {
  console.log(`エラーが発生しました: ${error.message}`);
}
```

`try` ブロックの中で書いたコードを実行し、もしエラーが `throw` されたら、その時点で `try` ブロックの残りの処理は中断され、`catch` ブロックに処理が移ります。`catch (error)` の `error` には、投げられたエラーオブジェクトそのものが入ります。

`finally` ブロックを追加すると、「エラーが発生してもしなくても、必ず最後に実行したい処理」を書くことができます。ロードバランサー(複数のサーバーにアクセスを振り分ける仕組み)への接続を試して、成功しても失敗しても必ず接続を閉じたい、というような場面で使われます。

```javascript
function connectAndCheck() {
  try {
    console.log('接続を試みます');
    throw new Error('接続に失敗しました');
  } catch (error) {
    console.log(`失敗: ${error.message}`);
  } finally {
    console.log('接続を閉じます'); // 成功・失敗どちらでも必ず実行される
  }
}
```

### カスタムエラークラス(class ValidationError extends Error)

すべてのエラーを標準の `Error` だけで表現しようとすると、`catch` した側で「これはどんな種類のエラーなのか」を区別しにくくなります。そこで、`Error` を継承(`extends`。あるクラスの機能を引き継いで、新しいクラスを作ること)した「自作のエラークラス」を作ることがよくあります。

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message); // 親クラス(Error)のコンストラクタを呼び出し、messageを設定する
    this.name = 'ValidationError'; // エラーの種類が分かるように名前を上書きする
  }
}

const error = new ValidationError('入力値が不正です。');
console.log(error.message); // "入力値が不正です。"
console.log(error.name); // "ValidationError"
console.log(error instanceof Error); // true(Errorを継承しているので)
console.log(error instanceof ValidationError); // true
```

`super(message)` は、「親クラスである `Error` のコンストラクタを、`message` を渡して呼び出す」という意味です。派生クラス(継承して作った側のクラス)のコンストラクタでは、`this`(自分自身)を使う前に必ず `super()` を呼び出す必要があります(これを忘れると実行時にエラーになります)。

こうして作ったカスタムエラークラスを使うと、`catch` した側で `error instanceof ValidationError` のように「エラーの種類」を確認し、種類に応じて処理を分けることができます。「入力値が不正だった場合はユーザーに分かりやすいメッセージを返す。それ以外の予期しないエラーは、原因調査のためにそのまま上位に伝える(再度throwする)」といった使い分けが可能になります。

```javascript
try {
  // 何らかの処理
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`入力エラー: ${error.message}`);
  } else {
    throw error; // 想定外のエラーは握りつぶさず、そのまま投げ直す
  }
}
```

### 実践例: 環境変数のパースとエラーハンドリング

Node.jsでサーバーを構築する際、設定値を環境変数(`process.env.設定名` のような形で読み込める、OSやコンテナが提供する文字列の値)から読み込むことがよくあります。ここで重要な注意点があります。**環境変数の値は、常に文字列(string)として渡ってきます。** たとえ中身が `"3"` のような数字に見えても、JavaScript上では文字列型のデータです。そのため、計算に使う前には必ず数値に変換する必要があります。

```javascript
const totalRequestsStr = process.env.TOTAL_REQUESTS; // 例: "1000"(文字列)
const serverCountStr = process.env.SERVER_COUNT; // 例: "0"(文字列。読み込み忘れなら undefined)

const totalRequests = Number(totalRequestsStr);
const serverCount = Number(serverCountStr);
```

ここで、`serverCount` が `0`(サーバーが1台も登録されていない)だった場合、「1台あたりのリクエスト数」を計算しようとすると0で割ることになってしまいます。これは数学的に不可能な計算であり、プログラム上でも許可すべきではありません。このような「計算上あってはならない入力」を検知して `throw` するのが、まさにこの章で学ぶエラーハンドリングです。

## つまずきやすいポイント

- **`super()` を呼び忘れる、または `this` を使った後に呼ぶ**: 派生クラス(`extends` で継承したクラス)のコンストラクタでは、`this.name = ...` のように `this` を使うより前に、必ず `super(message)` を呼び出す必要があります。順序を間違えると実行時にエラーになります。
- **`catch` の中で全てのエラーを同じように扱ってしまう**: `catch (error) { ... }` は、想定していたエラー(例: `ValidationError`)だけでなく、コードのバグによる予期しないエラーまで全て捕まえてしまいます。`error instanceof ValidationError` のように種類を確認せずに「エラーメッセージをそのまま表示して終わり」にしてしまうと、本来気づくべきバグを見逃してしまう危険があります。
- **`finally` の中で `return` してしまう**: `finally` ブロックの中で `return` 文を書くと、`try` や `catch` で決まっていた戻り値が上書きされてしまいます。これは非常に分かりにくいバグの原因になるため、`finally` は「ログを出す」「後片付けをする」など、戻り値に関係のない処理だけを書くようにしましょう。
- **`Number("")` が `NaN` にならず `0` になる**: 空文字列を `Number()` に渡すと `NaN`(Not a Numberの略。数値として扱えないことを表す特別な値)ではなく `0` になります。「未入力なら空文字列のはず、空文字列なら弾かれるはず」と思い込んでいると、意図せず `0` として計算が通ってしまうことがあるため注意が必要です。

## 演習問題

`exercise.js` に、次のクラスと2つの関数を実装してください。

### 1. `class ValidationError extends Error`

- コンストラクタは `message`(文字列)を1つ受け取る
- `super(message)` を呼び出したうえで、`this.name` に `'ValidationError'` を設定すること
- 例: `new ValidationError('テスト').message` → `'テスト'`
- 例: `new ValidationError('テスト').name` → `'ValidationError'`
- 例: `new ValidationError('テスト') instanceof Error` → `true`

### 2. `safeDivide(a, b)`

- 引数: `a`(数値、割られる数)、`b`(数値、割る数)
- `b` が `0` の場合、`new ValidationError('0で割ることはできません。')` を `throw` する
- `b` が `0` 以外の場合、`a / b` の計算結果(数値)を返す
- 例: `safeDivide(10, 2)` → `5`
- 例: `safeDivide(10, 0)` → `ValidationError` がthrowされる

### 3. `parseAndDivide(aStr, bStr)`

- 引数: `aStr`、`bStr`(どちらも文字列。数値に見える文字列が渡ってくる想定)
- 内部で `try` / `catch` / `finally` を使うこと
- 処理の流れ:
  1. `Number(aStr)` と `Number(bStr)` で数値に変換する
  2. どちらかが `NaN`(数値として解釈できない)であれば、`new ValidationError` で「"<aStr>" または "<bStr>" は数値として解釈できません。」というメッセージのエラーを `throw` する
  3. 変換できたら `safeDivide` を呼び出して計算する
  4. `catch` ブロックで、捕まえたエラーが `ValidationError` のインスタンスであれば `` `エラー: ${error.message}` `` という文字列を戻り値として用意する。`ValidationError` ではない(想定外の)エラーの場合は、そのまま `throw error;` で投げ直す
  5. 計算に成功した場合は `` `計算結果: ${結果}` `` という文字列を戻り値として用意する
  6. `finally` ブロックで、`console.log('parseAndDivideの処理を終了しました。')` を実行する(成功・失敗どちらの場合も必ず実行されることを確認するため)
  7. 最終的に、用意しておいた戻り値の文字列を関数の最後で `return` する
- 例: `parseAndDivide('10', '2')` → `"計算結果: 5"`
- 例: `parseAndDivide('10', '0')` → `"エラー: 0で割ることはできません。"`
- 例: `parseAndDivide('abc', '2')` → `"エラー: \"abc\" または \"2\" は数値として解釈できません。"`
- 例: `parseAndDivide('', '5')` → `"計算結果: 0"`(`Number('')` は `0` になる、という「つまずきやすいポイント」で説明した挙動に注意)

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/10-error-handling/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
