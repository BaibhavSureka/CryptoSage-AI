"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

interface PricingToggleProps {
  isYearly: boolean
  setIsYearly: (value: boolean) => void
}

function PricingToggle({ isYearly, setIsYearly }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span className={`text-sm ${!isYearly ? "text-white" : "text-gray-400"}`}>
        Pay Monthly
      </span>
      <button
        onClick={() => setIsYearly(!isYearly)}
        className="relative w-16 h-8 rounded-full bg-gray-700 flex items-center justify-between p-1"
      >
        <div
          className={`absolute w-7 h-7 bg-purple-500 rounded-full transition-transform duration-300 ${
            isYearly ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>
      <span className={`text-sm ${isYearly ? "text-white" : "text-gray-400"}`}>
        Pay Yearly
      </span>
    </div>
  )
}

interface Feature {
  text: string
  included: boolean
}

interface PricingCardProps {
  plan: string
  monthlyPrice: number
  yearlyPrice: number
  features: Feature[]
  isYearly: boolean
  isPro?: boolean
}

function PricingCard({
  plan,
  monthlyPrice,
  yearlyPrice,
  features,
  isYearly,
  isPro = false,
}: PricingCardProps) {
  const currentPrice = isYearly ? yearlyPrice : monthlyPrice

  return (
    <div
      className={`bg-[#1E1E2E] p-8 rounded-xl transition-all duration-300 hover:scale-105 ${
        isPro ? "border-2 border-purple-500 shadow-lg shadow-purple-500/20" : "border border-gray-700"
      }`}
    >
      <h3 className="text-2xl font-bold text-white mb-4">{plan}</h3>
      <div className="relative h-20 flex items-center justify-center">
        <p className="text-4xl font-bold text-white">
          ${currentPrice} <span className="text-lg text-gray-400">/ {isYearly ? "year" : "month"}</span>
        </p>
      </div>
      <Button
        className={`w-full mb-8 rounded-full ${
          isPro ? "bg-purple-500 hover:bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        {isPro ? "Start 30-day free trial" : "Get started"}
      </Button>
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-center ${
              feature.included ? "text-gray-300" : "text-gray-500"
            }`}
          >
            <Check
              className={`mr-2 w-5 h-5 ${
                feature.included ? "text-purple-500" : "text-gray-600"
              }`}
            />
            {feature.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="bg-[#0D1117] py-20 px-6 border-t border-gray-800">
      <div className="container mx-auto text-center max-w-6xl">
        <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Select the perfect plan to elevate your crypto trading experience with
          our AI-powered tools and insights.
        </p>

        {/* Pricing Toggle */}
        <PricingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PricingCard
            plan="BASIC"
            monthlyPrice={0}
            yearlyPrice={0}
            features={[
              { text: "Basic portfolio tracking", included: true },
              { text: "Limited AI insights", included: true },
              { text: "Single chain support", included: true },
              { text: "Advanced analytics", included: false },
              { text: "Automated trading", included: false },
              { text: "24/7 priority support", included: false },
            ]}
            isYearly={isYearly}
          />
          <PricingCard
            plan="PRO"
            monthlyPrice={49}
            yearlyPrice={470}
            features={[
              { text: "Advanced portfolio tracking", included: true },
              { text: "Full AI-powered insights", included: true },
              { text: "Multi-chain support", included: true },
              { text: "Advanced analytics", included: true },
              { text: "Automated trading", included: true },
              { text: "24/7 priority support", included: true },
            ]}
            isYearly={isYearly}
            isPro={true}
          />
        </div>
      </div>
    </section>
  )
}
