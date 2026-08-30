// 解答例: エラーハンドリング
//
// README.md の解説と合わせて読んでください。

/**
 * 入力値の検証エラーを表すカスタムエラークラス。
 */
class ValidationError extends Error {
  constructor(message) {
    // なぜ super(message) を最初に呼ぶのか:
    // 派生クラス(extendsで継承したクラス)のコンストラクタでは、
    // this を使う前に必ず親クラス(Error)のコンストラクタを呼び出す必要がある。
    // super(message) を呼ぶことで、Errorが持つ message プロパティが
    // 自動的に設定される。
    super(message);

    // なぜ name を上書きするのか:
    // 標準のErrorをそのまま使うと name は常に "Error" になってしまい、
    // catchした側で「これはどんな種類のエラーなのか」を区別しにくい。
    // name を 'ValidationError' に変えておくことで、
    // エラーメッセージやログを見ただけでエラーの種類が分かるようにしている。
    this.name = 'ValidationError';
  }
}

/**
 * aをbで割った結果を返す。bが0の場合はValidationErrorをthrowする。
 * @param {number} a - 割られる数
 * @param {number} b - 割る数
 * @returns {number} a / b の計算結果
 */
function safeDivide(a, b) {
  // なぜ0除算を事前にチェックするのか:
  // JavaScriptでは 1 / 0 を計算してもエラーにはならず、
  // Infinity(無限大)という特殊な値が返ってきてしまう。
  // これは「計算が成功したかのように見えて、実は意味のない値」であり、
  // 気づかないままInfinityが後続の処理に伝わってしまうと、
  // 原因が分かりにくいバグにつながる。
  // そのため、ここで明示的にチェックし、意図を持ってエラーをthrowしている。
  if (b === 0) {
    throw new ValidationError('0で割ることはできません。');
  }
  return a / b;
}

/**
 * 文字列として渡された2つの数値をパースし、割り算した結果を分かりやすい文字列で返す。
 * @param {string} aStr - 割られる数(文字列)
 * @param {string} bStr - 割る数(文字列)
 * @returns {string} "計算結果: <値>" または "エラー: <メッセージ>" という形式の文字列
 */
function parseAndDivide(aStr, bStr) {
  // resultには、成功時・失敗時どちらの場合の戻り値も一旦入れておく。
  // finallyブロックの中でreturnしてしまうと、
  // try/catchで決めた戻り値が上書きされてしまう(つまずきやすいポイント)ため、
  // ここでは「resultに値を入れておき、関数の最後でまとめてreturnする」
  // という書き方にしている。
  let result;

  try {
    const a = Number(aStr);
    const b = Number(bStr);

    // なぜNaNチェックが必要なのか:
    // Number("abc") のように数値として解釈できない文字列を変換すると、
    // NaN(Not a Number)という特殊な値になる。
    // NaNのままsafeDivideに渡してしまうと、計算結果もNaNになってしまい、
    // 「何が原因で計算がおかしくなったのか」が分かりにくくなる。
    // そこで、計算を始める前に明示的にチェックし、
    // 分かりやすいメッセージ付きのエラーとしてthrowしている。
    if (Number.isNaN(a) || Number.isNaN(b)) {
      throw new ValidationError(`"${aStr}" または "${bStr}" は数値として解釈できません。`);
    }

    result = `計算結果: ${safeDivide(a, b)}`;
  } catch (error) {
    // なぜ instanceof でエラーの種類を確認するのか:
    // ここでcatchされるエラーは、上で自分がthrowしたValidationErrorとは限らない。
    // 例えばsafeDivideの呼び出し方を間違えるなど、コード自体のバグによる
    // 予期しないエラーが発生する可能性もある。
    // ValidationErrorだけを「想定内のエラー」として分かりやすいメッセージに変換し、
    // それ以外は原因調査のためにそのまま投げ直す(再度throwする)ことで、
    // 「本当のバグ」を握りつぶさないようにしている。
    if (error instanceof ValidationError) {
      result = `エラー: ${error.message}`;
    } else {
      throw error;
    }
  } finally {
    // finallyは成功・失敗どちらの場合でも必ず実行される。
    // ここでは処理の終了をログに残す例として使っている
    // (実務では接続のクローズなど、後片付け処理を書くことが多い)。
    console.log('parseAndDivideの処理を終了しました。');
  }

  return result;
}

module.exports = { ValidationError, safeDivide, parseAndDivide };
