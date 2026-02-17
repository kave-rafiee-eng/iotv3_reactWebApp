import { useEffect, useRef } from "react";

export function useAutoUpdate({
  ProcessRead,
  StopFn,
  interval = 500,
  max = 8,
}) {
  const counterRef = useRef(0);

  useEffect(() => {
    if (!ProcessRead || !StopFn) return;

    ProcessRead();

    const timer = setInterval(() => {
      if (StopFn()) {
        counterRef.current = 0;
        return;
      }

      counterRef.current++;

      if (counterRef.current >= max) {
        counterRef.current = 0;
        ProcessRead();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval, max]);
}
