// 演習: CLIツールを作る
//
// このファイルでは、以下の1つの関数を実装してください。
//
// 1. countLinesAndWords(text)
//    テキスト(文字列)を受け取り、行数・単語数・文字数を数えて
//    { lines, words, characters } という形のオブジェクトを返す。
//
// CLI(コマンドライン)部分(ファイルの下の方にある if (require.main === module) の中身)は
// あらかじめ実装済みです。countLinesAndWords を実装し終えたら、
// 実際にターミナルから `node exercise.js sample.txt` のように実行して、
// 自分の実装がどう動くか確認してみましょう。
//
// 詳しい仕様や具体例は README.md を確認してください。

const fs = require('node:fs');

/**
 * テキストの行数・単語数・文字数を数える(コアロジック)。
 * @param {string} text - 数える対象のテキスト
 * @returns {{lines: number, words: number, characters: number}} 行数・単語数・文字数
 */
function countLinesAndWords(text) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * CLIとして実行されたときの処理をまとめた関数。
 * (この関数は実装済みです。変更しなくてもテストは通ります)
 */
function runCli() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('使い方: node exercise.js <ファイルパス>');
    process.exit(1);
    return;
  }

  let text;
  try {
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

if (require.main === module) {
  runCli();
}

module.exports = { countLinesAndWords };
