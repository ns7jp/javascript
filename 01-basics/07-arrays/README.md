# 配列とその操作

## この章で学ぶこと

- 配列の基本操作(`push` / `pop` / `shift` / `unshift`)で、配列の中身を追加・削除する方法
- `map` / `filter` / `reduce` / `forEach` / `find` / `some` / `every` という「配列を1つずつ処理するための便利なメソッド」の使い方
- スプレッド構文(`...`)を使って、配列をコピーしたり結合したりする方法
- 分割代入を使って、配列の中身を個別の変数に取り出す方法
- サーバー構築の現場で配列がどんな場面で登場するか(例: アクセスログの集計、複数サーバーの一覧処理など)

## 解説

### 配列とは

配列(array)とは、複数の値をひとつにまとめて順番に並べておける入れ物のことです。サーバー構築の仕事では、「監視対象のサーバー一覧」「アクセスログの記録」「ユーザーのリスト」など、同じ種類のデータがたくさん集まったものを扱う場面がとても多くあります。そのようなときに配列を使います。

```javascript
const servers = ["web01", "web02", "db01"];
console.log(servers[0]); // "web01"(配列は0番目から数える)
console.log(servers.length); // 3(要素の数)
```

### 配列の基本操作(push / pop / shift / unshift)

配列の中身を追加・削除する基本的なメソッドが4つあります。それぞれ「どちら側から」「追加なのか削除なのか」が異なります。

```javascript
const queue = ["task1", "task2"];

queue.push("task3"); // 配列の末尾に追加 → ["task1", "task2", "task3"]
queue.pop(); // 配列の末尾を削除して返す → ["task1", "task2"]
queue.unshift("task0"); // 配列の先頭に追加 → ["task0", "task1", "task2"]
queue.shift(); // 配列の先頭を削除して返す → ["task1", "task2"]
```

覚え方のコツとして、`push`/`pop` は「末尾(お尻)」、`unshift`/`shift` は「先頭(頭)」に対する操作だと覚えるとよいでしょう。**これらのメソッドは元の配列そのものを書き換える(「破壊的」と呼ばれる)** ので注意が必要です。新しい配列を作りたい場合はコピーしてから操作するか、後述するスプレッド構文を使います。

### map: 配列の各要素を「変換」する

`map` は、配列の各要素に対して同じ処理を行い、その結果からなる**新しい配列**を作るメソッドです。「元の配列と同じ長さの、加工済みの配列がほしい」というときに使います。

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6]
console.log(numbers); // [1, 2, 3](元の配列は変更されない)
```

`map` に渡す関数のことを「コールバック関数」と呼びます。配列の要素を1つずつ受け取り、変換後の値を `return` することで、その値が新しい配列の対応する位置に入ります。

### filter: 配列から「条件に合うものだけ」を取り出す

`filter` は、配列の各要素をチェックし、コールバック関数が `true` を返した要素だけを集めた**新しい配列**を作るメソッドです。

```javascript
const people = [
  { name: "田中", age: 25 },
  { name: "佐藤", age: 16 },
  { name: "鈴木", age: 40 },
];

const adults = people.filter((person) => person.age >= 18);
console.log(adults);
// [{ name: "田中", age: 25 }, { name: "鈴木", age: 40 }]
```

`map` は「要素数はそのままで中身を変換する」、`filter` は「要素数が減るかもしれないが中身は変換しない(条件で選別するだけ)」という違いを意識すると使い分けやすくなります。

### reduce: 配列を「1つの値」に集約する

`reduce` は配列の全要素を順番に処理しながら、最終的に**1つの値**にまとめるメソッドです。合計金額の計算や、配列の中から最大値を求める、といった処理に向いています。

```javascript
const items = [{ price: 100 }, { price: 200 }, { price: 300 }];

const total = items.reduce((accumulator, item) => {
  return accumulator + item.price;
}, 0); // 0は「初期値」(accumulatorの最初の値)

console.log(total); // 600
```

`reduce` は最初は少し分かりにくいメソッドですが、動きを分解すると次のようになります。

| 呼び出し回数 | accumulator(それまでの累計) | item        | 戻り値(次のaccumulator) |
| ------------ | ------------------------------ | ----------- | -------------------------- |
| 1回目        | 0(初期値)                     | `{price:100}` | 100                       |
| 2回目        | 100                             | `{price:200}` | 300                       |
| 3回目        | 300                             | `{price:300}` | 600                       |

**`reduce` の第2引数(初期値)を省略すると、配列の最初の要素が初期値として扱われてしまい、意図しない結果になることがあります。** 合計を計算する場合は、必ず初期値として `0` を渡す癖をつけましょう。

### forEach: 配列の各要素に対して「何かをする」(値は作らない)

`forEach` は `map` に似ていますが、**新しい配列を作らない**点が違います。「配列の中身をコンソールに出力したい」「1件ずつログを送信したい」など、戻り値が不要な繰り返し処理に使います。

```javascript
const servers = ["web01", "web02"];
servers.forEach((server) => {
  console.log(`${server} を再起動します`);
});
```

`forEach` の戻り値は常に `undefined` です。「変換した配列がほしい」場合は `map` を、「1つずつ何かの処理を実行したいだけ」の場合は `forEach` を使う、と覚えましょう。

### find / some / every: 配列の中身を調べる

- `find`: 条件に合う**最初の1つの要素**を返す(見つからなければ `undefined`)
- `some`: 条件に合う要素が**1つでもあれば** `true`
- `every`: **全ての要素**が条件に合えば `true`

```javascript
const servers = [
  { name: "web01", status: "ok" },
  { name: "web02", status: "down" },
  { name: "db01", status: "ok" },
];

