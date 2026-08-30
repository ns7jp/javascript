# オブジェクト

## この章で学ぶこと

- オブジェクトリテラル(`{ key: value }`)を使って、関連するデータをひとまとめにする方法
- オブジェクトのプロパティ(値)を後から追加・変更・削除する方法
- メソッド(オブジェクトが持つ関数)と、その中で使われる `this` の意味
- 分割代入とスプレッド構文を使って、オブジェクトを楽に扱う方法
- `Object.keys` / `Object.values` / `Object.entries` を使って、オブジェクトの中身をまとめて調べる方法

## 解説

### オブジェクトとは

オブジェクトとは、「名前(キー)」と「値」のペアを複数まとめて持つことができるデータの入れ物です。配列が「順番に並んだデータの集まり」だったのに対し、オブジェクトは「名前付きのデータの集まり」だとイメージすると分かりやすいでしょう。サーバー構築の現場では、「1台のサーバーが持つ複数の情報(名前・IPアドレス・稼働状態など)」のように、関連する情報をひとまとめにしたいときにオブジェクトを使います。

```javascript
const server = {
  name: "web01",
  ipAddress: "192.168.1.10",
  isRunning: true,
};

console.log(server.name); // "web01"(ドット記法)
console.log(server["ipAddress"]); // "192.168.1.10"(ブラケット記法)
```

`{ key: value }` という書き方のことを「オブジェクトリテラル」と呼びます。プロパティ(`name` や `ipAddress` のような、オブジェクトが持つ個々の値のこと)へのアクセスには、`.`(ドット記法)と `[]`(ブラケット記法)の2種類があります。プロパティ名が変数に入っている場合や、プロパティ名にハイフンなど特殊な文字を含む場合は、ブラケット記法を使う必要があります。

### プロパティの追加・変更・削除

オブジェクトは作った後からでも、自由にプロパティを追加・変更・削除できます。

```javascript
const server = { name: "web01" };

server.ipAddress = "192.168.1.10"; // 追加
server.name = "web02"; // 変更(上書き)
delete server.ipAddress; // 削除

console.log(server); // { name: "web02" }
```

`delete` はプロパティそのものを完全に取り除きます。「値を `undefined` にする」のと「`delete` でプロパティ自体をなくす」のは似ているようで異なる操作です。`delete` した後は `"ipAddress" in server` が `false` になりますが、値を `undefined` に代入しただけの場合は `"ipAddress" in server` は `true` のままです。

### メソッドと `this`

オブジェクトのプロパティには、関数を持たせることもできます。オブジェクトが持つ関数のことを「メソッド」と呼びます。メソッドの中では、`this` というキーワードを使って「このメソッドを呼び出したオブジェクト自身」を参照できます。

```javascript
const user = {
  name: "田中",
  age: 25,
  greet() {
    // thisは「このメソッドを呼び出したオブジェクト(=user)」を指す
    return `こんにちは、${this.name}です。`;
  },
};

console.log(user.greet()); // "こんにちは、田中です。"
```

**`this` は「関数がどのように定義されたか」ではなく「関数がどのように呼び出されたか」によって決まる**という点が、初心者がつまずきやすいポイントです。上の例では `user.greet()` という形で呼び出されているため、`this` は `user` を指します。もし `greet` を `user` から切り離して単独で呼び出すと、`this` は期待通りのオブジェクトを指さなくなってしまいます(詳しくは後の章で扱いますが、ここでは「`obj.method()` の形で呼べば `this` は `obj` になる」と覚えておけば十分です)。

なお、アロー関数(`() => {}`)を使ってメソッドを定義すると、`this` の挙動が通常の関数と異なる(アロー関数は自分自身の `this` を持たない)ため、オブジェクトのメソッドを定義するときは、上の例のような通常の関数の書き方(または `greet: function() {}`)を使うのが基本です。

### 分割代入(オブジェクト版)

分割代入を使うと、オブジェクトから必要なプロパティだけを取り出して、変数として使うことができます。

```javascript
const user = { name: "田中", age: 25, email: "tanaka@example.com" };

const { name, age } = user;
console.log(name); // "田中"
console.log(age); // 25
```

**オブジェクトの分割代入では、変数名はプロパティ名と一致させる必要があります**(配列の分割代入が「並び順」で決まるのとは違う点に注意してください)。別の変数名を使いたい場合は `const { name: userName } = user;` のように書きます。

### スプレッド構文(オブジェクト版)

配列と同様に、オブジェクトにもスプレッド構文が使えます。オブジェクトをコピーしたり、複数のオブジェクトをマージ(統合)したりするときによく使います。

