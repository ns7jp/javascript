// 解答例: 設定ファイルと環境変数の管理
//
// README.md の解説と合わせて読んでください。

/**
 * 設定オブジェクトを検証する。
 *
 * なぜ検証(バリデーション)が必要なのか:
 * もし port に文字列の "3000" が紛れ込んでいたり、serviceName が
 * 指定されていなかったりした場合、それに気づかないまま処理を進めてしまうと、
 * サーバーが起動したあとの、もっと分かりにくい場所でエラーが起きてしまう。
 * 「設定を読み込んだ直後」という早い段階で、原因が一目で分かる
 * エラーメッセージと共に処理を止める(fail fast、早期に失敗させる)ことで、
 * 後からの原因調査がずっと楽になる。
 *
 * @param {*} config - 検証したい設定オブジェクト
 * @returns {void} 問題がなければ何も返さない(throwされなければ検証OKという意味)
 */
function validateConfig(config) {
  // typeof null は 'object' になってしまう(JavaScriptの有名な仕様上の癖)ため、
  // config === null のチェックも別に行う必要がある。
  // 配列(Array)も typeof では 'object' と判定されてしまうため、
  // Array.isArray() で「配列ではない、普通のオブジェクトであること」も確認する。
  if (typeof config !== 'object' || config === null || Array.isArray(config)) {
    throw new Error('config はオブジェクトである必要があります');
  }

  // serviceName: 文字列であり、かつ空文字列(または空白だけの文字列)ではないことを求める。
  // trim()してから空文字列かどうかを調べることで、"   "(スペースだけ)のような
  // 実質的に意味のない値も、うっかり通してしまわないようにしている。
  if (typeof config.serviceName !== 'string' || config.serviceName.trim() === '') {
    throw new Error('serviceName は空でない文字列で指定する必要があります');
  }

  // port: 数値であり、かつ整数であることを求める。
  // なぜ typeof だけでなく Number.isInteger も確認するのか:
  // 例えば port が 3000.5(小数)や NaN の場合でも typeof は 'number' になってしまう。
  // Number.isInteger() を組み合わせることで、こうした「数値ではあるが
  // ポート番号としては不正な値」もまとめて弾くことができる。
  if (typeof config.port !== 'number' || !Number.isInteger(config.port)) {
    throw new Error('port は整数の数値で指定する必要があります');
  }

  // ポート番号は仕様上0〜65535の範囲で使われる(16ビットの符号なし整数で表現できる範囲)。
  // 0番は特殊な用途のため、実際に使えるのは1〜65535の範囲である。
  // ちなみに1〜1023番は「well-knownポート」と呼ばれ、多くのOSでは管理者権限が
  // ないと使えないポートになっている(例: HTTPの80番、HTTPSの443番)。
  if (config.port < 1 || config.port > 65535) {
    throw new Error('port は1から65535の範囲で指定する必要があります');
  }

  // ここまでの検証をすべて通過すれば「問題なし」ということなので、何も返さずに終了する。
}

/**
 * configをベースに、envの値で上書きした新しい設定オブジェクトを返す。
 *
 * なぜ「新しいオブジェクトを返す」設計にするのか(純粋関数として設計する理由):
 * 引数で受け取ったconfigオブジェクトを直接書き換えてしまうと、
 * 呼び出し元がまだ使っている可能性がある元のオブジェクトまで
 * 意図せず変わってしまう(副作用、side effect)。
 * 「同じ入力(config, env)を渡せば必ず同じ結果が返り、外の世界(元のオブジェクト)には
 * 影響を与えない」という純粋関数の形にしておくことで、テストがしやすくなり、
 * 「いつの間にか値が変わっていた」というバグも防げる。
 *
 * @param {{serviceName: string, port: number}} config - ベースとなる設定オブジェクト
 * @param {Object<string, string>} env - 環境変数を表すオブジェクト(例: process.envや{ PORT: "4000" })
 * @returns {{serviceName: string, port: number}} 上書き後の新しい設定オブジェクト
 */
function loadConfigWithEnvOverride(config, env) {
  if (typeof config !== 'object' || config === null) {
    throw new TypeError('config はオブジェクトである必要があります');
  }
  if (typeof env !== 'object' || env === null) {
    throw new TypeError('env はオブジェクトである必要があります');
  }

  // スプレッド構文(...)を使って、configの中身をすべてコピーした
  // 新しいオブジェクトを作る。これ以降の変更は、この新しいオブジェクト
  // (mergedConfig)に対してだけ行い、元のconfigには一切触れない。
  const mergedConfig = { ...config };

  // env.PORT が指定されている場合だけ、portを上書きする。
  // (undefinedのチェックにしているのは、1章の getEnvOrDefault と同じ理由。
  //  空文字列 "" が指定されている場合と、そもそも指定されていない場合を区別するため)
  if (env.PORT !== undefined) {
    // 環境変数(process.envやenvオブジェクト)の値は、常に文字列である。
    // "4000" という文字列のままconfig.portに代入してしまうと、
    // 数値のportと文字列のportが混在してしまい、あとでバリデーションが
    // 失敗したり、計算結果がおかしくなったりする原因になる。
    // 必ずNumber()で数値に変換してから代入する。
    const overriddenPort = Number(env.PORT);

    // Number("abc") のように数値に変換できない文字列を渡すと、
    // 結果はNaN(Not a Number)になる。NaNのままconfigに紛れ込ませてしまうと、
    // 後続の処理(サーバーの起動など)でわけの分からないエラーになりやすいため、
    // ここで早めに気づけるようにErrorをthrowしておく。
    if (Number.isNaN(overriddenPort)) {
      throw new Error(`環境変数 PORT の値を数値に変換できませんでした: "${env.PORT}"`);
    }

    mergedConfig.port = overriddenPort;
  }

  return mergedConfig;
}

module.exports = { validateConfig, loadConfigWithEnvOverride };
