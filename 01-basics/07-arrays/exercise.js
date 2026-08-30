// 演習: 配列とその操作
//
// このファイルでは、以下の4つの関数を実装してください。
//
// 1. doubleAll(numbers)
//    数値の配列を受け取り、各要素を2倍にした新しい配列を返す。
//    map を使って実装すること。
//
// 2. filterAdults(people)
//    { name, age } の配列を受け取り、age が18以上の人だけを返す。
//    filter を使って実装すること。
//
// 3. totalPrice(items)
//    { price } の配列を受け取り、priceの合計を返す。
//    reduce を使って実装すること(初期値は0)。
//
// 4. mergeUnique(arr1, arr2)
//    2つの配列を受け取り、重複を取り除いて結合した新しい配列を返す。
//    スプレッド構文とSetを使って実装すること。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * 配列の各要素を2倍にした新しい配列を返す。
 * @param {number[]} numbers - 数値の配列
 * @returns {number[]} 各要素を2倍にした新しい配列
 */
function doubleAll(numbers) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 18歳以上の人だけを集めた新しい配列を返す。
 * @param {{ name: string, age: number }[]} people - 人物データの配列
 * @returns {{ name: string, age: number }[]} 18歳以上の人だけの配列
 */
function filterAdults(people) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 商品配列のpriceを合計した金額を返す。
 * @param {{ price: number }[]} items - price を持つオブジェクトの配列
 * @returns {number} 合計金額
 */
function totalPrice(items) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * 2つの配列を重複なく結合した新しい配列を返す。
 * @param {Array} arr1 - 1つ目の配列
 * @param {Array} arr2 - 2つ目の配列
 * @returns {Array} 重複を取り除いた結合後の配列
 */
function mergeUnique(arr1, arr2) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { doubleAll, filterAdults, totalPrice, mergeUnique };
