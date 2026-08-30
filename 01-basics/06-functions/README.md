# 関数の基本

## この章で学ぶこと

- 関数を定義する3つの書き方(関数宣言・関数式・アロー関数)とそれぞれの違い
- 引数にデフォルト値を設定する方法
- 個数が決まっていない引数をまとめて受け取る「可変長引数(rest parameters)」
- 「スコープ(変数が有効な範囲)」の基本的な考え方
- 「クロージャ」という、関数が周りの変数を覚えておく仕組み

## 解説

### 関数宣言(function declaration)

「関数(function)」とは、複数の処理をひとまとめにして、名前をつけて何度でも呼び出せるようにしたものです。最も基本的な定義方法が「関数宣言」です。

```javascript
function greet(name) {
  return `こんにちは、${name}さん`;
}

console.log(greet("たかし")); // "こんにちは、たかしさん"
```

関数宣言の大きな特徴は「ホイスティング(hoisting、巻き上げ)」という性質です。関数宣言は、ファイルの中でどこに書かれていても、そのファイルの一番上で定義されたのと同じように扱われます。そのため、**関数を定義している行より前の位置でその関数を呼び出しても、正しく動きます**。

```javascript
sayHi(); // これは動く! "Hi!"と表示される

function sayHi() {
  console.log("Hi!");
}
```

### 関数式(function expression)

関数を「値」として変数に代入する書き方を「関数式」と呼びます。

```javascript
const greet = function (name) {
  return `こんにちは、${name}さん`;
};

console.log(greet("たかし")); // "こんにちは、たかしさん"
```

関数式は関数宣言と違い、**定義より前で呼び出そうとするとエラーになります**。`const` で宣言した変数 `greet` の存在自体は認識されていますが、実際に関数が代入されるのは、そのコードが実行された時点だからです。

```javascript
sayHi(); // エラー! Cannot access 'sayHi' before initialization

const sayHi = function () {
  console.log("Hi!");
};
```

### アロー関数(arrow function)

`=>` を使った、より短く書ける関数式の一種が「アロー関数」です。

```javascript
const greet = (name) => {
  return `こんにちは、${name}さん`;
};

// 処理がreturn文1行だけなら、さらに省略して書ける
const greetShort = (name) => `こんにちは、${name}さん`;

console.log(greetShort("たかし")); // "こんにちは、たかしさん"
```

アロー関数は関数式と似ていますが、`this`(そのコードが実行されている対象を指す特殊な値)の扱いが異なるなど、細かい違いがあります。この教材ではまだ深入りしませんが、まずは「短く書ける関数式の仲間」と理解しておけば十分です。

### 引数のデフォルト値

関数を呼び出すときに引数を省略した場合、通常はその引数は `undefined` になります。しかし、あらかじめ「省略されたときの値」を決めておくこともできます。これを「デフォルト引数(default parameters)」と呼びます。

```javascript
function multiply(a, b = 1) {
  return a * b;
}

console.log(multiply(3, 4)); // 12 (aとbの両方を指定)
console.log(multiply(5));    // 5  (bを省略。b=1として計算される)
```

`b = 1` と書いておくことで、`multiply(5)` のように第2引数を渡さなかった場合に、自動的に `b` へ `1` が入ります。**デフォルト値が使われるのは「引数が渡されなかった場合」だけでなく「明示的に `undefined` を渡した場合」も同様**です(初心者が見落としがちなポイントです)。

```javascript
console.log(multiply(5, undefined)); // 5 (undefinedを渡すとデフォルト値が使われる)
console.log(multiply(5, null));      // 0 (nullは"値がある"とみなされるので、デフォルト値は使われない! 5 * null は 5 * 0 = 0)
```

### 可変長引数(rest parameters)

「何個の引数が渡されるか、あらかじめ決まっていない」関数を作りたいときは、`...` を使った「rest parameters(残余引数)」が便利です。

```javascript
function sumAll(...numbers) {
  // numbersは、渡された引数がすべて入った「配列」になる
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}

console.log(sumAll(1, 2, 3));       // 6
console.log(sumAll(1, 2, 3, 4, 5)); // 15
console.log(sumAll());              // 0 (1つも渡さなければ空配列[]になる)
```

`...numbers` と書くと、関数に渡された引数(いくつでも)が、すべて `numbers` という1つの配列にまとめられます。「合計を求める」「最大値を探す」など、引数の数をあらかじめ限定したくない関数を作るときによく使われる書き方です。

### スコープ(変数が有効な範囲)

「スコープ」とは、ある変数が「どこからアクセスできるか」という有効範囲のことです。`let` や `const` で宣言した変数は、その変数が宣言された `{ }`(ブロック)の中でだけ有効です。

```javascript
function example() {
  const message = "関数の中の変数";
  console.log(message); // OK。同じ関数の中なのでアクセスできる
}

example();
console.log(message); // エラー! messageはexample関数の外からは見えない
```

