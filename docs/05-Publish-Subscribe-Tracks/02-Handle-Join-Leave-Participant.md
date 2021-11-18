# 手順2: Roomへの参加・退出をハンドリング

この手順ではRoomに新規の参加者が追加された場合と既存の参加者が退出した場合の処理を実装します。

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

`participantDisconnect`関数は指定の参加者のトラックをアンサブスクライブし、ページから表示要素を削除するという実装になります。

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


## video.js完成版

すべてを実装したvideo.jsはこちらになります。

```js
window.addEventListener('load', () => {
    const loginForm = document.getElementById('login-form');
    const identityField = document.getElementById('identity');
    const participants = document.getElementById('participants');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // ユーザー名を取得
        const identity = identityField.value;

        // アクセストークンをリクエスト
        let response = await fetch('/video-token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ identity: identity })
        });
        let {token, room, roomSid} = await response.json();

        // デバッグ用に出力
        console.log(`token: ${token}`);
        console.log(`room: ${room}`);
        
        // ビデオチャットを開始
        startVideoChat(token, room);        
    });


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

        // Roomに新たに参加者が追加された場合のイベントハンドラを指定
        videoRoom.on("participantConnected", participantConnected);

        // Roomから参加者が退出した場合のイベントハンドラを指定
        videoRoom.on("participantDisconnected", participantDisconnected);

        // ブラウザのリロードやタブのクローズ時にRoomから退出
        window.addEventListener('beforeunload', tidyUp(videoRoom));
        window.addEventListener('pagehide', tidyUp(videoRoom));
    }

    function participantConnected(participant) {
        //  デバッグ用に出力
        console.log(`${participant.identity}がRoomに参加しました。`)
        // <Div>要素を作成。参加者のidentityをIDに設定
        const el = document.createElement('div');
                              participant.identity
        el.setAttribute('id', participant.identity);

        // 参加者一覧に追加
        participants.appendChild(el);

        // 参加者のトラック（映像、音声）をページに追加
        participant.tracks.forEach((trackPublication) => {
            trackPublished(trackPublication, participant);
        })

        // 参加者が新しくパブリッシュした場合のイベントハンドラを登録
        participant.on('trackPublished', trackPublished)
    }

    // トラックがパブリッシュされた際の処理
    function trackPublished(trackPublication, participant) {
        
        console.log('パブリッシュされたトラック');
        console.log(trackPublication);
        // 事前に作成した参加者のIdentityをIDにした<div>要素を取得
        const el = document.getElementById(participant.identity);

         // トラックがサブスクライブされた際の処理をあらかじめ定義
         const trackSubscribed = (track) => {
            // trackの種類に合わせて<video> <audio>タグを要素に追加
            el.appendChild(track.attach());
            // デバッグ用に出力
            console.log(`サブスクライブした${track}をページに追加しました。`)
         };

        // パブリッシュされたトラックのサブスクライブ処理（要素の追加）
        if (trackPublication.track)
            trackSubscribed(trackPublication.track);
        
        // RemoteParticipantがこのトラックをサブスクライブした際のイベントハンドラを登録
        trackPublication.on('subscribed', trackSubscribed);
    }

    // 参加者が接続解除した際の処理
    function participantDisconnected(participant) {
        participant.removeAllListeners();
        const el = document.getElementById(participant.identity);
        el.remove();
    }

    // トラックがアンパブリッシュされた際の処理(今回のハンズオンでは使用しない)
    function trackUnpublished(trackPublication) {
        trackPublication.track.detach().forEach(function (mediaElement) {
        mediaElement.remove();
        });
    }

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
});
```


## まとめ

これでハンズオンは終了です。今回作成したプロジェクトはTwilio Functions / Assetsにデプロイしクラウド上で動作を確かめることができます。

デプロイ方法については[Twilio Serverlessハンズオン](https://github.com/neri78/Twilio-HandsOn-Serverless-JP)を[参考](https://github.com/neri78/Twilio-HandsOn-Serverless-JP/blob/main/docs/03-Deploy-to-Twilio-Cloud/00-Overview.md)にしてください。


ただしユーザー認証機能は実装されていないため、本番稼働には使用しないでください。また、不要な課金を避けるため、デプロイ後に不要となった時点で[サービスを削除](https://github.com/neri78/Twilio-HandsOn-Serverless-JP/blob/main/docs/04-Remove-Service/01-Delete-Service.md)することを忘れないようにしましょう。


