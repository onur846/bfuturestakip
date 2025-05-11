import axios from "axios";

let initialPrices = {};

export async function fetchInitialPrices() {
  const res = await axios.get("https://fapi.binance.com/fapi/v1/ticker/price");
  const prices = res.data.filter((item) => item.symbol.endsWith("USDT"));
  initialPrices = {};
  prices.forEach((p) => {
    initialPrices[p.symbol] = parseFloat(p.price);
  });
}

export async function getPriceMovements() {
  if (Object.keys(initialPrices).length === 0) {
    await fetchInitialPrices(); // eğer ilk fiyatlar yoksa başlat
    return { gainers: [], losers: [] };
  }

  const res = await axios.get("https://fapi.binance.com/fapi/v1/ticker/price");
  const prices = res.data.filter((item) => item.symbol.endsWith("USDT"));

  const gainers = [];
  const losers = [];

  for (const p of prices) {
    const current = parseFloat(p.price);
    const old = initialPrices[p.symbol];
    if (!old || old === 0) continue;

    const change = ((current - old) / old) * 100;

    const entry = {
      symbol: p.symbol,
      change: change.toFixed(2),
      time: new Date().toUTCString(),
    };

    if (change >= 3) gainers.push(entry);
    else if (change <= -3) losers.push(entry);
  }

  return { gainers, losers };
}
