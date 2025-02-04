import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getAggregates, getFinancials, getNews, getTickerSnapshot } from "@/lib/polygon-crypto";

export const tools = [
  new DynamicStructuredTool({
    name: "fetchBalance",
    description: "Fetches the balance details for a specified cryptocurrency ticker.",
    schema: z.object({
      ticker: z.string().describe("Cryptocurrency ticker symbol"),
    }),
    func: async ({ ticker }) => JSON.stringify({
      balance: {
        crypto: 0.0747,
        fiat: 196.42,
      },
    }),
  }),
  
  new DynamicStructuredTool({
    name: "fetchSwapDetails",
    description: "Provides swap details for a specific cryptocurrency ticker.",
    schema: z.object({
      ticker: z.string().describe("Cryptocurrency ticker symbol"),
    }),
    func: async ({ ticker }) => JSON.stringify({
      balance: {
        crypto: 1000,
        fiat: 10000,
      },
    }),
  }),

  new DynamicStructuredTool({
    name: "fetchCryptoPriceHistory",
    description: "Retrieves historical price data for a given cryptocurrency within a specified time range.",
    schema: z.object({
      ticker: z.string().describe("Cryptocurrency ticker symbol"),
      from: z.string().describe("Start date for price history"),
      to: z.string().describe("End date for price history"),
    }),
    func: async ({ ticker, from, to }) => JSON.stringify(await getAggregates(ticker, from, to)),
  }),

  new DynamicStructuredTool({
    name: "fetchLatestCryptoPrice",
    description: "Fetches the latest price for a specified cryptocurrency ticker.",
    schema: z.object({
      ticker: z.string().describe("Cryptocurrency ticker symbol"),
    }),
    func: async ({ ticker }) => JSON.stringify(await getTickerSnapshot(ticker)),
  }),
];
