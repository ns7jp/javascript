# 非同期処理

## この章で学ぶこと

- 「非同期処理」とは何か、なぜサーバー構築エンジニアにとって重要な考え方なのか
- コールバック関数を使った非同期処理の書き方と、その問題点(コールバック地獄)
- Promise の基本(`then` / `catch` / `resolve` / `reject`)の使い方
- `async` / `await` を使って、非同期処理を同期処理のように読みやすく書く方法
- `Promise.all` を使って、複数の非同期処理を並行して実行する方法

## 解説

### 非同期処理とは何か

「非同期処理」とは、「時間のかかる処理の完了を待たずに、他の処理を先に進められる仕組み」のことです。例えば、外部のAPI(他のサーバーが提供する窓口)にデータを取りに行く処理や、ファイルを読み書きする処理は、一瞬では終わりません。もし「完了するまで他の処理が一切できない」という仕組み(これを「同期処理」と呼びます)だったら、サーバーは1人のお客さんの処理が終わるまで、他のお客さんを待たせ続けることになってしまいます。

Node.js(サーバー側で動くJavaScriptの実行環境)は、この「時間のかかる処理」を裏側(バックグラウンド)で進めながら、他の処理も並行してこなせるように設計されています。サーバー構築の現場では、「データベースへの問い合わせ」「外部APIへのリクエスト」「ファイルの読み書き」など、非同期処理を扱う場面が非常に多いため、この章の内容はとても重要です。

### コールバック関数とその問題点

JavaScriptには昔から、「処理が終わったら呼んでほしい関数」をあらかじめ渡しておく、という書き方があります。この「後で呼んでもらう関数」のことを「コールバック関数」と呼びます。

```javascript
function fetchDataWithCallback(id, callback) {
  setTimeout(() => {
    // 1秒後に、callback関数を呼び出す
    callback(null, { id, name: `ユーザー${id}` });
  }, 1000);
}

fetchDataWithCallback(1, (err, user) => {
  console.log(user); // { id: 1, name: "ユーザー1" }
});
```

この書き方自体は動きますが、「複数の非同期処理を順番に行いたい」場合に問題が起こります。例えば「ユーザー1を取得してから、その結果を使ってユーザー2を取得し、さらにユーザー3を取得する」という処理をコールバック関数だけで書くと、次のようにどんどん右にネストしていきます。

```javascript
fetchDataWithCallback(1, (err1, user1) => {
  fetchDataWithCallback(2, (err2, user2) => {
    fetchDataWithCallback(3, (err3, user3) => {
      console.log(user1, user2, user3);
      // 処理を増やすたびに、さらに右へ右へとネストが深くなっていく…
    });
  });
});
```

この「コールバック関数のネストがどんどん深くなり、コードが読みにくくなる現象」のことを、俗に「コールバック地獄(callback hell)」と呼びます。エラー処理(それぞれの階層で `err1`、`err2`、`err3` を毎回チェックする必要がある)も煩雑になり、コードの見通しが悪くなってしまいます。この問題を解決するために生まれたのが、次に説明する「Promise」という仕組みです。

### Promise の基本

Promise(プロミス、「約束」の意味)とは、「非同期処理の結果を表すオブジェクト」です。Promiseは「まだ結果が出ていない(pending)」「成功した(fulfilled)」「失敗した(rejected)」のいずれかの状態を持ち、成功したときの処理は `then`、失敗したときの処理は `catch` を使って登録します。

```javascript
function fetchDataWithPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: `ユーザー${id}` }); // 成功したとき
      } else {
        reject(new Error('idは正の数である必要があります')); // 失敗したとき
      }
    }, 1000);
  });
}

fetchDataWithPromise(1)
  .then((user) => {
    console.log(user); // 成功したときにここが呼ばれる
  })
  .catch((error) => {
    console.error(error.message); // 失敗したときにここが呼ばれる
  });
```

`new Promise((resolve, reject) => { ... })` という形で、Promiseを新しく作ります。渡した関数の中で、処理が成功したら `resolve(結果の値)` を、失敗したら `reject(エラー)` を呼び出します。呼び出す側は、`.then(結果を受け取る関数)` で成功時の処理を、`.catch(エラーを受け取る関数)` で失敗時の処理を登録します。

