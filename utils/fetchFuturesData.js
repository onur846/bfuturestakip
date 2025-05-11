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
      const [open1] = res.data[0];
      const [, , , , close2] = res.data[1];

      const change = ((parseFloat(close2) - parseFloat(open1)) / parseFloat(open1)) * 100;

      if (change >= 3) {
        gainers.push({
          symbol,
          change: change.toFixed(2),
          time: new Date(res.data[1][0]).toUTCString(),
        });
      } else if (change <= -3) {
        losers.push({
          symbol,
          change: change.toFixed(2),
          time: new Date(res.data[1][0]).toUTCString(),
        });
      }
    } catch (err) {
      console.error(`Hata: ${symbol}`, err.message);
    }
  }

  return { gainers, losers };
}
