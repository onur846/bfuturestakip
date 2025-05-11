import axios from "axios";

export async function getVolatileCoins() {
  const exchangeInfo = await axios.get("https://fapi.binance.com/fapi/v1/exchangeInfo");
  const usdtSymbols = exchangeInfo.data.symbols
    .filter((s) => s.symbol.endsWith("USDT") && s.contractType === "PERPETUAL")
    .map((s) => s.symbol);

  const gainers = [];
  const losers = [];

  for (const symbol of usdtSymbols) {
    try {
      const res = await axios.get(`https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}&interval=15m&limit=2`);
      
      const open1 = parseFloat(res.data[0][1]);   // ilk mumun açılış fiyatı
      const close2 = parseFloat(res.data[1][4]);  // ikinci mumun kapanış fiyatı

      if (open1 === 0) continue; // 0'a bölme hatasını engelle

      const change = ((close2 - open1) / open1) * 100;

      const entry = {
        symbol,
        change: change.toFixed(2),
        time: new Date(res.data[1][0]).toUTCString(),
      };

      if (change >= 3) {
        gainers.push(entry);
      } else if (change <= -3) {
        losers.push(entry);
      }

    } catch (err) {
      console.error(`Hata (${symbol}):`, err.message);
    }
  }

  return { gainers, losers };
}
