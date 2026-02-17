import { useEffect, useState } from "react";

export function useFlashReset(initial = false, delay = 500) {
  const [flash, setFlash] = useState(initial);

  useEffect(() => {
    if (!flash) return;

    const timer = setTimeout(() => {
      setFlash(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [flash, delay]);

  return [flash, setFlash];
}
