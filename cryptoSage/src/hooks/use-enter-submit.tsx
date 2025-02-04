import { useRef, type RefObject } from "react";

export function useSubmitOnEnter(): {
  formElement: RefObject<HTMLFormElement>;
  handleKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
} {
  const formElement = useRef<HTMLFormElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isEnterKey = event.key === "Enter";
    const isShiftPressed = event.shiftKey;
    const isComposing = event.nativeEvent.isComposing;

    if (isEnterKey && !isShiftPressed && !isComposing) {
      formElement.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return { formElement, handleKeyPress };
}
