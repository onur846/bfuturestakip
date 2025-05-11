import { useEffect, useState, useRef } from "react";
import { getPriceMovements, fetchInitialPrices } from "../utils/fetchLiveChanges";

export default function Home() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const start = async () => {
      await fetchInitialPrices();
      fetchData();
      setInterval(fetchData, 10000); // 10 saniyede bir veri al
    };
    start();
  }, []);

  const fetchData = async () => {
    const { gainers, losers } = await getPriceMovements();
    if (gainers.length > 0 || losers.length > 0) {
      audioRef.current?.play();
    }
    setGainers(gainers);
    setLosers(losers);
  };

  const renderTable = (title, data, color) => (
    <>
      <h2 style={{ color }}>{title}</h2>
      <table style={{ width: "100%", marginBottom: 30, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Coin</th>
            <th>% Değişim</th>
            <th>Zaman</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr key={coin.symbol}>
              <td>{coin.symbol}</td>
              <td>{coin.change}%</td>
              <td>{coin.time}</td>
              <td>
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
    <div style={{ padding: 20 }}>
      <h1>⏱️ Anlık Fiyat Takibi – REST API (10sn)</h1>
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
