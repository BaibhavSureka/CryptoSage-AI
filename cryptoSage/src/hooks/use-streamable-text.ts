import { StreamableValue, readStreamableValue } from "ai/rsc";
import { useEffect, useState } from "react";

export const useStreamableText = (input: string | StreamableValue<string>) => {
  const [text, setText] = useState(typeof input === "string" ? input : "");

  useEffect(() => {
    if (typeof input !== "object") return;

    let accumulatedText = "";

    const processStream = async () => {
      for await (const chunk of readStreamableValue(input)) {
        if (typeof chunk === "string") {
          accumulatedText += chunk;
          setText(accumulatedText);
        }
      }
    };

    processStream();
  }, [input]);

  return text;
};