このように、関数の中で宣言した変数は、その関数の外からは基本的に見ることができません。これを「ローカルスコープ(局所的な有効範囲)」と呼びます。

### クロージャ(closure)

クロージャは、JavaScript の中でも特に初心者がつまずきやすい、しかし非常に重要な概念です。一言でいうと、**「関数は、自分が作られたときに周りにあった変数(スコープ)を覚え続ける」**という性質のことです。

「呼び出すたびに1増える数を返すカウンター」を作るファクトリ関数(何かを作り出すための関数)の例で見てみましょう。

```javascript
function createCounter() {
  let count = 0; // この変数はcreateCounterが呼ばれるたびに新しく作られる

  // 内側の関数(戻り値として返す関数)は、
  // 外側の関数(createCounter)が持っていたcountを覚え続ける
  return function () {
    count += 1;
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter1()); // 3 (呼び出すたびにcountが1ずつ増えていく)

const counter2 = createCounter(); // 別の、独立したカウンターを新しく作る
console.log(counter2()); // 1 (counter1とは影響し合わない、別のcountを持っている)
```

ここで起きていることを整理します。

1. `createCounter()` が呼ばれると、その中で `count` という変数(初期値0)が作られる
2. `createCounter()` は「`count` を1増やして返す」という**内側の関数**を返す
3. 通常なら `createCounter()` の実行が終わった時点で `count` は消えてしまいそうですが、**内側の関数が `count` を参照し続けているため、`count` はメモリ上に残り続けます**
4. `counter1` に代入された内側の関数を呼び出すたびに、覚えている `count` が更新されていく

このように、「外側の関数の実行が終わったあとも、内側の関数が外側の変数を覚え続ける仕組み」のことを**クロージャ**と呼びます。`counter1` と `counter2` は、それぞれ別に `createCounter()` を呼び出して作られたので、**それぞれが別々の `count` を持っており、互いに影響しません**。

クロージャは、「外から直接書き換えられたくないけれど、内部で状態(変化するデータ)を管理したい」ときによく使われます。サーバー構築の現場でも、例えば「リクエストを処理した回数を数える」「一度だけ初期化処理を実行する」といった場面で、クロージャの考え方が土台になっています。

## つまずきやすいポイント

- **関数宣言と関数式のホイスティングの違いを混同する**: 関数宣言(`function 名前() {}`)は定義より前でも呼び出せますが、関数式やアロー関数(`const 名前 = function () {}` や `const 名前 = () => {}`)は、定義された行より後でしか呼び出せません。
- **デフォルト引数が使われる条件を誤解する**: デフォルト値が使われるのは「引数を省略した場合」と「明示的に `undefined` を渡した場合」だけです。`null` を渡した場合はデフォルト値は使われず、`null` がそのまま渡されます。
- **rest parametersの結果が `undefined` になると思い込む**: 引数を1つも渡さなかった場合、`...numbers` は `undefined` ではなく**空配列 `[]`** になります。空配列に対して `for...of` でループを回しても、単に0回実行されるだけでエラーにはなりません。
- **クロージャで、複数回関数を呼び出して作った変数が「状態を共有している」と勘違いする**: `createCounter()` を2回呼び出すと、`count` はそれぞれ独立して新しく作られます。片方のカウンターを増やしても、もう片方には一切影響しません。

## 演習問題

`exercise.js` に、次の3つの関数を実装してください。

### 1. `multiply(a, b = 1)`

- 引数: `a`(数値)、`b`(数値。省略時のデフォルト値は `1`)
- 戻り値: `a * b` の計算結果
- **デフォルト引数を使って実装してください**(`b` が省略されたら `1` として計算する)
- 例:
  - `multiply(3, 4)` → `12`
  - `multiply(5)` → `5`(`b` が省略されているので `1` として計算される)
  - `multiply(5, undefined)` → `5`(`undefined` を渡した場合もデフォルト値が使われる)

### 2. `sumAll(...numbers)`

- 引数: 可変長引数 `numbers`(0個以上の数値)
- 戻り値: 渡された数値すべての合計
- **rest parametersを使って実装してください**
- 例:
  - `sumAll(1, 2, 3)` → `6`
  - `sumAll(10)` → `10`(境界値。1個だけの合計)
  - `sumAll()` → `0`(引数が1つもない場合は合計する数値がないので `0`)

### 3. `createCounter()`

- 引数: なし
- 戻り値: 「呼び出すたびに1ずつ増えていく数値を返す関数」
- **クロージャを使って**、内部で `count`(初期値0)を保持し、返す関数を呼び出すたびに `count` を1増やしてその値を返すようにしてください
- 例:
  ```javascript
  const counter = createCounter();
  counter(); // 1
  counter(); // 2
  counter(); // 3
  ```
  - 別に `createCounter()` を呼んで作った2つ目のカウンターは、1つ目とは独立して `1` から始まる(互いに影響しない)

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/06-functions/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
