// 演習: クラスとオブジェクト指向の基礎
//
// このファイルでは、以下の3つのクラスを実装してください。
//
// 1. class Animal
//    constructor(name) : nameをインスタンスのプロパティ(this.name)として保持する。
//    speak()           : `${this.name}が鳴きます` という文字列を返す。
//
// 2. class Dog extends Animal
//    constructor(name, breed) : super(name)で親クラスの初期化を行い、
//                                breedをインスタンスのプロパティ(this.breed)として保持する。
//    speak()                  : 親クラスのspeak()をオーバーライドし、
//                                `${this.name}: ワン!` という文字列を返す。
//    describe()                : super.speak()を使い、
//                                `${this.breed}種の${this.name}です。もとの鳴き声は「(super.speak()の結果)」`
//                                という文字列を返す。
//
// 3. class Temperature
//    constructor(celsius) : celsius(摂氏)をインスタンスのプロパティ(this.celsius)として保持する。
//    get fahrenheit()      : celsiusを華氏に変換した数値を返す(計算式: celsius * 9 / 5 + 32)。
//    set fahrenheit(f)     : 華氏の値fを摂氏に変換し、this.celsiusを更新する
//                             (計算式: (f - 32) * 5 / 9)。
//
// 詳しい仕様や具体例は README.md を確認してください。

class Animal {
  constructor(name) {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }

  speak() {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }

  speak() {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }

  describe() {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }
}

class Temperature {
  constructor(celsius) {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }

  get fahrenheit() {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }

  set fahrenheit(f) {
    // TODO: ここに実装してください
    throw new Error('未実装です');
  }
}

module.exports = { Animal, Dog, Temperature };
