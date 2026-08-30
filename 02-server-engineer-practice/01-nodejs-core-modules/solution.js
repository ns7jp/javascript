// 解答例: Node.jsコアモジュール入門
//
// README.md の解説と合わせて読んでください。

const fs = require('node:fs');
const path = require('node:path');

/**
 * ファイルをUTF-8のテキストとして読み込む。
 * ファイルが存在しない場合は、分かりやすいメッセージのエラーをthrowする。
 * @param {string} filePath - 読み込みたいファイルのパス
 * @returns {string} ファイルの中身(文字列)
 */
function readTextFile(filePath) {
  try {
    // なぜ第2引数に 'utf-8' を渡すのか:
    // 省略するとBuffer(バイナリデータを表すオブジェクト)が返ってきてしまい、
    // 文字列として扱えなくなる。テキストファイルを読みたい場合は、
    // 文字コード(エンコーディング)を明示的に指定する必要がある。
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    // なぜerror.codeで分岐するのか:
    // fs.readFileSyncが投げるエラーには様々な種類がある。
    // 'ENOENT'(Error NO ENTry)は「指定されたパスにファイルが存在しない」
    // ことを表すコードであり、最もよくある原因である。
    // ここだけを分かりやすいメッセージに変換することで、
    // 利用者(このファイルを使う側のコード)が原因をすぐに理解できるようにしている。
    // ENOENT以外のエラー(例: 権限不足など)は、原因調査のために
    // そのまま投げ直し、握りつぶさないようにしている。
    if (error.code === 'ENOENT') {
      throw new Error(`ファイルが見つかりません: ${filePath}`);
    }
    throw error;
  }
}

/**
 * ファイルパスから拡張子(ドットを含む)を取り出す。
 * @param {string} filePath - ファイルパス
 * @returns {string} 拡張子(例: ".json")。拡張子がない場合は空文字列
 */
function getFileExtension(filePath) {
  // なぜ自分で文字列操作をせず path.extname を使うのか:
  // 例えば「最後の '.' より後ろを取り出す」という処理を自分で書こうとすると、
  // 隠しファイル(先頭が '.' のファイル、例: ".gitignore")や
  // 拡張子がないファイルなど、例外的なケースの考慮が漏れやすい。
  // path.extnameはNode.jsが用意した標準の実装であり、
  // こうした細かいケースを正しく扱ってくれるため、車輪の再発明をせずに済む。
  return path.extname(filePath);
}

/**
 * 環境変数を取得する。存在しない場合はdefaultValueを返す。
 * @param {string} name - 環境変数の名前
 * @param {string} defaultValue - 環境変数が存在しないときに使う既定値
 * @returns {string} 環境変数の値、または既定値
 */
function getEnvOrDefault(name, defaultValue) {
  const value = process.env[name];

  // なぜ || ではなく === undefined で比較するのか:
  // `value || defaultValue` と書いてしまうと、valueが空文字列 ''(falsyな値)
  // の場合にもdefaultValueが使われてしまう。
  // しかし「環境変数に空文字列が設定されている」ことと
  // 「環境変数がそもそも設定されていない(undefined)」ことは、本来別の状態である。
  // ここでは「設定されているかどうか」だけを厳密に判定するため、
  // undefinedとの比較を使っている。
  if (value === undefined) {
    return defaultValue;
  }
  return value;
}

module.exports = { readTextFile, getFileExtension, getEnvOrDefault };
