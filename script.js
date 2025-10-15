window.onload = () => {
    const loginButton = document.getElementById('login-button');
    const loginSection = document.getElementById('login-section');
    const rankingSection = document.getElementById('ranking-section');

    // ★★★ ここをあなたのClient IDに書き換えてください ★★★
    const CLIENT_ID = '2b4641bff4384bcaa3bf682c7619ee28'; 
    const REDIRECT_URI = 'https://naoki1679.github.io/spotify-app/';
    const SCOPE = 'user-top-read';

    // 1. ログインボタンのクリックイベント
    loginButton.addEventListener('click', () => {
        // Spotifyの認証ページにリダイレクト
        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(CLIENT_ID);
        url += '&scope=' + encodeURIComponent(SCOPE);
        url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
        window.location = url;
    });

    // 2. ページのURLにアクセストークンが含まれているかチェック
    const getAccessTokenFromUrl = () => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return params.get('access_token');
    };

    const accessToken = getAccessTokenFromUrl();

    if (accessToken) {
        // トークンがあれば、ログインボタンを隠し、ランキングを表示
        loginSection.classList.add('hidden');
        rankingSection.classList.remove('hidden');

        // URLからトークン情報をクリーンアップ
        history.pushState("", document.title, window.location.pathname + window.location.search);

        fetchTopTracks(accessToken);
    }

    // 3. Spotify APIからトップトラックを取得して表示する関数
    async function fetchTopTracks(token) {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // トークンの有効期限切れなどの場合
                if (response.status === 401) {
                    alert('認証の有効期限が切れました。再度ログインしてください。');
                    loginSection.classList.remove('hidden');
                    rankingSection.classList.add('hidden');
                }
                throw new Error('データの取得に失敗しました。');
            }
            const data = await response.json();
            displayTracks(data.items);
        } catch (error) {
            console.error(error);
        }
    }

    // 4. 取得した曲情報をHTMLに描画する関数 (この部分は変更なし)
    function displayTracks(tracks) {
        const trackList = document.getElementById('track-list');
        trackList.innerHTML = ''; 

        tracks.forEach((track, index) => {
            const artists = track.artists.map(artist => artist.name).join(', ');
            const artworkUrl = track.album.images[0]?.url || '';

            const listItem = document.createElement('li');
            listItem.className = 'track-item';
            listItem.innerHTML = `
                <span class="track-rank">${index + 1}</span>
                <img src="${artworkUrl}" alt="${track.name}のアルバムアートワーク" class="track-artwork">
                <div class="track-info">
                    <p class="track-title">${track.name}</p>
                    <p class="track-artist">${artists}</p>
                </div>
            `;
            trackList.appendChild(listItem);
        });
    }
};