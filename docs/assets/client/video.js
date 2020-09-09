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
        console.log(`roomSid: ${roomSid}`);
        
        // ビデオチャットを開始
        startVideoChat(token, room);        
    });


    async function startVideoChat(token, room) {
        // Video Client SDKを使用し、Roomに接続（音声OFF, ビデオON）
        
        // ローカル参加者をページに追加
        
        // 現在のルーム参加者をページに追加
        
        // // Roomに新たに参加者が追加された場合のイベントハンドラを指定
        
        // // Roomから参加者が退出した場合のイベントハンドラを指定
        
        // ブラウザのリロードやタブのクローズ時にRoomから退出
        
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
        // 事前に作成した参加者のIdentityをIDにした<div>要素を取得
        const el = document.getElementById(participant.identity);

         // トラックがサブスクライブされた際の処理
         const trackSubscribed = (track) => {
            // trackの種類に合わせて<video> <audio>タグを要素に追加
            el.appendChild(track.attach())
            // デバッグ用に出力
            console.log(`${track}のサブスクライブ後処理を完了しました。`)
         };

        // パブリッシュされたトラックがサブスクライブされている場合
        if (trackPublication.track)
            trackSubscribed(trackPublication.track);
        
        // パブリッシュされたトラックのサブスクライブイベントハンドラを登録
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