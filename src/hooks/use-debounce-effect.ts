import { useEffect } from "react";

export function useDebounceEffect(
  callback: () => void,
  dependencies: any[],
  delay: number = 1000,
) {
  useEffect(() => {
    const timeoutId = setTimeout(callback, delay);
    return () => clearTimeout(timeoutId);
  }, [...dependencies, delay]);
}

export function useAccountNameFetcher(
  fetchFunction: (accountId: string, code: string) => Promise<void>,
  accountId: string,
  code: string,
  minLength: number = 10,
  delay: number = 1000,
) {
  useDebounceEffect(
    () => {
      if (accountId && code && accountId.length >= minLength) {
        fetchFunction(accountId, code);
      }
    },
    [accountId, code],
    delay,
  );
}
