// @ts-ignore
import { OpenAI } from "openai";
import { 
  createAI, 
  createStreamableUI, 
  createStreamableValue, 
  getMutableAIState 
} from "ai/rsc";
import { nanoid } from "ai";
import { BotMessage } from "@/components/llm/message";
import { convertMessages, runAgent } from "@/agents/finance";
import { FunctionToolCall } from "openai/resources/beta/threads/runs/steps.mjs";

import { NewsCarousel } from "@/components/llm/news";
import { Chart } from "@/components/ui/chart";
import FunctionCallBadge from "@/components/llm/fcall";
import { Financials } from "@/components/llm/financials";
import { StockPrice } from "@/components/ui/stock-price";
import { Swap } from "@/components/web3/swap";

async function processUserMessage(input: string) {
  "use server";

  const aiState = getMutableAIState<typeof AICrypto>();

  const updatedMessages = [
    ...aiState.get().messages,
    { id: nanoid(), role: "user", content: input }
  ];

  aiState.update({ ...aiState.get(), messages: updatedMessages });

  let textStream: ReturnType<typeof createStreamableValue<string>> | undefined;
  let textComponent: React.ReactNode | undefined;
  let toolComponent: React.ReactNode | undefined;
  const ui = createStreamableUI();
  let assistantResponse = "";

  async function handleEvent(event: any) {
    switch (event.event) {
      case "on_llm_start":
      case "on_llm_stream":
        const content = event.data?.chunk?.message?.content;
        if (content) {
          if (!textStream) {
            textStream = createStreamableValue("");
            textComponent = <BotMessage content={textStream.value} />;
            ui.append(textComponent);
          }
          textStream.update(content);
        }
        break;

      case "on_llm_end":
        if (textStream) {
          textStream.done();
          if (event.name !== "getSwap") {
            assistantResponse += event.data.output;
          }
          textStream = undefined;
        }
        break;

      case "on_tool_start":
        toolComponent = (
          <FunctionCallBadge name={event.name} args={event.data.input} />
        );
        assistantResponse += event.data.output;
        break;

      case "on_tool_end":
        assistantResponse += event.data.output;
        const parsedData = JSON.parse(event.data.output);

        switch (event.name) {
          case "getSwap":
            toolComponent = <Swap showBalance={false} />;
            break;
          case "getCryptoPriceHistory":
            toolComponent = <Chart stockData={parsedData} />;
            break;
          case "getLatestPrice":
            toolComponent = <StockPrice stockPriceData={parsedData} />;
            break;
          default:
            toolComponent = <Swap showBalance={true} />;
        }

        ui.append(toolComponent);
        break;
    }
  }

  async function executeEvents() {
    const eventStream = await runAgent(convertMessages(aiState.get().messages));

    for await (const event of eventStream) {
      await handleEvent(event);
    }

    ui.done();

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        { id: nanoid(), role: "assistant", content: assistantResponse }
      ],
    });
  }

  executeEvents();

  return {
    id: nanoid(),
    display: ui?.value,
  };
}

export type Message = {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCalls?: FunctionToolCall[];
  id: string;
  name?: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

// AI is a provider that wraps your application, enabling AI and UI state access in components.
export const AICrypto = createAI<AIState, UIState>({
  actions: {
    submitUserMessage: processUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
});