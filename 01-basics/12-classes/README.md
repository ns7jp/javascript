# クラスとオブジェクト指向の基礎

## この章で学ぶこと

- `class` 構文を使って、オブジェクトの「設計図」を定義する方法
- コンストラクタ(`constructor`)を使って、インスタンス作成時に初期化を行う方法
- インスタンスメソッドの定義方法と、複数のインスタンスで使い回す仕組み
- `extends` と `super` を使った継承と、メソッドのオーバーライド(上書き)
- `getter` / `setter` を使って、プロパティのように振る舞うメソッドを定義する方法

## 解説

### クラスとは何か

これまでの章では、`{ name: "web01", ipAddress: "192.168.1.10" }` のようにオブジェクトリテラルを直接書いて、サーバー1台分の情報を表していました。しかし、サーバーが何十台、何百台にもなると、そのたびに同じ形のオブジェクトを手作業で書くのは大変ですし、書き方がバラバラになってしまう心配もあります。

そこで使うのが「クラス(class)」です。クラスとは、「同じ種類のオブジェクトを作るための設計図」だとイメージしてください。設計図(クラス)を1つ用意しておけば、そこから何個でも同じ形のオブジェクト(これを「インスタンス」と呼びます)を作ることができます。

```javascript
class Animal {
  constructor(name) {
    // constructorは「インスタンスが作られるとき」に自動的に呼ばれる特別なメソッド
    this.name = name; // thisは「今作られているインスタンス自身」を指す
  }

  speak() {
    return `${this.name}が鳴きます`;
  }
}

const cat = new Animal('タマ'); // newを使って、クラスからインスタンスを作る
console.log(cat.name); // "タマ"
console.log(cat.speak()); // "タマが鳴きます"

const dog = new Animal('ポチ'); // 同じ設計図から、別のインスタンスを作れる
console.log(dog.speak()); // "ポチが鳴きます"
```

`class Animal { ... }` の中に書いた `constructor(name) { this.name = name; }` は「コンストラクタ」と呼ばれ、`new Animal('タマ')` のように `new` キーワードを使ってインスタンスを作るときに自動的に実行されます。コンストラクタの中で `this.name = name;` のように書くと、そのインスタンスだけが持つ専用のプロパティ(データ)として `name` が保存されます。

`speak()` のように、クラスの中に定義した関数のことを「インスタンスメソッド」と呼びます。`cat.speak()` のように呼び出すと、そのメソッドの中の `this` は「呼び出し元のインスタンス(この場合は `cat`)」を指すため、`cat` と `dog` それぞれで異なる結果(`"タマが鳴きます"` と `"ポチが鳴きます"`)が得られます。

### 継承(extends)とオーバーライド

「犬」は「動物」の一種です。動物が持つ性質(名前を持つ、鳴くことができる)は犬にも当てはまりますが、犬には「鳴き方が『ワン!』である」という、犬ならではの性質もあります。このように、「あるクラス(親クラス)の性質を引き継ぎながら、一部だけを独自の内容に変えたい」というときに使うのが「継承(けいしょう、inheritance)」です。

```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 親クラス(Animal)のconstructorを呼び出す
    this.breed = breed; // Dog独自のプロパティを追加する
  }

  speak() {
    // 親クラス(Animal)のspeak()を上書き(オーバーライド)している
    return `${this.name}: ワン!`;
  }
}

const shiba = new Dog('ポチ', '柴犬');
console.log(shiba.speak()); // "ポチ: ワン!"(Dog独自のspeak()が呼ばれる)
console.log(shiba instanceof Animal); // true(DogはAnimalの一種でもある)
```

`class Dog extends Animal` と書くことで、「`Dog` は `Animal` を継承する(`Animal` の性質を引き継ぐ)」という意味になります。継承したクラス(`Dog`)のことを「派生クラス」や「子クラス」、継承元(`Animal`)のことを「親クラス」や「基底クラス」と呼びます。

`Dog` のように独自の `constructor` を定義する場合、その中で必ず `super(...)` を呼び出す必要があります。`super(name)` は「親クラス(`Animal`)の `constructor` を、`name` を渡して呼び出す」という意味です。JavaScriptのルールとして、派生クラスのコンストラクタでは、`this` を使う前に必ず `super(...)` を呼ばなければなりません(呼ばないとエラーになります)。

`Dog` クラスの中で `speak()` を再定義すると、親クラス(`Animal`)に元々あった `speak()` の代わりに、`Dog` の `speak()` が使われるようになります。これを「オーバーライド(override、上書き)」と呼びます。もし `Dog` の中で `speak()` を定義していなければ、`Animal` の `speak()` がそのまま使われます(これを「継承したメソッドをそのまま使う」と言います)。

親クラス本来のメソッドを、オーバーライドした後でも呼び出したい場合は、`super.メソッド名()` という書き方を使います。

```javascript
class Dog extends Animal {
  // ...(省略)...

  describe() {
    // super.speak()で、オーバーライドされる前の元々のspeak()を呼び出せる
    return `${this.breed}種の${this.name}です。もとの鳴き声は「${super.speak()}」`;
  }
}
```

### getter / setter

