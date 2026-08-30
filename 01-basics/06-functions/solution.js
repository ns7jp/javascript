// 解答例: 関数の基本
//
// README.md の解説と合わせて読んでください。

/**
 * aとbを掛け算した結果を返す。bを省略した場合は1として扱う。
 * @param {number} a - 掛けられる数
 * @param {number} [b=1] - 掛ける数(省略時は1)
 * @returns {number} a * b の結果
 */
function multiply(a, b = 1) {
  // なぜデフォルト引数を使うのか:
  // 「bが渡されなかったら1として計算する」という仕様を、
  // 関数の中でif文を使って毎回チェックするのではなく、
  // 引数の宣言部分(b = 1)に書いてしまうことで、
  // 関数の使い方(シグネチャ)を見ただけで仕様が分かるようにしている。
  return a * b;
}

/**
 * 渡された数値すべての合計を返す。
 * @param {...number} numbers - 合計したい数値(いくつでも渡せる)
 * @returns {number} numbersの合計。引数がなければ0
 */
function sumAll(...numbers) {
  // なぜrest parametersを使うのか:
  // 呼び出し側が渡す引数の数が1個でも10個でも、
  // 関数の中身を変えずに対応できるようにするため。
  // ...numbers と書くことで、渡された引数はすべて配列としてまとめて受け取れる。
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  // numbersが空配列([])の場合、forループは1度も実行されないため、
  // totalは初期値の0のまま返される。
  return total;
}

/**
 * 呼び出すたびに1ずつ増える数値を返す関数を作って返す、ファクトリ関数。
 * @returns {() => number} 呼び出すたびにカウントを1増やして返す関数
 */
function createCounter() {
  // countはcreateCounter()が呼ばれるたびに新しく作られるローカル変数。
  let count = 0;

  // なぜこれがクロージャになるのか:
  // ここで返す関数(内側の関数)は、createCounter()の実行が
  // 終わったあとも、外側のスコープにあるcountを参照し続ける。
  // そのため、createCounter()を呼ぶたびに「独立したcountを持つ関数」が
  // 新しく作られ、複数のカウンターを同時に使っても互いに干渉しない。
  return function () {
    count += 1;
    return count;
  };
}

module.exports = { multiply, sumAll, createCounter };
