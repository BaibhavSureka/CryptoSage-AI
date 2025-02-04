"use client";

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useMetaMask } from "metamask-react"; // Import MetaMask hook
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import { Button } from "./ui/button";

declare global {
  interface Window {
    ethereum?: any; // Define ethereum as optional
  }
}
// ERC-20 Token ABI (to interact with token contracts)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

// Token contract addresses (modify as needed)
const TOKEN_CONTRACTS: { [key: string]: string } = {
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
};

const Header = () => {
  const { status, connect, account } = useMetaMask();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [ethBalance, setEthBalance] = useState<string>("0");
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>({});
  const pathname = usePathname();

  const navItems = ["Home", "Dashboard", "Chat", "Profile"];

  // Initialize Web3 when connected
  useEffect(() => {
    if (status === "connected" && typeof window !== "undefined" && window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    }
  }, [status]);

  // Fetch Wallet Balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (web3 && account) {
        try {
          // Fetch ETH Balance
          const balanceWei = await web3.eth.getBalance(account);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setEthBalance(parseFloat(balanceEth).toFixed(4));

          // Fetch ERC-20 Token Balances
          const balances: { [key: string]: string } = {};
          for (const [symbol, contractAddress] of Object.entries(TOKEN_CONTRACTS)) {
            const tokenContract = new web3.eth.Contract(ERC20_ABI as any, contractAddress);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            balances[symbol] = web3.utils.fromWei(tokenBalance, "ether");
          }
          setTokenBalances(balances);

          // Send Portfolio Data to Django Backend
          await sendPortfolioToBackend({ ethBalance, tokenBalances });

        } catch (error) {
          console.error("Error fetching balances:", error);
        }
      }
    };

    if (web3 && account) {
      fetchBalances();
    }
  }, [web3, account]);

  // Function to send portfolio data to the Django backend
  const sendPortfolioToBackend = async (portfolioData: any) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/create_portfolio/", { portfolio: portfolioData }, { withCredentials: true });
      console.log("Portfolio successfully sent to backend!");
    } catch (error) {
      console.error("Error sending portfolio to backend:", error);
    }
  };

  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 transition-transform duration-300 ease-in-out hover:scale-110 hover:rotate-3">
            <Link href="/" className="text-2xl font-bold text-purple-500">
              CryptoSage AI
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`)
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-purple-400"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-purple-400" asChild>
              <Link href="/login">
              {
                localStorage.getItem("token") ? "" : "Login"
              }
              </Link>
            </Button>
            {localStorage.getItem("token") ? (
              status === "connected" ? (
                <div className="text-green-400 text-sm">
                  <p>Wallet: {account.substring(0, 6)}...{account.slice(-4)}</p>
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="bg-purple-600 px-4 py-2 rounded-full text-white hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Connect Wallet
                </button>
              )
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
