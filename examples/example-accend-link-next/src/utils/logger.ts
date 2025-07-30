// Mock logger for Next.js example
// In a real application, replace this with your actual logging implementation

export enum LogType {
  ACCEND_LINK = "ACCEND_LINK",
}

export function logError(
  type: LogType,
  error: Error,
  context?: { context?: unknown; [key: string]: unknown }
) {
  console.error(`[${type}]`, error.message, context);
}
