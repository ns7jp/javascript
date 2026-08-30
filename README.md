# JavaScript基礎演習ポートフォリオ 〜未経験からサーバー構築エンジニアへ〜

![CI](https://github.com/ns7jp/javascript/actions/workflows/test.yml/badge.svg)

## このリポジトリについて

このリポジトリは、プログラミング未経験の状態から「サーバー構築エンジニア(インフラエンジニア)」への転職を目指して、JavaScript / Node.js の基礎を体系的に学習した記録です。単なる写経の寄せ集めではなく、各章に演習問題(`exercise.js`)・自分の解答・模範解答(`solution.js`)・自動テスト(`solution.test.js`)をセットで用意し、「自分で書いて、自分でテストして、正しさを確認する」というサイクルを繰り返しながら学習を進めています。

第1部の基礎文法から始まり、第2部ではNode.jsのコアモジュールを使ったCLIツール作成や簡易HTTPサーバー構築など、実務に近いテーマに取り組んでいます。最終的には第3部の総合ミニプロジェクト「システムヘルスチェッカー」として、学んだ内容を一つの成果物にまとめました。学習の途中経過も含めて公開することで、これまでの積み重ねと今の実力を正直に示すことを目的としています。

## なぜサーバー構築エンジニアがJavaScriptを学ぶのか

サーバー構築エンジニアの現場では、シェルスクリプトだけでなくNode.jsを使った運用スクリプトや自動化ツールが数多く使われています。ログ解析、死活監視、設定ファイルの検証、APIを叩いたヘルスチェックなど、日々の運用業務の多くはJavaScript/Node.jsで書くことができ、CI/CDパイプライン(GitHub Actionsなど)の構築・保守にもJavaScriptの知識が直結します。

また、TerraformやAWS CDKといったIaC(Infrastructure as Code)ツールの一部はJavaScript/TypeScriptと親和性が高く、設定ファイル(JSON/YAML)やREST APIとのやり取りを正確に扱うスキルは、インフラエンジニアにとっても汎用的な武器になります。本リポジトリはそうした実務を見据え、単なる文法学習で終わらせず「サーバー構築エンジニア実践編」として運用寄りの題材にも取り組んでいます。

## 使い方

前提として Node.js 18 以上がインストールされている必要があります。

```bash
git clone https://github.com/ns7jp/javascript.git
cd javascript
npm test
```

`npm test` を実行すると、リポジトリ全体の自動テスト(`node --test`)が実行されます。

## 学習ロードマップ

学習を進めた際の4週間のロードマップ例を [docs/ROADMAP.md](./docs/ROADMAP.md) にまとめています。各週で取り組む章と、学習を進める上でのコツを記載しています。

## 章立て(第1部: JavaScript基礎編)

| 章番号 | タイトル | フォルダ |
| --- | --- | --- |
| 01 | 実行環境とJavaScriptの基本 | [./01-basics/01-intro-and-environment/README.md](./01-basics/01-intro-and-environment/README.md) |
| 02 | 変数とデータ型 | [./01-basics/02-variables-and-types/README.md](./01-basics/02-variables-and-types/README.md) |
| 03 | 演算子と型変換 | [./01-basics/03-operators/README.md](./01-basics/03-operators/README.md) |
| 04 | 条件分岐 | [./01-basics/04-conditionals/README.md](./01-basics/04-conditionals/README.md) |
| 05 | 繰り返し処理 | [./01-basics/05-loops/README.md](./01-basics/05-loops/README.md) |
| 06 | 関数の基本 | [./01-basics/06-functions/README.md](./01-basics/06-functions/README.md) |
| 07 | 配列とその操作 | [./01-basics/07-arrays/README.md](./01-basics/07-arrays/README.md) |
| 08 | オブジェクト | [./01-basics/08-objects/README.md](./01-basics/08-objects/README.md) |
| 09 | 文字列操作 | [./01-basics/09-strings/README.md](./01-basics/09-strings/README.md) |
| 10 | エラーハンドリング | [./01-basics/10-error-handling/README.md](./01-basics/10-error-handling/README.md) |
| 11 | 非同期処理 | [./01-basics/11-async/README.md](./01-basics/11-async/README.md) |
| 12 | クラスとオブジェクト指向の基礎 | [./01-basics/12-classes/README.md](./01-basics/12-classes/README.md) |
| 13 | JSON操作 | [./01-basics/13-json/README.md](./01-basics/13-json/README.md) |

## 章立て(第2部: サーバー構築エンジニア実践編)

| 章番号 | タイトル | フォルダ |
| --- | --- | --- |
| 01 | Node.jsコアモジュール入門 | [./02-server-engineer-practice/01-nodejs-core-modules/README.md](./02-server-engineer-practice/01-nodejs-core-modules/README.md) |
| 02 | CLIツールを作る | [./02-server-engineer-practice/02-cli-tool/README.md](./02-server-engineer-practice/02-cli-tool/README.md) |
| 03 | 簡易HTTPサーバーの構築 | [./02-server-engineer-practice/03-http-server/README.md](./02-server-engineer-practice/03-http-server/README.md) |
| 04 | ログ解析ミニプロジェクト | [./02-server-engineer-practice/04-log-analyzer/README.md](./02-server-engineer-practice/04-log-analyzer/README.md) |
| 05 | 設定ファイルと環境変数の管理 | [./02-server-engineer-practice/05-config-and-env/README.md](./02-server-engineer-practice/05-config-and-env/README.md) |

## 総合ミニプロジェクト(第3部)

第1部・第2部で学んだ内容を統合した総合ミニプロジェクトとして「システムヘルスチェッカー」を実装しました。詳細は [03-capstone/system-health-checker/README.md](./03-capstone/system-health-checker/README.md) を参照してください。設定ファイルに基づいて複数のサービスの死活監視を行い、結果をログに記録するツールです。

## テストの実行方法

リポジトリ全体のテストを実行する場合:

```bash
npm test
```

特定の章のテストだけを個別に実行する場合(例: 第1部 02章。`solution.test.js` を直接指定します):

```bash
node --test 01-basics/02-variables-and-types/solution.test.js
```

## 採用担当者の方へ

このリポジトリを初めてご覧になる採用担当者・面接官の方は、[docs/FOR_RECRUITERS.md](./docs/FOR_RECRUITERS.md) に概要をまとめていますので、あわせてご覧ください。

## 今後の展望

- TypeScript化して型安全なコードベースへ移行する
- フロントエンド(React等)を使った可視化ダッシュボードへの発展
- Dockerを使ったコンテナ化と、docker-composeによる開発環境の整備
- AWS(EC2 / Lambda / CloudWatch等)へのデプロイと本番運用を想定した構成への拡張
- GitHub Actions以外のCI/CDツール(CircleCI等)との比較・移行検証

## ライセンス

本リポジトリは MIT License のもとで公開されています。詳細はルートディレクトリの [LICENSE](./LICENSE) ファイルを参照してください。

---

(GitHubプロフィールへのリンクをここに追加)
