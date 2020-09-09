# 手順2: 既存の参加者、およびRoomへの新規・退出をハンドリング

この手順ではRoomにほかの参加者が参加した場合と退出した場合の処理を実装します。

## 2-1. 既存のRoom参加者をページに追加

引き続き`video.js`をコードエディタで開き、`startVideoChat`関数のブロックまでスクロールします。これまでのハンズオンを完了していれば次のブロックとなっています。

```js
async function startVideoChat(token, room) {
    // Video Client SDKを使用し、Roomに接続（音声OFF, ビデオON）
    let videoRoom = await Twilio.Video.connect(
    token, {
        room: room,
        audio: false,
        video: true
    });
    // デバッグ用に出力
    console.log(`${videoRoom.localParticipant}で${videoRoom}に接続しました`);

    // ローカル参加者をページに追加
    participantConnected(videoRoom.localParticipant);

    // 現在のルーム参加者をページに追加

    // Roomに新たに参加者が追加された場合のイベントハンドラを指定
    
    // Roomから参加者が退出した場合のイベントハンドラを指定
    
    // ブラウザのリロードやタブのクローズ時にRoomから退出

}
```

Roomの参加者一覧は`videoRoom.participants`で取得できます。それぞれの参加者をページに追加します。

```js
// 現在のルーム参加者をページに追加
videoRoom.participants.forEach(participantConnected);
```

## 2-2. Roomへの新規参加者ハンドリング

Roomに参加者が新たに加わった際には`participantConnected`イベントが発生するため、このイベントハンドラを登録します。

```js
// Roomに新たに参加者が追加された場合のイベントハンドラを指定
videoRoom.on('participantConnected', participantConnected);
```

## 2-3. Roomからの退出をハンドリング

Roomから参加者が退出した際は`participantDisconnected`イベントが発生するため、このイベントハンドラを登録します。

```js
// Roomから参加者が退出した場合のイベントハンドラを指定
videoRoom.on('participantDisconnected', participantDisconnected);
```

`participantDisconnect`関数は指定の参加者のトラックをアンサブスクライブし、ページから表示要素を削除する、というシンプルな実装となっています。

```js
// 参加者が接続解除した際の処理
function participantDisconnected(participant) {
    participant.removeAllListeners();
    const el = document.getElementById(participant.identity);
    el.remove();
}
```

## 2-4 ブラウザ、タブクローズを処理

現在Roomからの退出ボタンは用意されていませんが、ブラウザ、タブをクローズすることで退出とみなします。その際の処理を実装します。

```js
// ブラウザのリロードやタブのクローズ時にRoomから退出
window.addEventListener('beforeunload', tidyUp(videoRoom));
window.addEventListener('pagehide', tidyUp(videoRoom));
```

`tidyUp`関数は自分自身をRoomから接続解除するという処理を実装しています。

```js
// 退出処理
function tidyUp(room) {
    return function (event) {
    if (event.persisted) {
        return;
    }
    if (room) {
        room.disconnect();
        room = null;
    }
    };
}
```

すべて実装を完了すると次のようなコードブロックとなっています。

```js
async function startVideoChat(token, room) {
    // Video Client SDKを使用し、Roomに接続（音声OFF, ビデオON）
    let videoRoom = await Twilio.Video.connect(
    token, {
        room: room,
        audio: false,
        video: true
    });
    // デバッグ用に出力
    console.log(`${videoRoom.localParticipant}で${videoRoom}に接続しました`);
    
    // ローカル参加者をページに追加
    participantConnected(videoRoom.localParticipant);
    
    // 現在のルーム参加者をページに追加
    videoRoom.participants.forEach(participantConnected);

    // // Roomに新たに参加者が追加された場合のイベントハンドラを指定
    videoRoom.on('participantConnected', participantConnected);

    // // Roomから参加者が退出した場合のイベントハンドラを指定
    videoRoom.on('participantDisconnected', participantDisconnected);

    // ブラウザのリロードやタブのクローズ時にRoomから退出
    window.addEventListener('beforeunload', tidyUp(videoRoom));
    window.addEventListener('pagehide', tidyUp(videoRoom));
}
```

ブラウザキャッシュのクリア、再読み込みを行い、複数タブでの参加を試してみましょう。


## 次のハンズオン

これでハンズオンは終了です。今回作成したプロジェクトはTwilio Functions / Assetsにデプロイしクラウド上で動作を確かめることができます。

ただし、ユーザー認証機能は実装されていないため、本番稼働には向きません。ご注意ください。