const downServer = servers.find((s) => s.status === "down");
console.log(downServer); // { name: "web02", status: "down" }

const hasDownServer = servers.some((s) => s.status === "down");
console.log(hasDownServer); // true

const allOk = servers.every((s) => s.status === "ok");
console.log(allOk); // false
```

「1台でも障害が起きているサーバーがないか調べる」ときは `some`、「全てのサーバーが正常かどうかを確認する」ときは `every` が使えます。サーバー監視の考え方そのものに近いメソッドなので、意味とセットで覚えておくと実務でも役立ちます。

### スプレッド構文(`...`)

スプレッド構文は、配列(やオブジェクト)の中身を「展開」するための書き方です。配列を安全にコピーしたり、複数の配列を結合したりするときによく使います。

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

const copy = [...arr1]; // arr1のコピー(元のarr1とは別の配列)
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
```

`Set` というオブジェクトと組み合わせると、重複を取り除きながら配列を結合できます。`Set` は「重複した値を自動的に除いてくれる集合」のようなデータ構造です。

```javascript
const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4];

const uniqueMerged = [...new Set([...arr1, ...arr2])];
console.log(uniqueMerged); // [1, 2, 3, 4]
```

`new Set([...arr1, ...arr2])` の部分で、まず2つの配列を結合し、それを `Set` に変換することで重複を取り除いています。その後、再びスプレッド構文 `[...]` で配列に戻しています。

### 分割代入(配列版)

分割代入とは、配列の中身を個別の変数に一気に取り出す書き方です。

```javascript
const [first, second] = ["web01", "web02", "db01"];
console.log(first); // "web01"
console.log(second); // "web02"

// 残りをまとめて受け取りたい場合はスプレッド構文と組み合わせる
const [head, ...rest] = ["web01", "web02", "db01"];
console.log(head); // "web01"
console.log(rest); // ["web02", "db01"]
```

## つまずきやすいポイント

- **`push`/`pop`/`shift`/`unshift` は元の配列を直接書き換える**: `map` や `filter` が新しい配列を返すのとは対照的に、これらは「元の配列そのもの」を変更します。元のデータを残しておきたい場合は、事前にスプレッド構文でコピーしてから操作しましょう。
- **`reduce` の初期値(第2引数)を書き忘れる**: 初期値を省略すると、配列の最初の要素が初期値として扱われてしまい、計算が1つずれてしまうことがあります。特に合計を計算するときは `reduce((acc, item) => ..., 0)` のように必ず `0` を明示しましょう。
- **`map` と `forEach` を混同する**: `map` は新しい配列を「作る」メソッド、`forEach` は配列を「作らない」メソッドです。`forEach` の戻り値を変数に入れて使おうとすると `undefined` になってしまい、意図した結果になりません。
- **`find` と `filter` を混同する**: `find` は条件に合う最初の1件(要素そのもの)を返しますが、`filter` は条件に合う全件を配列として返します。「1件だけ欲しいのか」「複数件欲しいのか」を意識して使い分けましょう。

## 演習問題

`exercise.js` に、次の4つの関数を実装してください。

### 1. `doubleAll(numbers)`

- 引数: `numbers`(数値の配列)
- 戻り値: 各要素を2倍にした**新しい配列**
- **`map` を使って実装してください。**
- 例: `doubleAll([1, 2, 3])` → `[2, 4, 6]`
- 例: `doubleAll([])` → `[]`(空配列を渡したら空配列を返す)

### 2. `filterAdults(people)`

- 引数: `people`(`{ name: string, age: number }` の形をしたオブジェクトの配列)
- 戻り値: `age` が18以上の人だけを集めた**新しい配列**(元の並び順を保つこと)
- **`filter` を使って実装してください。**
- 例: `filterAdults([{ name: "A", age: 20 }, { name: "B", age: 10 }])` → `[{ name: "A", age: 20 }]`
- 例: 18歳ちょうどの人は含める(境界値)

### 3. `totalPrice(items)`

- 引数: `items`(`{ price: number }` の形をしたオブジェクトの配列)
- 戻り値: 全ての `price` を合計した数値
- **`reduce` を使い、初期値には必ず `0` を渡して実装してください。**
- 例: `totalPrice([{ price: 100 }, { price: 200 }])` → `300`
- 例: `totalPrice([])` → `0`(空配列なら合計は0)

### 4. `mergeUnique(arr1, arr2)`

- 引数: `arr1`, `arr2`(どちらも配列)
- 戻り値: `arr1` と `arr2` を結合し、重複を取り除いた**新しい配列**
- **スプレッド構文と `Set` を使って実装してください。**
- 要素の順番は「最初に登場した順」になっていれば問題ありません(`Set` は挿入順を保持します)
- 例: `mergeUnique([1, 2, 3], [2, 3, 4])` → `[1, 2, 3, 4]`
- 例: `mergeUnique([], [1, 1, 2])` → `[1, 2]`

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/07-arrays/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
