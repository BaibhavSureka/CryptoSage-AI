"use client"

import { useState } from "react"
import { useAIState, useUIState } from "ai/rsc"
import { MessageList } from "@/components/llm/message-list"
import { cn } from "@/lib/utils"
import { ChatInput } from "@/components/llm/chat-input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MetaMaskProvider } from "metamask-react"

export function Chat() {
  const [messages] = useUIState()
  const [input, setInput] = useState("")
  const [aiState] = useAIState()

  return (
    <MetaMaskProvider>
      <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] bg-gray-900 min-h-[calc(100vh-4rem)]">
        {messages.length === 0 ? (
          <IntroSection setInput={setInput} />
        ) : (
          <div className={cn("pb-[200px] pt-4 md:pt-10")}>
            <MessageList messages={messages} />
          </div>
        )}
        <ChatInput input={input} setInput={setInput} />
      </div>
    </MetaMaskProvider>
  )
}

function IntroSection({ setInput }: { setInput: (input: string) => void }) {
  const examples = ["Get latest price of ETH", "What is the price of ETH over the last 30 days?"]

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="sm:mx-0 max-w-screen-md rounded-lg border border-purple-500 bg-gray-800 text-white shadow-lg sm:w-full">
        <CardHeader>
          <div className="flex flex-col space-y-4 text-center">
            <h2 className="text-2xl font-bold text-purple-400">CryptoSage AI</h2>
            <p className="text-gray-300 text-sm">
              Ask anything about crypto markets and get instant AI-powered insights.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {examples.map((example, i) => (
              <button
                key={i}
                className="rounded-md border border-purple-600 bg-purple-800/30 px-5 py-3 text-left text-sm text-gray-300 transition-all duration-200 hover:bg-purple-700/50 hover:text-white active:bg-purple-900"
                onClick={() => {
                  setInput(example)
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