Promiseを使うと、`.then` を複数つなげる(チェーンする)ことで、コールバック関数のように右にネストせずに「順番に処理を行う」ことができます。

```javascript
fetchDataWithPromise(1)
  .then((user1) => {
    console.log(user1);
    return fetchDataWithPromise(2); // .thenの中でPromiseをreturnすると、次の.thenに繋がる
  })
  .then((user2) => {
    console.log(user2);
    return fetchDataWithPromise(3);
  })
  .then((user3) => {
    console.log(user3);
  })
  .catch((error) => {
    // どこかの段階で失敗しても、まとめてここでキャッチできる
    console.error(error.message);
  });
```

### async / await

Promiseによってコールバック地獄は解消されましたが、`.then` を何度もつなげる書き方も、処理が増えるとまだ少し読みにくく感じられます。そこで登場したのが `async` / `await` という書き方です。これはPromiseを土台にした「シンタックスシュガー(見た目をより読みやすくするための書き方)」で、非同期処理を、まるで同期処理のように上から下へ順番に書けるようにしてくれます。

```javascript
async function main() {
  try {
    const user1 = await fetchDataWithPromise(1); // Promiseの結果が出るまで待つ
    console.log(user1);
    const user2 = await fetchDataWithPromise(2);
    console.log(user2);
  } catch (error) {
    // awaitしている処理がrejectされると、ここでキャッチできる
    console.error(error.message);
  }
}
```

`async function` と宣言した関数の中でだけ、`await` というキーワードが使えます。`await プロミス` と書くと、そのPromiseが成功するまで(見た目上は)処理を止めて待ち、成功した場合はその結果の値を返してくれます。失敗(reject)した場合は、その場で `throw` されたのと同じ扱いになるため、`try` / `catch` でエラーを捕まえられます。

また、`async function` は必ず「Promiseを返す関数」になります。関数の中で `return 値` と書くと、その値でresolveされたPromiseが返され、`throw エラー` と書くと、そのエラーでrejectされたPromiseが返されます。

歴史的な流れをまとめると、「コールバック関数(古いスタイル、ネストが深くなりがち)」→「Promise(`then`/`catch`でチェーンできるようになった)」→「async/await(Promiseを土台に、同期処理のように読みやすく書けるようになった)」という順番で、JavaScriptの非同期処理の書き方は進化してきました。現在は基本的に `async` / `await` を使うのが主流ですが、内部で動いているのはあくまでPromiseなので、Promiseの仕組みを理解しておくことはとても大切です。

### Promise.all で複数の非同期処理を並行実行する

「ユーザー1、2、3をそれぞれ取得したい」場合、`await` を1つずつ順番に書くと、次のように「1つ取得し終わってから次を取得する」という**直列(逐次)処理**になってしまいます。

```javascript
async function fetchSequentially() {
  const user1 = await fetchDataWithPromise(1); // 1秒待つ
  const user2 = await fetchDataWithPromise(2); // さらに1秒待つ
  const user3 = await fetchDataWithPromise(3); // さらに1秒待つ
  return [user1, user2, user3]; // 合計で約3秒かかる
}
```

しかし、この3つの処理はお互いに関係のない、独立した処理です。それなら、3つを同時に(並行して)開始し、まとめて完了を待った方が効率的です。それを実現するのが `Promise.all` です。

```javascript
async function fetchInParallel() {
  const results = await Promise.all([
    fetchDataWithPromise(1),
    fetchDataWithPromise(2),
    fetchDataWithPromise(3),
  ]);
  return results; // [user1, user2, user3] という配列で、約1秒で完了する
}
```

`Promise.all([p1, p2, p3])` は、配列で渡した全てのPromiseが成功するまで待ち、それぞれの結果を**渡した順番のまま**配列にまとめて返してくれます。3つの処理がそれぞれ1秒かかっても、同時に実行されるため、全体では約1秒(一番時間がかかったもの)で完了します。

ただし、`Promise.all` は「渡したPromiseのうち、1つでも失敗(reject)すると、他の処理の結果を待たずに、その時点ですぐ全体が失敗(reject)する」という性質(fail-fast、失敗したら即座に終了する、という意味)を持っています。この性質は、後述の「つまずきやすいポイント」でも触れます。

## つまずきやすいポイント

