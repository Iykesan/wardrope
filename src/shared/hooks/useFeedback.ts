"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FeedbackMessage = {
  type: "success" | "error" | "info";
  message: string;
};

export const useFeedback = (duration = 2400) => {
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setFeedback(null);
  }, []);

  const show = useCallback(
    (next: FeedbackMessage) => {
      setFeedback(next);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setFeedback(null);
        timeoutRef.current = null;
      }, duration);
    },
    [duration],
  );

  useEffect(() => () => clear(), [clear]);

  return { feedback, show, clear };
};
