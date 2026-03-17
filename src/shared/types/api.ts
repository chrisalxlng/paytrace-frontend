export type ErrorResponse<T = string> = {
  errorCode: T;
  message: string;
  timestamp: string;
};
