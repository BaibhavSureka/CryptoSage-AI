import { useState, useEffect } from "react";
import axios from "axios";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Zap, PieChartIcon, BarChart2, Settings } from "lucide-react";
import { HexString, Price, PriceServiceConnection } from "@pythnetwork/price-service-client";
import Web3 from "web3";
import { useMetaMask } from "metamask-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const initialPortfolioData = [
  { name: "ETH", value: 40, color: "#627EEA" },
  { name: "BTC", value: 30, color: "#F7931A" },
  { name: "BNB", value: 15, color: "#F3BA2F" },
  { name: "MATIC", value: 10, color: "#8247E5" },
  { name: "Other", value: 5, color: "#2C3E50" },
];

const initialPerformanceData = [
  { date: "1 May", ETH: 2000, BTC: 28000, BNB: 300 },
  { date: "8 May", ETH: 2200, BTC: 30000, BNB: 320 },
  { date: "15 May", ETH: 1800, BTC: 27000, BNB: 280 },
  { date: "22 May", ETH: 2100, BTC: 29000, BNB: 310 },
  { date: "29 May", ETH: 2300, BTC: 31000, BNB: 330 },
  { date: "5 Jun", ETH: 2400, BTC: 32000, BNB: 340 },
  { date: "12 Jun", ETH: 2600, BTC: 34000, BNB: 360 },
];

const topMovers = [
  { name: "PEPE", change: 25.5, value: 0.00000012 },
  { name: "SHIB", change: -12.3, value: 0.00000851 },
  { name: "DOGE", change: 8.7, value: 0.07253 },
  { name: "ARB", change: -5.2, value: 1.23 },
];

const aiInsights = [
  "Consider rebalancing: Your BTC allocation is 5% below the recommended threshold.",
  "Opportunity: ETH gas fees are at a 30-day low. Good time for transactions.",
  "Risk Alert: Your stablecoin exposure is lower than your set risk tolerance.",
  "Yield Opportunity: Lending USDC on Aave (Polygon) currently offers 5.2% APY.",
];

const fetchTokenTransfers = async (address) => {
  const response = await fetch(
    `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=YOUR_ETHERSCAN_API_KEY`
  );
  const data = await response.json();
  if (data.status === "1") {
    return data.result;
  }
  return [];
};

const calculateTokenBalances = (transfers, address) => {
  const balances = {};

  transfers.forEach((transfer) => {
    const tokenSymbol = transfer.tokenSymbol;
    const value = parseFloat(transfer.value) / Math.pow(10, transfer.tokenDecimal);

    if (transfer.from.toLowerCase() === address.toLowerCase()) {
      // Outgoing transfer (subtract from balance)
      balances[tokenSymbol] = (balances[tokenSymbol] || 0) - value;
    } else if (transfer.to.toLowerCase() === address.toLowerCase()) {
      // Incoming transfer (add to balance)
      balances[tokenSymbol] = (balances[tokenSymbol] || 0) + value;
    }
  });

  return balances;
};

const buildPortfolio = (balances) => {
  const portfolio = [];
  for (const [symbol, balance] of Object.entries(balances)) {
    if (balance > 0) {
      portfolio.push({ symbol, balance });
    }
  }
  return portfolio;
};

export default function DashboardPage() {
  const { status, connect, account } = useMetaMask();
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData);
  const [performanceData, setPerformanceData] = useState(initialPerformanceData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [web3, setWeb3] = useState<Web3 | undefined>(undefined);

  useEffect(() => {
    if (status === "connected") {
      setWeb3(new Web3(window.ethereum));
    }
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (account) {
          // Fetch token transfers
          const tokenTransfers = await fetchTokenTransfers(account);

          // Calculate token balances
          const balances = calculateTokenBalances(tokenTransfers, account);

          // Build portfolio
          const portfolio = buildPortfolio(balances);

          // Update portfolio data
          const updatedPortfolioData = portfolio.map((asset, index) => ({
            name: asset.symbol,
            value: asset.balance,
            color: initialPortfolioData[index]?.color || "#2C3E50",
          }));
          setPortfolioData(updatedPortfolioData);

          // Update performance data (example: using trends)
          const updatedPerformanceData = initialPerformanceData.map((entry, index) => ({
            ...entry,
            ETH: entry.ETH + (portfolio[0]?.balance || 0) * index,
            BTC: entry.BTC + (portfolio[1]?.balance || 0) * index,
            BNB: entry.BNB + (portfolio[2]?.balance || 0) * index,
          }));
          setPerformanceData(updatedPerformanceData);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 mr-2">
            <svg viewBox="0 0 100 100" className="text-blue-500">
              <circle cx="50" cy="50" r="45" fill="currentColor" fillOpacity="0.2" />
              <circle cx="50" cy="50" r="20" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-bold">CryptoAI</span>
        </div>
        <div className="space-y-2">
          <SidebarItem icon={<Activity />} label="Dashboard" active />
          <SidebarItem icon={<Zap />} label="Swap" />
          <SidebarItem icon={<PieChartIcon />} label="Portfolio" />
          <SidebarItem icon={<BarChart2 />} label="Markets" />
          <SidebarItem icon={<Settings />} label="Settings" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={connect}
            >
              {status === "connected" ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
            </button>
          </div>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <OverviewCard title="Total Balance" value="$12,345.67" change={5.67} />
            <OverviewCard title="24h Change" value="$1,234.56" change={2.34} />
            <OverviewCard title="Total Profit" value="$3,456.78" change={-1.23} />
            <OverviewCard title="Active Positions" value={portfolioData.length} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="col-span-2 bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="ETH" stackId="1" stroke="#627EEA" fill="#627EEA" />
                    <Area type="monotone" dataKey="BTC" stackId="1" stroke="#F7931A" fill="#F7931A" />
                    <Area type="monotone" dataKey="BNB" stackId="1" stroke="#F3BA2F" fill="#F3BA2F" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-4">
                {portfolioData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Movers and AI Insights */}
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Top Movers</h2>
              <div className="space-y-4">
                {topMovers.map((mover, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{mover.name}</span>
                      <span className="ml-2 text-gray-400">${mover.value}</span>
                    </div>
                    <div className={`flex items-center ${mover.change > 0 ? "text-green-500" : "text-red-500"}`}>
                      {mover.change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      <span>{Math.abs(mover.change)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex items-start">
                    <Zap className="mr-2 text-yellow-500 flex-shrink-0" />
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }) {
  return (
    <div className={`flex items-center p-2 rounded-lg cursor-pointer ${active ? "bg-gray-700" : "hover:bg-gray-700"}`}>
      {icon}
      <span className="ml-3">{label}</span>
    </div>
  );
}

function OverviewCard({ title, value, change }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <div className="text-2xl font-bold mb-2">{value}</div>
      {change !== undefined && (
        <div className={`flex items-center ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
          {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  );
}