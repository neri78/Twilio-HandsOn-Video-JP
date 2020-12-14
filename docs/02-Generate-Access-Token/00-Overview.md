#  ハンズオン: アクセストークンの生成

Web/iOS/AndroidアプリケーションからTwilioのサービスを利用する場合、`Auth Token`などの資格情報はクライアントから使用せず、アクセストークンをかわりに利用します。

このハンズオンではServerless Toolkitを使ったサーバレス実行環境でアクセストークンを生成するための方法を学習します。


生成したアクセストークンは生存時間が決まっており、このトークンを用いてTwilio Client SDKの認証します。アクセストークンは最大24時間利用できますが、アプリケーションに適した最短の時間に設定することが推奨されています。

## ハンズオンのゴール
- Serverless Toolkitの基本的な利用方法を理解する。
- ビデオチャットが可能なアクセストークンの生成方法を理解する。

## 手順
1. [Twilio Serverlessプロジェクトを作成](01-Create-Serverless-Project.md)
2. [Twilio Functionsのカスタマイズ](02-Customize-Function.md)

## 次のハンズオン

[ハンズオン: Twilio CLIを使ったサービスの利用](../02-Use-Twilio-CLI/02-00-Overview.md)