// 解答例: 繰り返し処理
//
// README.md の解説と合わせて読んでください。

/**
 * 1からnまでの整数の合計を返す。
 * @param {number} n - 合計したい範囲の上限
 * @returns {number} 1からnまでの合計。nが1未満の場合は0
 */
function sumUpTo(n) {
  let total = 0;

  // なぜforループを使うのか:
  // 「1からnまで」という繰り返す回数があらかじめ分かっている処理には、
  // 初期化・継続条件・更新式を1か所にまとめて書けるforループが向いている。
  for (let i = 1; i <= n; i++) {
    total += i;
  }

  // nが0以下の場合、継続条件(i <= n)が最初からfalseになるため
  // ループは1度も実行されず、totalは初期値の0のまま返される。
  return total;
}

/**
 * 数値の配列から偶数だけを取り出した新しい配列を返す。
 * @param {number[]} numbers - 数値の配列
 * @returns {number[]} 偶数だけを含む新しい配列(元の並び順を保つ)
 */
function collectEvenNumbers(numbers) {
  const result = [];

  // なぜfor...ofを使うのか:
  // 配列の「要素そのもの」を順番に扱いたいだけであれば、
  // インデックス(添字)を自分で管理する必要がないfor...ofの方がシンプルに書ける。
  for (const num of numbers) {
    // なぜcontinueを使うのか:
    // 「奇数のときは何もしない」という条件を、
    // if(偶数){ push } という1段のブロックで包むのではなく、
    // 「奇数ならこの回はスキップする」という書き方にすることで、
    // ネスト(入れ子)を浅く保ち、後から読んだときに条件が分かりやすくなる。
    if (num % 2 !== 0) {
      continue;
    }
    result.push(num);
  }

  return result;
}

module.exports = { sumUpTo, collectEvenNumbers };
