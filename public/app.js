function App() {
  const [songs, setSongs] = React.useState([]);

  React.useEffect(() => {
    const spreadsheetId = "17meNocmInqv0vbbj6PeCUnsgvSSGqgoZpv0QpCQBG_I"; // シートID
    const range = "Sheet1!B2:K1000"; // 曲名範囲
    const apiKey = "AIzaSyAkW3L5MdWE9MVxezump6aE-OPblpVmcds"; // Google APIキー

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.values) {
          const counts = new Map();
          data.values.flat().forEach(song => {
            const s = song?.trim();
            if (s) {
              counts.set(s, (counts.get(s) || 0) + 1);
            }
          });
          const sorted = Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1]); // 出現回数で降順
          setSongs(sorted);
        }
      })
      .catch(err => console.error("APIエラー:", err));
  }, []);

  return (
    <div className="ranking">
      <h2>ランキング</h2>
      {songs.length === 0 ? (
        <p>データを読み込み中...</p>
      ) : (
        <ol>
          {songs.map(([song, count], index) => (
            <li key={index}>{song} ×{count}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
