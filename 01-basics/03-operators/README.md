# 演算子と型変換

## この章で学ぶこと

- 算術演算子(`+` `-` `*` `/` `%` `**`)の使い方と、計算結果が思ったものと違うときの原因
- 比較演算子のうち、特に `==`(緩い比較)と `===`(厳密な比較)の違い
- 論理演算子 `&&`・`||`・`??`(Nullish合体演算子)の意味と使いどころ
- JavaScript が値を勝手に別の型へ変換してしまう「暗黙の型変換」の仕組み
- 数値に変換できないことを表す特殊な値 `NaN`(Not a Number)の扱いにくさと、その対処法

## 解説

### 算術演算子(四則演算などの計算)

JavaScript には、次のような算術演算子(computation を行うための記号)があります。

```javascript
console.log(3 + 2); // 5  足し算
console.log(3 - 2); // 1  引き算
console.log(3 * 2); // 6  掛け算
console.log(3 / 2); // 1.5 割り算
console.log(3 % 2); // 1  余り(あまり)を求める。「剰余演算子」と呼ぶ
console.log(3 ** 2); // 9  べき乗(3の2乗)
```

`%`(剰余演算子)は「割った余り」を求める演算子です。例えば「ある数が偶数か奇数か」を判定するときによく使います(`number % 2` が `0` なら偶数)。

注意したいのは、文字列と数値を `+` でつなぐと「連結(くっつける)」になる点です。

```javascript
console.log(1 + "2"); // "12" (文字列になる)
console.log("2" - 1); // 1   (- は連結の意味を持たないので、数値として計算される)
```

`+` だけは「文字列の連結」と「数値の足し算」の2つの意味を持っているため、うっかり数値のつもりで文字列と計算してしまうバグ(想定外の結果を生む不具合)がとても多いです。

### 比較演算子: `==` と `===` の違い

比較演算子は、2つの値を比べて `true`(真)か `false`(偽)を返します。

```javascript
console.log(1 == "1"); // true  (型を無視して値だけ比べる)
console.log(1 === "1"); // false (型も含めて比べる)
```

- `==`(緩い比較、loose equality): 比較する前に、片方の型をもう片方に合わせようとします(これを「暗黙の型変換」と呼びます)。そのため、数値の `1` と文字列の `"1"` を比べても `true` になってしまいます。
- `===`(厳密な比較、strict equality): 型変換を一切せず、「型」と「値」の両方が一致しているかを確認します。

**サーバー構築の現場でも、比較には基本的に `===` を使うことを強くおすすめします。** `==` は変換のルールが複雑で、意図しない `true` / `false` を生みやすいからです。設定ファイルの値を文字列として読み込んだのに、数値の `0` と比較して思わぬ挙動になる、といった事故を防げます。

```javascript
function isStrictlyEqual(a, b) {
  return a === b;
}

isStrictlyEqual(1, "1"); // false (型が違うので不一致)
isStrictlyEqual(1, 1); // true
```

### 論理演算子: `&&`・`||`・`??`

```javascript
console.log(true && false); // false (両方trueのときだけtrue)
console.log(true || false); // true  (どちらか一方でもtrueならtrue)
console.log(!true); // false (真偽を反転させる)
```

`&&` と `||` は「値を返す演算子」でもあります。単純な真偽値の計算だけでなく、次のような使い方もよくします。

```javascript
const userName = "";
console.log(userName || "名無しさん"); // "名無しさん"
// userName が falsy(後述)な値なので、右側の値が使われる
```

ここで問題になるのが、`0` や `""`(空文字列)のような「意図的に設定した値」まで `||` は falsy として扱ってしまう点です。例えば「在庫数が0個」という正しい値を持っているのに、`||` を使うとデフォルト値に置き換わってしまいます。

```javascript
const stock = 0;
console.log(stock || 100); // 100 になってしまう(本当は0個と伝えたいのに…)
```

そこで登場するのが `??`(Nullish合体演算子、Nullish Coalescing Operator)です。これは「`null` または `undefined` のときだけ」右側の値を使います。

