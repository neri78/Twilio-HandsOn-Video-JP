# 手順1: サンプルTwilio Serverlessプロジェクトをクローンし、Twilio資格情報を設定

この手順ではTwilio CLIおよびServerless Toolkitを用いて作成されたTwilio Serverlessプロジェクトをクローンし、資格情報を設定します。

## 1-1. サンプルアプリケーションをクローン

[こちら](https://github.com/neri78/video-sample-jp)のサンプルアプリケーションをクローンするため、下記のコマンドを実行します。

```bash
git clone https://github.com/neri78/video-sample-jp.git
```

Gitをインストールしていない場合は代わりにZipをダウンロードし、展開します。


クローンまたは展開した`video-sample-jp`フォルダに移動し、`.env.sample`ファイルを`.env`と変更します。このファイルをコードエディタで開くと下記の環境変数が定義されています。

```
ACCOUNT_SID=
AUTH_TOKEN=
API_KEY=
API_SECRET=
```

こちらに[ハンズオン: AccountSidの確認とAPIキーの作成](../01-Get-Credentials/00-Overview.md)で確認、生成した値をそれぞれ入力します。

## 1-2. テスト実行

トークン生成に必要なロジックはすでに実装されています。プロジェクトフォルダで次のコマンドを実行しローカル環境でアプリケーションを実行します。

```
npm install
npm start
```

ターミナル画面に次のような出力が表示されることを確認します。

![ローカル環境で実行確認](../assets/02-local-development.png)

表示されたURL(`http://localhost:3000/video-token`)をブラウザーで開き、アクセストークンが画面に表示されることを確認します。

![アクセストークン](../assets/02-access-token.png)

このアクセストークンにどのような内容が含まれているか確認してみましょう。[jwt.io](https://jwt.io)を開き、生成されたトークンを`Debugger`に貼り付けると`Header`、`Payload`、`Verified Signature`それぞれの情報を確認できます。

![jwt.io](../assets/02-jwt-io.png)


## 補足: Severless Toolkitを使ったプロジェクトの作成について

新しくTwilio Serverlessプロジェクトを作成する場合、次のコマンドを実行します。

```bash
twilio serverless:init <アプリ名>
```

Serverless Toolkitにはテンプレートが用意されており、次のコマンドで一覧を確認できます。

```bash
twilio serverless:list-templates
```
![テンプレート一覧](../assets/02-list-templates.png)


## 次の手順

- [Twilio Functionsのカスタマイズ](02-Customize-Function.md)