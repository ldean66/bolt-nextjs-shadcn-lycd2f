type LogLevel = 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

function emit(level: LogLevel, event: string, context: LogContext = {}) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...context,
  };

  const serialized = JSON.stringify(payload);

  if (level === 'error') {
    console.error(serialized);
    return;
  }

  if (level === 'warn') {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

export function logInfo(event: string, context?: LogContext) {
  emit('info', event, context);
}

export function logWarn(event: string, context?: LogContext) {
  emit('warn', event, context);
}

export function logError(event: string, context?: LogContext) {
  emit('error', event, context);
}
