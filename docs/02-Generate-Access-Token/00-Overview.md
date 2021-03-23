#  ハンズオン: アクセストークンの生成

Web/iOS/AndroidアプリケーションからTwilioのサービスを利用する場合、`Auth Token`などの資格情報はクライアントから使用せず、アクセストークンをかわりに利用します。

このハンズオンでは[Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit)を使って作成されたサンプルアプリケーションでアクセストークンを生成するための方法を学習します。


生成したアクセストークンは生存時間が決まっており、このトークンを用いてTwilio Client SDKを認証します。アクセストークンは最大24時間利用できますが、アプリケーションに適した最短の時間に設定することが推奨されています。

## ハンズオンのゴール
- ビデオチャットが可能なアクセストークンの生成方法を理解する。

## 手順
1. [サンプルTwilio Serverlessプロジェクトをクローンし、Twilio資格情報を設定](01-Clone-Sample-App.md)
2. [Twilio Functionsのカスタマイズ](02-Customize-Function.md)

## 次のハンズオン

[ハンズオン: ハンズオン: ビデオチャット用のRoomを作成](../03-Create-Video-Chat-Room/00-Overview.md)