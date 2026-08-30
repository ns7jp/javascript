// 解答例: CLIツールを作る
//
// README.md の解説と合わせて読んでください。

const fs = require('node:fs');

/**
 * テキストの行数・単語数・文字数を数える(コアロジック)。
 *
 * この関数は「ファイルを読む」「結果を表示する」といった副作用(side effect、
 * 関数の外の世界に影響を与える処理)を一切行わない「純粋関数(pure function)」
 * になっている。入力(text)が同じであれば、必ず同じ結果を返す。
 * こう設計しておくことで、後述のCLI部分と切り離してテストできる。
 *
 * @param {string} text - 数える対象のテキスト
 * @returns {{lines: number, words: number, characters: number}} 行数・単語数・文字数
 */
function countLinesAndWords(text) {
  // なぜ型チェックをするのか:
  // この関数はCLIからだけでなく、他のプログラムからも呼ばれる可能性がある。
  // 文字列以外(数値やundefinedなど)が渡されたときにエラーメッセージも無く
  // おかしな結果を返すよりも、はっきりとエラーを投げたほうが原因を見つけやすい。
  if (typeof text !== 'string') {
    throw new TypeError('text は文字列である必要があります');
  }

  // 文字数は text.length でそのまま数えられる。
  // (※ 厳密には絵文字など一部の文字はJavaScript内部で2つ分としてカウントされる
  //   場合があるが、この章ではそこまでは扱わない簡易的な実装とする)
  const characters = text.length;

  // 空文字列のときは、行も単語も0として扱う。
  if (text === '') {
    return { lines: 0, words: 0, characters: 0 };
  }

  // --- 行数を数える ---
  // 改行文字(\n)で文字列を分割すると、行の配列が得られる。
  const rawLines = text.split('\n');

  // なぜ最後の要素を取り除くことがあるのか:
  // テキストファイルは、末尾に改行を1つ付けて保存するのが一般的な慣習である。
  // そのため "1行目\n2行目\n" のような文字列を split('\n') すると、
  // ["1行目", "2行目", ""] のように末尾に余分な空文字列ができてしまう。
  // これをそのまま数えると「実際には2行しかないのに3行と表示される」という
  // 直感に反した結果になってしまうため、末尾がちょうど空文字列の場合だけ取り除く。
  if (rawLines[rawLines.length - 1] === '') {
    rawLines.pop();
  }
  const lines = rawLines.length;

  // --- 単語数を数える ---
  // まず前後の空白を trim() で取り除いてから、空白(半角スペース・タブ・改行など)の
  // 連続を区切りとして分割する。正規表現 /\s+/ の \s は「空白文字」、+ は
  // 「1文字以上の繰り返し」を意味し、「連続する空白をまとめて1つの区切りとみなす」
  // という指定になっている。
  //
  // 注意: この数え方は「単語がスペースで区切られている」ことを前提にしている。
  // 日本語のようにスペースを使わずに単語が続く言語では、1行がまるごと1単語として
  // 数えられてしまう(=正確な単語数にはならない)。これは英語のテキストを想定した
  // 簡易的な実装であることを覚えておこう。
  const trimmed = text.trim();
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;

  return { lines, words, characters };
}

/**
 * CLIとして実行されたときの処理をまとめた関数。
 *
 * なぜ countLinesAndWords から分離しているのか:
 * ファイルを読む(fs.readFileSync)、結果を表示する(console.log)、
 * 異常終了する(process.exit)といった処理は「副作用」であり、
 * 自動テストがしづらい(実際にファイルシステムやターミナル出力に触れてしまう)。
 * そこで「数える」というコアロジックだけを countLinesAndWords に切り出し、
 * この runCli 関数は「引数を受け取り、ファイルを読み、結果を表示する」という
 * CLI固有の処理だけを担当するようにしている。
 */
function runCli() {
  // process.argv は、実行時に渡されたコマンドライン引数が入った配列である。
  // 例: `node solution.js sample.txt` を実行した場合
  //   process.argv[0] -> node の実行パス
  //   process.argv[1] -> 実行しているスクリプト(solution.js)のパス
  //   process.argv[2] -> 1つ目のユーザー引数("sample.txt")
  // つまり「ユーザーが指定した引数」は index 2 から始まる。
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('使い方: node solution.js <ファイルパス>');
    process.exit(1);
    return; // process.exit の後には到達しないが、意図を明確にするために書いている
  }

  let text;
  try {
    // 第2引数に 'utf8' を指定しないと、Buffer(バイナリデータ)がそのまま
    // 返ってきてしまい、文字列として扱えない(日本語も文字化けする)。
    text = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`ファイルを読み込めませんでした: ${filePath}`);
    console.error(error.message);
    process.exit(1);
    return;
  }

  const result = countLinesAndWords(text);
  console.log(`ファイル: ${filePath}`);
  console.log(`行数: ${result.lines}`);
  console.log(`単語数: ${result.words}`);
  console.log(`文字数: ${result.characters}`);
}

// require.main === module は、「このファイルが直接 `node solution.js` として
// 実行されたのか」、それとも「他のファイルから require() で読み込まれただけなのか」
// を判定するためのお決まりの書き方である。
// テスト(solution.test.js)からは countLinesAndWords を require() で読み込んで使うだけなので、
// この if の中身(CLIとしての処理)は実行されない。
if (require.main === module) {
  runCli();
}

module.exports = { countLinesAndWords };
