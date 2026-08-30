// 解答例: クラスとオブジェクト指向の基礎
//
// README.md の解説と合わせて読んでください。

/**
 * 動物を表すクラス。
 * 名前(name)を持ち、鳴き声を表す文字列を返すspeak()メソッドを持つ。
 */
class Animal {
  /**
   * @param {string} name - 動物の名前
   */
  constructor(name) {
    // なぜthis.nameに代入するのか:
    // コンストラクタの中でthisに代入したプロパティは、
    // new Animal(...) で作られたインスタンスごとに保持される。
    // こうしておくことで、speak()など他のメソッドからも
    // this.nameとして参照できるようになる。
    this.name = name;
  }

  /**
   * @returns {string} "<name>が鳴きます" という文字列
   */
  speak() {
    return `${this.name}が鳴きます`;
  }
}

/**
 * 犬を表すクラス。Animalを継承し、鳴き方を独自の内容に上書き(オーバーライド)する。
 */
class Dog extends Animal {
  /**
   * @param {string} name - 犬の名前
   * @param {string} breed - 犬種
   */
  constructor(name, breed) {
    // なぜsuper(name)を最初に呼ぶのか:
    // DogはextendsでAnimalを継承している「派生クラス」であり、
    // 派生クラスのコンストラクタでは、thisを使う前に必ずsuper(...)を
    // 呼び出して、親クラス(Animal)のコンストラクタにインスタンスの
    // 初期化(this.nameの設定)を行ってもらう必要がある。
    // これを呼ばずにthisを使おうとすると、JavaScriptがエラーを出す。
    super(name);
    this.breed = breed;
  }

  /**
   * 親クラス(Animal)のspeak()をオーバーライド(上書き)している。
   * @returns {string} "<name>: ワン!" という文字列
   */
  speak() {
    // なぜオーバーライドと呼ぶのか:
    // Animalクラスにも同じ名前のspeak()メソッドが定義されているが、
    // Dogクラスで同名のメソッドを再定義すると、Dogのインスタンスに
    // 対してはこちらが優先して呼び出される。これを
    // 「オーバーライド(上書き)」と呼ぶ。
    return `${this.name}: ワン!`;
  }

  /**
   * 犬種と名前の紹介文に加え、親クラス本来の鳴き声も紹介する。
   * @returns {string} 犬種・名前・親クラスのspeak()結果を含む文字列
   */
  describe() {
    // なぜsuper.speak()を使うのか:
    // this.speak()と書くと、上でオーバーライドしたDog自身のspeak()
    // (「ワン!」の方)が呼ばれてしまう。super.speak()と書くことで、
    // 「オーバーライドされる前の、親クラス(Animal)本来のspeak()」を
    // 明示的に呼び出すことができる。
    return `${this.breed}種の${this.name}です。もとの鳴き声は「${super.speak()}」`;
  }
}

/**
 * 摂氏(celsius)を保持しつつ、華氏(fahrenheit)としても
 * 読み書きできるようにしたクラス。getter/setterの例。
 */
class Temperature {
  /**
   * @param {number} celsius - 摂氏の初期値
   */
  constructor(celsius) {
    this.celsius = celsius;
  }

  /**
   * 華氏の値を取得する(プロパティのように temperature.fahrenheit でアクセスする)。
   * @returns {number} 摂氏から変換した華氏の値
   */
  get fahrenheit() {
    // なぜgetterを使うのか:
    // fahrenheitという「実体を持たない(保存されていない)値」を、
    // あたかも普通のプロパティであるかのように temperature.fahrenheit
    // という形で読み取れるようにするため。実際の値は毎回celsiusから
    // 計算しているため、celsiusを更新すればfahrenheitも常に
    // 最新の値になる。
    return (this.celsius * 9) / 5 + 32;
  }

  /**
   * 華氏の値を設定する(temperature.fahrenheit = 100 のように代入して使う)。
   * @param {number} f - 設定したい華氏の値
   */
  set fahrenheit(f) {
    // なぜsetterを使うのか:
    // 利用する側は「華氏の値を設定したい」だけだが、内部的には
    // celsiusというプロパティで保持している。setterを使うことで、
    // 利用する側は変換の計算式を意識せず、
    // temperature.fahrenheit = 100 と書くだけで、
    // 内部のcelsiusを正しく更新できるようになる。
    this.celsius = ((f - 32) * 5) / 9;
  }
}

module.exports = { Animal, Dog, Temperature };
