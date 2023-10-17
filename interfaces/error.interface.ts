interface AppError {
  status: number;
  userTitle: string;
  userMessage: string;
  developerMessage: string;
  errorCode: string;
  stack?: string;
}

export { AppError };
