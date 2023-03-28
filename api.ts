import axios from "axios";

export async function getPrice(token: string) {
  return await axios.get("https://min-api.cryptocompare.com/data/price", {
    params: {
      fsym: token,
      tsyms: "USD",
      api_key: `${process.env.SECRET_TOKEN}`,
    },
  });
}