クラスには、「メソッドなのに、プロパティのように読み書きできる」特殊な仕組みがあります。それが `get` と `set` です。例えば「摂氏(セ氏)の温度を保持しつつ、華氏(カ氏)としても読み書きできるようにしたい」という場合を考えます。

```javascript
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  get fahrenheit() {
    // 呼び出すときは temperature.fahrenheit のように、括弧を付けずにアクセスする
    return (this.celsius * 9) / 5 + 32;
  }

  set fahrenheit(f) {
    // 代入するときは temperature.fahrenheit = 100 のように書く
    this.celsius = ((f - 32) * 5) / 9;
  }
}

const temperature = new Temperature(0);
console.log(temperature.fahrenheit); // 32(getterが呼ばれる。括弧は付けない)

temperature.fahrenheit = 212; // setterが呼ばれる
console.log(temperature.celsius); // 100(内部のcelsiusが更新されている)
```

`get fahrenheit() { ... }` のように定義すると、`temperature.fahrenheit`(メソッド呼び出しではなく、プロパティへのアクセスと同じ書き方)とアクセスしたときに、このメソッドの中身が実行され、その戻り値が返されます。逆に `set fahrenheit(f) { ... }` のように定義すると、`temperature.fahrenheit = 212` のように代入したときに、このメソッドが呼ばれ、代入しようとした値(`212`)が引数 `f` として渡されます。

getter/setterを使うメリットは、「利用する側は、内部でどのように値を計算・保存しているかを気にせず、まるで普通のプロパティであるかのように扱える」ことです。上の例では、`Temperature` クラスは内部的に `celsius`(摂氏)だけを保持していますが、利用する側は `temperature.fahrenheit` と書くだけで、変換の計算式を意識せずに華氏の値を読み書きできます。

## つまずきやすいポイント

- **`new` を付け忘れてクラスを呼び出してしまう**: `class` として定義したものは、普通の関数のように `Animal('タマ')` と呼び出すことはできません。必ず `new Animal('タマ')` のように `new` を付けて呼び出す必要があります(`new` を忘れると、実行時にエラーになります)。
- **派生クラスのコンストラクタで `super()` を呼び忘れる**: `class Dog extends Animal` のように独自の `constructor` を定義する場合、その中で `this` を使う前に必ず `super(...)` を呼ぶ必要があります。`super()` を呼ばずに `this.breed = breed;` のように書くと、エラーになってしまいます。
- **getter/setterを、括弧を付けて呼び出してしまう**: `get fahrenheit()` で定義したものは、あくまで「プロパティのように見える」ものなので、呼び出すときは `temperature.fahrenheit()` ではなく `temperature.fahrenheit`(括弧なし)と書きます。括弧を付けてしまうと、意図した動作になりません。
- **オーバーライドすると、親クラスのメソッドは自動的には呼ばれないと誤解する**: `Dog` で `speak()` をオーバーライドすると、`dog.speak()` を呼んだときに実行されるのは `Dog` の `speak()` だけです。「親クラスの処理も自動的に一緒に実行される」わけではありません。親クラス本来の処理も行いたい場合は、`super.speak()` のように明示的に呼び出す必要があります。

## 演習問題

`exercise.js` に、次の3つのクラスを実装してください。

### 1. `class Animal`

- `constructor(name)`: 引数 `name` を、そのままインスタンスのプロパティ `this.name` として保持する。
- `speak()`: `` `${this.name}が鳴きます` `` という形式の文字列を返す。
- 例: `new Animal('モモ').speak()` → `"モモが鳴きます"`

### 2. `class Dog extends Animal`

- `constructor(name, breed)`: `super(name)` を呼び出して親クラス(`Animal`)の初期化を行い、続けて引数 `breed` を `this.breed` として保持する。
- `speak()`: 親クラスの `speak()` をオーバーライドし、`` `${this.name}: ワン!` `` という形式の文字列を返す。
- `describe()`: `super.speak()` を使って、`` `${this.breed}種の${this.name}です。もとの鳴き声は「${super.speak()}」` `` という形式の文字列を返す。
- 例: `new Dog('ポチ', '柴犬').speak()` → `"ポチ: ワン!"`
- 例: `new Dog('ポチ', '柴犬').describe()` → `"柴犬種のポチです。もとの鳴き声は「ポチが鳴きます」"`
- 例: `new Dog('ポチ', '柴犬') instanceof Animal` → `true`(DogはAnimalを継承しているため)

### 3. `class Temperature`

- `constructor(celsius)`: 引数 `celsius`(摂氏の初期値)を、そのままインスタンスのプロパティ `this.celsius` として保持する。
- `get fahrenheit()`: `this.celsius` を華氏に変換した数値を返す。計算式は `celsius * 9 / 5 + 32`。
- `set fahrenheit(f)`: 渡された華氏の値 `f` を摂氏に変換し、`this.celsius` を更新する。計算式は `(f - 32) * 5 / 9`。
- 例: `new Temperature(0).fahrenheit` → `32`
- 例: `new Temperature(100).fahrenheit` → `212`
- 例: `const t = new Temperature(0); t.fahrenheit = 212;` の後、`t.celsius` → `100`

## 進め方

1. exercise.js を編集して関数を実装する
2. ターミナルで `node --test 01-basics/12-classes/solution.test.js` を実行しテストが通ることを確認する
3. 緑になったら solution.js と見比べて理解を深める
