import { useEffect, useState, useRef } from "react";
import { getVolatileCoins } from "../utils/fetchFuturesData";

export default function Home() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const audioRef = useRef(null);

  const fetchData = async () => {
    const data = await getVolatileCoins();
    setGainers(data.gainers);
    setLosers(data.losers);

    if (data.gainers.length > 0 || data.losers.length > 0) {
      audioRef.current?.play();
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderTable = (title, data, color) => (
    <>
      <h2 style={{ color }}>{title}</h2>
      <table style={{ width: "100%", marginBottom: 30, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "10px" }}>Coin</th>
            <th style={{ textAlign: "left", padding: "10px" }}>% Değişim</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Zaman</th>
            <th style={{ textAlign: "left", padding: "10px" }}>Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr key={coin.symbol} style={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{coin.symbol}</td>
              <td style={{ padding: "10px" }}>{coin.change}%</td>
              <td style={{ padding: "10px" }}>{coin.time}</td>
              <td style={{ padding: "10px" }}>
                <a href={`https://www.binance.com/en/futures/${coin.symbol}`} target="_blank" rel="noreferrer">
                  Git
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div style={{ padding: 20, fontFamily: "Arial", background: "#f4f6f8", minHeight: "100vh" }}>
      <h1>📈 %3+ Yükselen / 📉 %3– Düşen Binance Futures Coinler (15dk)</h1>
      <audio ref={audioRef} src="/alert.mp3" />
      {gainers.length === 0 && losers.length === 0 ? <p>Yükleniyor...</p> : (
        <>
          {renderTable("🚀 Yükselen Coinler", gainers, "green")}
          {renderTable("🔻 Düşen Coinler", losers, "red")}
        </>
      )}
    </div>
  );
}
