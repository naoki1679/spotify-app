// ★★★ このコードで上書きしてください ★★★
window.onload = () => {
    // 1. スクリプトが読み込まれたか確認
    console.log('✅ script.jsが読み込まれました。');

    const loginButton = document.getElementById('login-button');
    // 2. ボタン要素を取得できたか確認
    console.log('🔘 ボタン要素:', loginButton);

    const loginSection = document.getElementById('login-section');
    const rankingSection = document.getElementById('ranking-section');

    const CLIENT_ID = '2b4641bff4384bcaa3bf682c7619ee28'; // ★★★ Client IDはご自身のものにしてください ★★★
    const REDIRECT_URI = 'https://naoki1679.github.io/spotify-app/';
    const SCOPE = 'user-top-read';
    
    // ボタンが本当に存在するかチェックしてからイベントを追加
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            // 3. ボタンがクリックされたか確認
            console.log('🖱️ ボタンがクリックされました！');

            let url = 'https://accounts.spotify.com/authorize';
            url += '?response_type=token';
            url += '&client_id=' + encodeURIComponent(CLIENT_ID);
            url += '&scope=' + encodeURIComponent(SCOPE);
            url += '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
            
            // 4. 生成されたURLを確認
            console.log('🚀 リダイレクト先URL:', url);

            window.location = url;
        });
    } else {
        console.error('❌ エラー: "login-button" というIDを持つ要素が見つかりませんでした。');
    }

    // --- これ以降のコードは変更ありません ---

    const getAccessTokenFromUrl = () => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return params.get('access_token');
    };
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
        loginSection.classList.add('hidden');
        rankingSection.classList.remove('hidden');
        history.pushState("", document.title, window.location.pathname + window.location.search);
        fetchTopTracks(accessToken);
    }
    async function fetchTopTracks(token) {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
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