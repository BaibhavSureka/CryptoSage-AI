import { useCallback, useEffect, useRef, useState } from "react";

export const useAutoScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isElementVisible, setIsElementVisible] = useState(false);

  const scrollToBottom = useCallback(() => {
    containerRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (containerRef.current && isScrolledToBottom && !isElementVisible) {
      containerRef.current.scrollIntoView({ block: "end" });
    }
  }, [isScrolledToBottom, isElementVisible]);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;
      const buffer = 25;
      setIsScrolledToBottom(
        target.scrollTop + target.clientHeight >= target.scrollHeight - buffer
      );
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    if (!observerTargetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsElementVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -150px 0px" }
    );

    observer.observe(observerTargetRef.current);
    return () => observer.disconnect();
  }, []);

  return {
    containerRef,
    scrollContainerRef,
    observerTargetRef,
    scrollToBottom,
    isScrolledToBottom,
    isElementVisible,
  };
};
