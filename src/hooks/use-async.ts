import { useCallback, useEffect, useRef, useState } from "react";

interface AsyncState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
}

export function useAsync<T>(fetcher: () => Promise<T>, options: { pollInterval?: number } = {}) {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, error: undefined, loading: true });
  const requestId = useRef(0);

  const load = useCallback(
    async (silent = false) => {
      const id = ++requestId.current;
      if (!silent) setState((prev) => ({ ...prev, loading: true, error: undefined }));
      try {
        const data = await fetcher();
        if (id === requestId.current) setState({ data, error: undefined, loading: false });
      } catch (error) {
        if (id === requestId.current) setState((prev) => ({ ...prev, error, loading: false }));
      }
    },
    [fetcher],
  );

  useEffect(() => {
    const counter = requestId;
    load();
    return () => {
      counter.current++;
    };
  }, [load]);

  const { pollInterval } = options;
  useEffect(() => {
    if (!pollInterval) return;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") load(true);
    }, pollInterval);
    const onStorage = () => load(true);
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [load, pollInterval]);

  const setData = useCallback((updater: (current: T | undefined) => T | undefined) => {
    setState((prev) => ({ ...prev, data: updater(prev.data) }));
  }, []);

  return { ...state, setData, reload: load };
}
