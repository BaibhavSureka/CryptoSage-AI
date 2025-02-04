import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getAggregates, getFinancials, getNews, getTickerSnapshot } from "@/lib/polygon";

export const tools = [
  new DynamicStructuredTool({
    name: "fetchFinancialData",
    description: "Fetches financial data for a specified stock ticker.",
    schema: z.object({
      ticker: z.string().describe("Stock ticker symbol"),
    }),
    func: async ({ ticker }) => JSON.stringify(await getFinancials(ticker)),
  }),

  new DynamicStructuredTool({
    name: "fetchStockNews",
    description: "Retrieves relevant news articles for a given stock ticker.",
    schema: z.object({
      ticker: z.string().describe("Stock ticker symbol"),
    }),
    func: async ({ ticker }) => JSON.stringify(await getNews(ticker)),
  }),

  new DynamicStructuredTool({
    name: "fetchStockPriceHistory",
    description: "Retrieves historical stock price data for a specified ticker over a time range.",
    schema: z.object({
      ticker: z.string().describe("Stock ticker symbol"),
      from: z.string().describe("Start date for price history"),
      to: z.string().describe("End date for price history"),
    }),
    func: async ({ ticker, from, to }) => JSON.stringify(await getAggregates(ticker, from, to)),
  }),

  new DynamicStructuredTool({
    name: "fetchLatestStockPrice",
    description: "Fetches the latest price for a specified stock ticker.",
    schema: z.object({
      ticker: z.string().describe("Stock ticker symbol"),
    }),
    func: async ({ ticker }) => JSON.stringify(await getTickerSnapshot(ticker)),
  }),
];