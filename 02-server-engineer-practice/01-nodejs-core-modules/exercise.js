// 演習: Node.jsコアモジュール入門
//
// このファイルでは、以下の3つの関数を実装してください。
//
// 1. readTextFile(filePath)
//    fs.readFileSyncを使ってファイルをUTF-8で読み込む。
//    ファイルが存在しない場合は、分かりやすいメッセージのエラーをthrowする。
//
// 2. getFileExtension(filePath)
//    path.extnameを使って、ファイルパスから拡張子を取り出す。
//
// 3. getEnvOrDefault(name, defaultValue)
//    process.envから環境変数を取得する。存在しない場合はdefaultValueを返す。
//
// 詳しい仕様や具体例は README.md を確認してください。

const fs = require('node:fs');
const path = require('node:path');

/**
 * ファイルをUTF-8のテキストとして読み込む。
 * ファイルが存在しない場合は、分かりやすいメッセージのエラーをthrowする。
 * @param {string} filePath - 読み込みたいファイルのパス
 * @returns {string} ファイルの中身(文字列)
 */
function readTextFile(filePath) {
  // TODO: ここに実装してください
  // ヒント: try { return fs.readFileSync(filePath, 'utf-8'); } で読み込む。
  //         catchした際、error.code === 'ENOENT' なら
  //         new Error('ファイルが見つかりません: ' + filePath) をthrowする。
  //         それ以外のエラーは throw error; でそのまま投げ直す。
  throw new Error('未実装です');
}

/**
 * ファイルパスから拡張子(ドットを含む)を取り出す。
 * @param {string} filePath - ファイルパス
 * @returns {string} 拡張子(例: ".json")。拡張子がない場合は空文字列
 */
function getFileExtension(filePath) {
  // TODO: ここに実装してください
  // ヒント: path.extname(filePath) を使う
  throw new Error('未実装です');
}

/**
 * 環境変数を取得する。存在しない場合はdefaultValueを返す。
 * @param {string} name - 環境変数の名前
 * @param {string} defaultValue - 環境変数が存在しないときに使う既定値
 * @returns {string} 環境変数の値、または既定値
 */
function getEnvOrDefault(name, defaultValue) {
  // TODO: ここに実装してください
  // ヒント: process.env[name] が undefined かどうかを === で比較する
  //         (||演算子は使わない。空文字列を正しく扱えなくなるため)
  throw new Error('未実装です');
}

module.exports = { readTextFile, getFileExtension, getEnvOrDefault };
