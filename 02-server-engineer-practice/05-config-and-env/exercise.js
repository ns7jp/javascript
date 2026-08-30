// 演習: 設定ファイルと環境変数の管理
//
// このファイルでは、以下の2つの関数を実装してください。
//
// 1. validateConfig(config)
//    設定オブジェクト config が、必須項目(serviceName, port)を
//    正しい型・値で持っているかを検証(バリデーション)する。
//    問題があれば、分かりやすいメッセージのErrorをthrowする。
//    問題がなければ何も返さない(戻り値はundefinedでよい)。
//
// 2. loadConfigWithEnvOverride(config, env)
//    config(設定オブジェクト)を元に、env(環境変数を表すオブジェクト。
//    例: { PORT: "4000" })にPORTが指定されていれば、
//    config.portをその値(数値に変換したもの)で上書きした
//    「新しいオブジェクト」を返す純粋関数。
//    元のconfigオブジェクトは書き換えない。
//
// 詳しい仕様や具体例は README.md を確認してください。

/**
 * 設定オブジェクトを検証する。問題があればErrorをthrowする。
 * @param {*} config - 検証したい設定オブジェクト
 * @returns {void} 問題がなければ何も返さない
 */
function validateConfig(config) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

/**
 * configをベースに、envの値で上書きした新しい設定オブジェクトを返す(純粋関数)。
 * @param {{serviceName: string, port: number}} config - ベースとなる設定オブジェクト
 * @param {Object<string, string>} env - 環境変数を表すオブジェクト(例: process.envや{ PORT: "4000" })
 * @returns {{serviceName: string, port: number}} 上書き後の新しい設定オブジェクト
 */
function loadConfigWithEnvOverride(config, env) {
  // TODO: ここに実装してください
  throw new Error('未実装です');
}

module.exports = { validateConfig, loadConfigWithEnvOverride };