- **`await` を書き忘れて、Promiseオブジェクトそのものを扱ってしまう**: `const user = fetchUserById(1);` のように `await` を付け忘れると、`user` には「ユーザー情報」ではなく「Promiseオブジェクト自体」が入ってしまいます。`console.log(user)` としても `Promise { <pending> }` のように表示され、意図した値が取れません。非同期関数の結果を使いたいときは、必ず `await` を付けましょう。
- **`forEach` の中で `async` / `await` を使っても、待ってくれない**: `ids.forEach(async (id) => { await fetchUserById(id); })` のように書くと、`forEach` は各コールバックの完了を待たずに次々と呼び出しを進めてしまいます。複数の非同期処理を順番に待ちたい・まとめて待ちたい場合は、`for...of` ループの中で `await` するか、この章で学ぶ `Promise.all` を使いましょう。
- **`Promise.all` は「1つでも失敗したら全体が失敗する」ことを知らない**: `Promise.all` は、途中経過や「成功したものだけ」を返してくれるわけではありません。渡したPromiseのうち1つでもrejectされると、他がまだ処理中であっても、その時点で全体がrejectされます。「一部が失敗しても、成功したものだけ結果がほしい」場合は、この章では扱いませんが `Promise.allSettled` という別の仕組みを使う必要があります。
- **`try` / `catch` を置く場所を間違え、エラーを捕まえ損ねる**: `async` 関数の中で `await` している処理がrejectされたときにエラーを捕まえたい場合、`await` している行を `try` ブロックの中に入れる必要があります。`try` の外に `await` を書いてしまうと、エラーが捕まえられず、プログラムが意図しない形で止まってしまうことがあります。

## 演習問題

`exercise.js` に、次の3つの関数を実装してください。

### 1. `delay(ms)`

- 引数: `ms`(待ちたい時間をミリ秒で表した数値)
- 戻り値: `ms` ミリ秒経過した後にresolveされる `Promise`
- **`setTimeout` を使って実装してください。** `new Promise((resolve) => { ... })` の中で `setTimeout` を呼び出し、指定時間が経過したら `resolve()` を呼びます。
- 例: `await delay(1000)` と書くと、その行で約1秒間処理が止まる(待たされる)。

### 2. `fetchUserById(id)`

- 引数: `id`(取得したいユーザーのID、数値)
- 戻り値: ユーザー情報を表す `Promise`
- `id` が `1`、`2`、`3` のいずれかの場合、`delay` を使って少し待ってから、次のようなダミーのユーザーオブジェクトでresolveしてください。

  | id | name | email |
  | --- | --- | --- |
  | 1 | 田中太郎 | tanaka@example.com |
  | 2 | 鈴木花子 | suzuki@example.com |
  | 3 | 佐藤次郎 | sato@example.com |

- `id` が `1`、`2`、`3` 以外の場合は、`delay` を使って少し待ってから、`Error`(例: `` `ユーザーが見つかりません: id=${id}` ``というメッセージ)でrejectしてください。
- **`async` / `await` を使って実装してください。** `await delay(...)` で待った後、条件によって `return`(成功)するか `throw`(失敗)するかを分岐させます。
- 例: `await fetchUserById(1)` → `{ id: 1, name: "田中太郎", email: "tanaka@example.com" }`
- 例: `await fetchUserById(999)` → `Error` がthrowされる(呼び出し側は `try/catch` や `.catch` で受け取る)

### 3. `fetchAllUsers(ids)`

- 引数: `ids`(取得したいユーザーIDの配列)
- 戻り値: 取得したユーザー情報の配列を表す `Promise`(`ids` の順序を保つこと)
- **`Promise.all` を使って、複数の `fetchUserById` 呼び出しを並行して実行してください。** 1件ずつ `await` する(直列処理になる)のではなく、まず `ids.map(...)` で複数のPromiseを作り、それらをまとめて `Promise.all` で待つ、という流れで実装します。
- 例: `await fetchAllUsers([1, 2, 3])` → `[{id:1,...}, {id:2,...}, {id:3,...}]`(3件を並行して取得する)
- 例: `await fetchAllUsers([])` → `[]`(空配列を渡したら空配列が返る)
- 例: `ids` の中に無効なIDが1つでも含まれていれば、`Promise.all` の性質上、全体がrejectされる

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/11-async/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
