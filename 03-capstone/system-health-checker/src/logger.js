// src/logger.js
//
// チェック結果を「人が読みやすいテキスト」に整形し、ログファイルとして書き出す部分です。
// checker.js が「チェックする」という責務だけを持つのに対し、
// logger.js は「結果をどう表示・保存するか」という責務だけを持ちます。
// このように役割ごとにファイルを分けることを「関心の分離」と呼び、
// 大きなプログラムを読みやすく・変更しやすく保つための基本的な考え方です。

const fs = require('node:fs');
const path = require('node:path');

/**
 * 1件のチェック結果を、人間が読みやすい1行のテキストに整形します。
 * ファイルへの書き込みやconsole.logは一切行わない「純粋関数」です。
 * (純粋関数とは、同じ入力を渡せば必ず同じ出力が返り、
 *  外部の状態を変更したりしない関数のことです。テストが書きやすくなります)
 *
 * @param {{ name: string, status: "UP" | "DOWN", checkedAt: string }} result
 * @returns {string} 例: "[UP] readme-file (checked at 2026-08-30T03:15:00.000Z)"
 */
function formatSummaryLine(result) {
  const { name, status, checkedAt } = result;
  return `[${status}] ${name} (checked at ${checkedAt})`;
}

/**
 * チェック結果の配列全体を、1つのログファイルの本文となる文字列に整形します。
 * 先頭に「いつ実行したか」のヘッダー行、各サービスの結果行、
 * 末尾にUP/DOWNの件数サマリーを含めます。
 *
 * @param {Array<{ name: string, status: "UP" | "DOWN", checkedAt: string }>} results
 * @returns {string} ログファイルにそのまま書き出せる本文テキスト
 */
function buildLogContent(results) {
  // ヘッダー行: このログがいつのチェック結果なのかを、ファイルの一番上に記録しておきます。
  // 実行時刻はresultsの各要素が持つcheckedAtと同じ瞬間に近いものが望ましいですが、
  // 「ログをまとめた時刻」という意味であえてここで別途取得しています。
  const header = `=== システムヘルスチェック結果 (generated at ${new Date().toISOString()}) ===`;

  // 各サービスの結果を1行ずつ整形します。formatSummaryLineを使い回すことで、
  // 「1行の見た目」を変えたくなったときに直す場所を1箇所に集約できます。
  const lines = results.map((result) => formatSummaryLine(result));

  // UP/DOWNの件数を数えます。filterで条件に合う要素だけを残し、その長さ(length)を数えます。
  const upCount = results.filter((result) => result.status === 'UP').length;
  const downCount = results.filter((result) => result.status === 'DOWN').length;
  const summary = `--- summary: UP=${upCount} DOWN=${downCount} TOTAL=${results.length} ---`;

  // ヘッダー・各行・サマリーを空行を挟まず改行(\n)でつなぎ、1つの文字列にまとめます。
  return [header, ...lines, summary].join('\n') + '\n';
}

/**
 * チェック結果の配列をログファイルとして書き出します。
 *
 * @param {Array<{ name: string, status: "UP" | "DOWN", checkedAt: string }>} results
 * @param {string} logDir ログファイルを書き出すディレクトリのパス
 * @returns {string} 実際に書き出したログファイルのフルパス
 */
function writeLogFile(results, logDir) {
  // fs.mkdirSync の第2引数に { recursive: true } を渡すと、
  // 「途中のディレクトリがなければまとめて作る」「すでに存在していてもエラーにしない」
  // という動きになります。ログ運用では「ディレクトリがなくて書き込みに失敗した」という
  // 事故が起きがちなので、書き込み前に必ず用意しておくのが安全です。
  fs.mkdirSync(logDir, { recursive: true });

  // ファイル名に使うため、ISO日時文字列に含まれる ":" や "." を "-" に置き換えます。
  // これはWindows/Macなど一部の環境でファイル名に ":" を使えないための対応でもあります。
  // 例: "2026-08-30T03:15:00.000Z" -> "2026-08-30T03-15-00-000Z"
  const timestampForFileName = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `health-check-${timestampForFileName}.log`;
  const filePath = path.join(logDir, fileName);

  const content = buildLogContent(results);
  fs.writeFileSync(filePath, content, 'utf8');

  return filePath;
}

module.exports = { formatSummaryLine, buildLogContent, writeLogFile };
