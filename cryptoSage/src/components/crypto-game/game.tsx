"use client"

import { useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function CryptoGame({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [playerBalance, setPlayerBalance] = useState(1000)
  const [cryptoPrice, setCryptoPrice] = useState(100)
  const [inventory, setInventory] = useState({ CryptoCoins: 0 })
  const [message, setMessage] = useState("")
  const [achievements, setAchievements] = useState<string[]>([])
  const [marketHistory, setMarketHistory] = useState<number[]>([100])
  const [playerName, setPlayerName] = useState("")
  const [showIntro, setShowIntro] = useState(true)
  const [suggestion, setSuggestion] = useState("")

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCryptoPrice((prevPrice) => {
        const change = Math.random() * 20 - 10
        const newPrice = prevPrice + change
        setMarketHistory((prev) => [...prev.slice(-20), newPrice])
        updateSuggestion(newPrice, change)
        return newPrice
      })
    }, 2000)
    return () => clearInterval(intervalId)
  }, [])

  const updateSuggestion = (price: number, change: number) => {
    if (change > 5) {
      setSuggestion("The market is rising quickly. Consider selling for a profit!")
    } else if (change < -5) {
      setSuggestion("The market is dropping. It might be a good time to buy!")
    } else if (price > 150) {
      setSuggestion("The price is quite high. Be cautious about buying.")
    } else if (price < 50) {
      setSuggestion("The price is low. It could be a good opportunity to buy.")
    } else {
      setSuggestion("The market is stable. Keep an eye on trends before making a decision.")
    }
  }

  const buyCrypto = () => {
    if (playerBalance >= cryptoPrice) {
      setPlayerBalance((prev) => prev - cryptoPrice)
      setInventory((prev) => ({ ...prev, CryptoCoins: prev.CryptoCoins + 1 }))
      setMessage("Successfully bought 1 CryptoCoin!")
      checkAchievements()
    } else {
      setMessage("Insufficient balance!")
    }
  }

  const sellCrypto = () => {
    if (inventory.CryptoCoins > 0) {
      setPlayerBalance((prev) => prev + cryptoPrice)
      setInventory((prev) => ({ ...prev, CryptoCoins: prev.CryptoCoins - 1 }))
      setMessage("Successfully sold 1 CryptoCoin!")
      checkAchievements()
    } else {
      setMessage("No CryptoCoins to sell!")
    }
  }

  const checkAchievements = () => {
    if (inventory.CryptoCoins >= 10 && !achievements.includes("Crypto Collector")) {
      setAchievements((prev) => [...prev, "Crypto Collector"])
      setMessage("Achievement unlocked: Crypto Collector!")
    }
    if (playerBalance >= 2000 && !achievements.includes("Profit Master")) {
      setAchievements((prev) => [...prev, "Profit Master"])
      setMessage("Achievement unlocked: Profit Master!")
    }
  }

  const chartData = {
    labels: marketHistory.map((_, i) => i.toString()),
    datasets: [
      {
        label: "Crypto Price",
        data: marketHistory,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      y: {
        ticks: { color: "white" },
      },
      x: {
        ticks: { color: "white" },
      },
    },
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl rounded-xl bg-gray-900 p-6 text-white">
            {showIntro ? (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-purple-500">Welcome to CryptoQuest!</h2>
                <p className="text-gray-300">Learn crypto trading in a fun, risk-free environment.</p>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="px-4 py-2 rounded bg-gray-800 border border-purple-500"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
                <button
                  onClick={() => setShowIntro(false)}
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                  Start Game
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-purple-500">CryptoQuest</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Market Analysis</h3>
                    <Line data={chartData} options={chartOptions} />
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-xl font-bold text-purple-400 mb-4">Stats</h3>
                      <div className="space-y-2">
                        <p>Balance: ${playerBalance.toFixed(2)}</p>
                        <p>Current Price: ${cryptoPrice.toFixed(2)}</p>
                        <p>Owned Coins: {inventory.CryptoCoins}</p>
                      </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-xl font-bold text-purple-400 mb-4">AI Suggestion</h3>
                      <p>{suggestion}</p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={buyCrypto}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Buy
                      </button>
                      <button
                        onClick={sellCrypto}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Sell
                      </button>
                    </div>

                    {message && (
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <p>{message}</p>
                      </div>
                    )}

                    {achievements.length > 0 && (
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-xl font-bold text-purple-400 mb-4">Achievements</h3>
                        <ul>
                          {achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

