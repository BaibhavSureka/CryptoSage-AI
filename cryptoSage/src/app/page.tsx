'use client'

import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PricingSection } from "@/components/pricing-section"
import { CryptoGame } from "@/components/crypto-game/game"

export default function HomePage() {
  const [isGameOpen, setIsGameOpen] = useState(false)

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="bg-[#0D1117] text-white py-20 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center max-w-7xl">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 lg:pr-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">AI-Powered Crypto Portfolio Management</h1>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="text-purple-500 text-2xl mt-1" />
                Advanced AI algorithms for optimal trading
              </li>
              <li className="flex items-center">
                <Check className="text-purple-500 text-2xl mt-1" />
                Real-time market insights and predictions
              </li>
              <li className="flex items-center">
                <Check className="text-purple-500 text-2xl mt-1" />
                Secure multi-chain portfolio tracking
              </li>
            </ul>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600">
                <Link href="/dashboard">Get started for Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="border bg-black border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-500" onClick={() => setIsGameOpen(true)}
                >
                Play To Learn Crypto
              </Button>
              <CryptoGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/images/landing_img.jpg"
              alt="Crypto Dashboard"
              width={600}
              height={400}
              className="w-full rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-[#0D1117] text-white py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">TRUSTED BY MILLIONS OF CRYPTO TRADERS WORLDWIDE</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { src: "/images/bitcoin-logo.png", alt: "Bitcoin" },
              { src: "/images/ethereum-logo.svg", alt: "Ethereum" },
              { src: "/images/binance-logo.svg", alt: "Binance" },
              { src: "/images/coinbase-logo.svg", alt: "Coinbase" },
              { src: "/images/kraken-logo.svg", alt: "Kraken" },
            ].map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src || "/placeholder.svg"}
                alt={logo.alt}
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#0D1117] text-white py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "chart-line",
                title: "Advanced Analytics",
                description: "In-depth market analysis and portfolio performance tracking.",
              },
              {
                icon: "robot",
                title: "AI-Powered Insights",
                description: "Machine learning algorithms for predictive market analysis.",
              },
              {
                icon: "exchange-alt",
                title: "Multi-Chain Swaps",
                description: "Seamless asset exchanges across multiple blockchain networks.",
              },
              {
                icon: "shield-alt",
                title: "Enhanced Security",
                description: "State-of-the-art encryption and multi-factor authentication.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-700/50"
              >
                <i className={`fas fa-${feature.icon} text-4xl text-purple-500 mb-4`}></i>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Analysis Section */}
      <section className="bg-[#0D1117] py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <Image
              src="/images/portfolio.png"
              alt="Portfolio Analysis"
              width={600}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-white mb-6">Comprehensive Portfolio Analysis</h2>
            <p className="text-gray-400 mb-6">
              Get a clear view of your crypto investments with our advanced portfolio analysis tools.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Real-time asset tracking",
                "Performance metrics",
                "Risk assessment",
                "Historical data analysis",
                "Customizable dashboards",
                "Multi-exchange support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-white">
                  <Check className="text-primary mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Trading Section */}
      <section className="bg-[#0D1117] py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <div className="text-purple-500 font-semibold mb-4">AI-POWERED TRADING</div>
            <h2 className="text-4xl font-bold text-white mb-4">Harness the Power of AI for Smarter Trading</h2>
            <p className="text-gray-400 mb-12">
              Our advanced AI algorithms analyze market trends and provide intelligent trading suggestions to maximize
              your profits.
            </p>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <Check className="text-purple-500 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Predictive Analysis</h3>
                  <p className="text-gray-400">
                    Our AI models predict market movements with high accuracy, giving you a competitive edge.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Check className="text-purple-500 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Automated Trading</h3>
                  <p className="text-gray-400">
                    Set up automated trading strategies based on AI insights for 24/7 portfolio optimization.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Check className="text-purple-500 text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Risk Management
                    <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">AI-powered</span>
                  </h3>
                  <p className="text-gray-400">
                    Our AI continuously monitors your portfolio and suggests risk mitigation strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <Image
              src="/images/trading.jpg"
              alt="AI Trading Interface"
              width={600}
              height={400}
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Wallet Integration Section */}
      <section className="bg-[#0D1117] py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Seamless Wallet Integration</h2>
          <p className="text-gray-400 mb-12">
            Connect your favorite wallets and manage your assets securely across multiple chains.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "MetaMask",
                logo: "/images/metamask-logo.png",
                description: "Popular Ethereum and ERC-20 token wallet.",
              },
              { name: "Ledger", logo: "/images/ledger-logo.png", description: "Hardware wallet for maximum security." },
              {
                name: "Trezor",
                logo: "/images/trezor-logo.png",
                description: "Another trusted hardware wallet option.",
              },
            ].map((wallet) => (
              <div
                key={wallet.name}
                className="bg-gray-800/50 p-6 rounded-lg transform transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={wallet.logo || "/placeholder.svg"}
                  alt={wallet.name}
                  width={64}
                  height={64}
                  className="h-16 w-auto mx-auto mb-4"
                />
                <h3 className="text-white text-lg font-semibold">{wallet.name}</h3>
                <p className="text-gray-400 text-sm">{wallet.description}</p>
              </div>
            ))}
          </div>
          <Button size="lg" className="mt-12 bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600">
            Connect Your Wallet
          </Button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-[#0D1117] py-20 px-6 border-t border-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "CryptoAI has revolutionized my trading strategy. The AI-powered insights have significantly improved my
                portfolio performance."
              </p>
              <p className="font-semibold text-white">Sarah K.</p>
              <p className="text-gray-400">Crypto Enthusiast</p>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                "The multi-chain portfolio tracking and automated trading features have saved me countless hours. It's a
                game-changer for serious crypto investors."
              </p>
              <p className="font-semibold text-white">Michael R.</p>
              <p className="text-gray-400">Professional Trader</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Call to Action Section */}
      <section className="relative bg-[#0D1117] py-20 px-6 overflow-hidden border-t border-gray-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-900/20" />
        </div>
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Revolutionize Your Crypto Trading?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join thousands of traders who are already leveraging the power of AI to maximize their crypto investments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
