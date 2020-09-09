# 手順2: Twilio Functionsのカスタマイズ

`video-token.js`にはアクセストークンを生成し、クライアント側に返すロジックが実装されています。この手順ではリクエストパラメータからチャットに参加するユーザー名を指定できるようにします。

# 2-1 video-token.jsの内容を確認し、ユーザー名を動的に設定できるように変更する。

実装されているコードを確認しましょう。`functions/video-token.js`をコードエディタで開きます。

`video-token.js`ではユーザー名（`IDENTITY`）、ルーム名（`ROOM`）がそれぞれ固定になっています。
```js
// ユーザー名
const IDENTITY = 'testing-username';
// ビデオチャットルーム名
const ROOM = 'myroom';
```

下記のように`IDENTITY`の値を固定ではなく、クライアント側のリクエストパラメータに応じて設定するように変更します。

```js
const IDENTITY = event.identity
```

また、クライアント側にトークンを返すロジックにビデオチャットルーム名を含めるよう、下記のとおり変更します。

```js
// tokenのほかにビデオチャットルーム名も返すようにする。
response.setBody({ token: accessToken.toJwt(), room: ROOM });
```

Webアプリケーションを再起動し、下記のようにパラメータとして渡されたユーザー名を渡した場合、トークンが名前によって異なる値となることを確認しましょう。先ほど試したようにユーザー名は[jwt.io](https://jwt.io)でも確認できます。また、ビデオチャットルームの名前が返されていることをブラウザーの出力からも確認してください。

```
http://localhost:3000/video-token?user=<任意のユーザー名>
```

<details><summary>IDENTITYは一意の値を設定する<summary><div>

今回は実装しませんが、IDENTITYは固有のユーザーを識別できるものでなくてはなりません。そのため、現在の実装で同じユーザー名を利用すると問題が発生します。そのため、ユーザーから複数の情報を受け取りそれを組み合わせる。あるいは常にランダムな値を生成しそちらを利用するなど、本番開発では別人が同じ値とならないように注意します。

サーバ側で一意の値を生成する場合は、クライアント側に返してあげることも忘れないようにしましょう。コード例は下記の通りです。
```js
response.setBody({ token: accessToken.toJwt(), identity: <一意の値>, room: ROOM });
```
</div>
</details>

## 次のハンズオン

- [ハンズオン: ビデオチャット用のRoomを作成](/docs/03-Create-Video-Chat-Room/00-Overview.md)
