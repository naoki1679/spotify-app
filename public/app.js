function App() {
  const [songs, setSongs] = React.useState([]);

  React.useEffect(() => {
    // VercelでデプロイしたAPIのURLに変更
    fetch("https://kara-api.vercel.app/api/songs")
      .then(res => res.json())
      .then(data => setSongs(data))
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
            <li key={index}>
              {song} ×{count}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ReactDOMで描画
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
