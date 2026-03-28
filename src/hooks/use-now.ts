import { useEffect, useReducer } from "react";

export function useNow() {
  const [now, setNow] = useReducer(() => Date.now(), Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return now;
}
