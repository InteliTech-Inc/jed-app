export interface JedError extends Error {
  status: string;
  data: unknown | null;
  error: {
    code: string;
    message: string;
  };
}