```javascript
console.log(stock ?? 100); // 0 (0は残したいのでこちらが正しい)
console.log(null ?? 100); // 100
console.log(undefined ?? 100); // 100
```

### 暗黙の型変換と `NaN`

JavaScript は「型が合わなくても、できるだけ動かそうとする」言語です。この自動的な変換を「暗黙の型変換(implicit type conversion)」と呼びます。便利な反面、初心者を混乱させる原因にもなります。

```javascript
console.log(Number("123")); // 123     (文字列→数値に変換できた)
console.log(Number("abc")); // NaN     (変換できない)
console.log(Number("")); // 0        (空文字列は0とみなされる)
console.log(Number(true)); // 1        (trueは1として扱われる)
```

`NaN`(Not a Number、「数値ではない」という意味の特殊な値)には、次のような扱いにくい性質があります。

```javascript
console.log(NaN === NaN); // false! NaN同士を比べてもfalseになる
console.log(typeof NaN); // "number" (typeofで見ると数値扱いされている)
```

そのため「変換に失敗したかどうか」を `NaN` のまま扱うと、`if (result === NaN)` のような直感的なコードが**絶対に動きません**。判定には専用の関数 `Number.isNaN()` を使う必要があります。

```javascript
console.log(Number.isNaN(NaN)); // true
console.log(Number.isNaN(Number("abc"))); // true
```

このような「わかりにくさ」を避けるために、この演習では「変換できなければ `NaN` ではなく `null` を返す」という設計にします。`null` は「値が存在しない」ことを明示的に表す値なので、呼び出し側は `=== null` で安全にチェックできます。

```javascript
function coerceToNumber(value) {
  const converted = Number(value);
  if (Number.isNaN(converted)) {
    return null; // 変換失敗をnullで明示する
  }
  return converted;
}

coerceToNumber("42"); // 42
coerceToNumber("abc"); // null (NaNではなくnullを返す)
```

## つまずきやすいポイント

- **`==` と `===` を混同してしまう**: `1 == "1"` は `true` ですが `1 === "1"` は `false` です。「値だけ比べるか」「型も含めて比べるか」の違いを必ず意識してください。実務では基本的に `===` を使いましょう。
- **`NaN === NaN` が `false` になることを知らない**: 「変換に失敗したかどうか」を確かめたいときに `if (x === NaN)` と書いてしまい、常に `false` になってバグに気づけないケースが非常に多いです。必ず `Number.isNaN(x)` を使ってください。
- **`||` と `??` の違いを理解せずに `||` を使ってしまう**: `0` や `""` のような「意図的な値」までデフォルト値に置き換わってしまいます。「`null`/`undefined` のときだけ」置き換えたいなら `??` を使いましょう。
- **`+` が「連結」なのか「足し算」なのか判断を誤る**: `"3" + 2` は `"32"`(文字列連結)になりますが、`"3" - 2` は `1`(数値の引き算)になります。`+` だけ特別な挙動をすることを覚えておきましょう。

## 演習問題

`exercise.js` に、次の2つの関数を実装してください。

### 1. `isStrictlyEqual(a, b)`

- 引数: `a`(任意の値)、`b`(任意の値)
- 戻り値: `a` と `b` を `===`(厳密な比較)で比較した結果(`true` または `false`)
- 例:
  - `isStrictlyEqual(1, 1)` → `true`
  - `isStrictlyEqual(1, "1")` → `false`(型が違う)
  - `isStrictlyEqual(null, undefined)` → `false`

### 2. `coerceToNumber(value)`

- 引数: `value`(文字列・数値・真偽値など、どんな型でもよい)
- 戻り値:
  - `value` を `Number()` で数値に変換できる場合は、変換後の数値を返す
  - 変換できない場合(結果が `NaN` になる場合)は、`NaN` ではなく **`null`** を返す
- 例:
  - `coerceToNumber("42")` → `42`
  - `coerceToNumber("3.14")` → `3.14`
  - `coerceToNumber("")` → `0`(空文字列は `Number("")` で `0` になるため)
  - `coerceToNumber("abc")` → `null`
  - `coerceToNumber(undefined)` → `null`(`Number(undefined)` は `NaN` になるため)

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/03-operators/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
