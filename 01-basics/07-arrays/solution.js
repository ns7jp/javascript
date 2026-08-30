// 解答例: 配列とその操作
//
// README.md の解説と合わせて読んでください。

/**
 * 配列の各要素を2倍にした新しい配列を返す。
 * @param {number[]} numbers - 数値の配列
 * @returns {number[]} 各要素を2倍にした新しい配列
 */
function doubleAll(numbers) {
  // なぜmapを使うのか:
  // 「元の配列と同じ長さで、各要素を加工した配列がほしい」場合はmapが最適。
  // forループで新しい配列をpushで作っていく方法もできるが、
  // mapを使うことで「何をしたいか(各要素を2倍にする)」が一目で分かるコードになる。
  return numbers.map((n) => n * 2);
}

/**
 * 18歳以上の人だけを集めた新しい配列を返す。
 * @param {{ name: string, age: number }[]} people - 人物データの配列
 * @returns {{ name: string, age: number }[]} 18歳以上の人だけの配列
 */
function filterAdults(people) {
  // なぜfilterを使うのか:
  // 「条件に合う要素だけを選び出したい」場合はfilterが最適。
  // age >= 18 がtrueを返した要素だけが新しい配列に残る。
  // 境界値である18歳ちょうどの人も「以上」なので条件を満たし、含まれる。
  return people.filter((person) => person.age >= 18);
}

/**
 * 商品配列のpriceを合計した金額を返す。
 * @param {{ price: number }[]} items - price を持つオブジェクトの配列
 * @returns {number} 合計金額
 */
function totalPrice(items) {
  // なぜreduceを使うのか:
  // 「配列全体をたどりながら、1つの値(合計金額)に集約したい」場合はreduceが最適。
  // 第2引数の0は「accumulator(累計)の初期値」。
  // これを省略すると配列の最初の要素が初期値として扱われてしまい、
  // itemオブジェクトそのものと数値を足そうとしてNaNになってしまうため、
  // 必ず0を明示的に渡す。
  return items.reduce((total, item) => total + item.price, 0);
}

/**
 * 2つの配列を重複なく結合した新しい配列を返す。
 * @param {Array} arr1 - 1つ目の配列
 * @param {Array} arr2 - 2つ目の配列
 * @returns {Array} 重複を取り除いた結合後の配列
 */
function mergeUnique(arr1, arr2) {
  // なぜスプレッド構文とSetを使うのか:
  // まず [...arr1, ...arr2] で2つの配列を1つに結合する。
  // 次にSetに渡すことで、重複した値が自動的に取り除かれる
  // (Setは「同じ値を2つ以上持てない」という性質のデータ構造)。
  // Setのままだと配列のメソッド(map, filterなど)が使えないため、
  // 最後にもう一度スプレッド構文[...]で配列に戻している。
  // Setは値が追加された順番を保持しているため、結果の順番も
  // 「最初に登場した順」になる。
  return [...new Set([...arr1, ...arr2])];
}

module.exports = { doubleAll, filterAdults, totalPrice, mergeUnique };