```javascript
const defaults = { timeout: 30, retry: 3 };
const overrides = { timeout: 60 };

const settings = { ...defaults, ...overrides };
console.log(settings); // { timeout: 60, retry: 3 }
```

**スプレッド構文でオブジェクトをマージするときは、後に書いたオブジェクトのプロパティが優先されます(上書きされます)。** 上の例では `defaults` の `timeout: 30` が、後から展開された `overrides` の `timeout: 60` によって上書きされています。この性質を使うと、「基本設定(デフォルト値)」に「個別の上書き設定」を重ねる、という処理が簡単に書けます。

### Object.keys / Object.values / Object.entries

オブジェクトの中身をまとめて調べたいときは、`Object` が用意している3つのメソッドが便利です。

```javascript
const server = { name: "web01", port: 8080, isRunning: true };

console.log(Object.keys(server)); // ["name", "port", "isRunning"](キーの配列)
console.log(Object.values(server)); // ["web01", 8080, true](値の配列)
console.log(Object.entries(server));
// [["name", "web01"], ["port", 8080], ["isRunning", true]](キーと値のペアの配列)
```

いずれも「配列」を返すので、これまでに学んだ `map` や `filter`、`forEach` などと組み合わせて使うことができます。例えば「オブジェクトのプロパティ数を数えたい」場合は `Object.keys(obj).length` とすれば求められます。

## つまずきやすいポイント

- **`this` の指す先を勘違いする**: `this` は「定義した場所」ではなく「呼び出し方」で決まります。`obj.method()` のように、オブジェクトを通して呼び出したときだけ `this` はそのオブジェクトを指します。メソッドを変数に代入して単独で呼び出すと `this` が期待通りにならないことがあるので注意しましょう。
- **オブジェクトの分割代入で変数名を間違える**: `const { name, age } = user;` のように、**プロパティ名と同じ名前**で変数を取り出す必要があります(配列の分割代入のような「順番」ではありません)。プロパティ名を間違えると `undefined` になってしまいます。
- **スプレッド構文でのマージ順序を勘違いする**: `{ ...defaults, ...overrides }` は「後に書いたほうが優先される」ため、順番を逆にすると意図しない結果になります。「デフォルト値を先、上書きしたい値を後」に書くのが基本です。
- **`delete` と `undefined` の代入を混同する**: `delete obj.key` はプロパティ自体を取り除きますが、`obj.key = undefined` はプロパティ自体は残ったまま値だけが `undefined` になります。`Object.keys` の結果や `in` 演算子の結果が変わってくるため、意図に応じて使い分けましょう。

## 演習問題

`exercise.js` に、次の4つの関数を実装してください。

### 1. `createUser(name, age)`

- 引数: `name`(文字列)、`age`(数値)
- 戻り値: `{ name, age }` の形をしたオブジェクト
- 「値を受け取ってオブジェクトを組み立てて返す関数」を「ファクトリ関数」と呼びます。オブジェクトリテラルの短縮記法(プロパティ名と変数名が同じ場合、`{ name: name }` を `{ name }` と省略できる書き方)を使って実装してください。
- 例: `createUser("田中", 25)` → `{ name: "田中", age: 25 }`

### 2. `summarizeUser(user)`

- 引数: `user`(`{ name, age }` を持つオブジェクト)
- 戻り値: `"<name>さん(<age>歳)"` という形式の文字列
- **分割代入を使って `user` から `name` と `age` を取り出して実装してください。**
- 例: `summarizeUser({ name: "田中", age: 25 })` → `"田中さん(25歳)"`

### 3. `mergeSettings(defaults, overrides)`

- 引数: `defaults`(デフォルト設定のオブジェクト)、`overrides`(上書きしたい設定のオブジェクト)
- 戻り値: `defaults` に `overrides` の内容を上書きマージした**新しいオブジェクト**(引数のオブジェクト自体は変更しないこと)
- **スプレッド構文を使って実装してください。**
- 例: `mergeSettings({ timeout: 30, retry: 3 }, { timeout: 60 })` → `{ timeout: 60, retry: 3 }`
- 例: `overrides` にしかないプロパティも結果に含まれること

### 4. `countProperties(obj)`

- 引数: `obj`(任意のオブジェクト)
- 戻り値: `obj` が持つプロパティの数(数値)
- **`Object.keys` を使って実装してください。**
- 例: `countProperties({ a: 1, b: 2, c: 3 })` → `3`
- 例: `countProperties({})` → `0`(空オブジェクトなら0)

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/08-objects/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
