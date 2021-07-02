import { createLogger, transports, format } from 'winston';

import type { Logger } from 'winston';
import type { Env } from 'backend-api/env';

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  none: 5
} as const;

export type WinstonLogLevel = keyof typeof levels;

export type WinstonLog = (
  message: string,
  meta?: Record<string, unknown>
) => void;

export type WinstonLogs = Record<Exclude<WinstonLogLevel, 'none'>, WinstonLog>;

type CreateWinstonLogs = (logger: Logger) => WinstonLogs;

const createWinstonLogs: CreateWinstonLogs = (logger) => {
  const logs: Partial<WinstonLogs> = {};

  for (const key in levels) {
    const level = key as WinstonLogLevel;
    if (level !== 'none') {
      logs[level] = (message, meta) => logger.log(level, message, meta);
    }
  }

  return logs as WinstonLogs;
};

export type WinstonLogger = WinstonLogs & {
  end: () => Promise<void>;
};

export interface CreateWinstonLoggerParams {
  env: Env['winston'];
}

export type CreateWinstonLogger = (
  params: CreateWinstonLoggerParams
) => WinstonLogger;

export const createWinstonLogger: CreateWinstonLogger = ({ env }) => {
  const logger = createLogger({
    level: env.logger.level,
    levels,
    transports: [
      new transports.Console({ silent: env.logger.level === 'none' })
    ],
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message, ...meta }) => {
        const fields: string[] = [];

        fields.push(timestamp as string);
        fields.push(level);
        fields.push(message);

        if (
          typeof meta === 'object' &&
          meta !== null &&
          Object.keys(meta).length > 0
        ) {
          fields.push(
            JSON.stringify(meta, (key, value) => {
              if (key === 'error' && value instanceof Error) {
                return { message: value.message, stack: value.stack };
              }

              return value;
            })
          );
        }

        return fields.join(' | ');
      })
    )
  });

  const winston: WinstonLogger = {
    ...createWinstonLogs(logger),
    end: async () =>
      await new Promise((resolve) => {
        logger.on('finish', () => resolve());
        logger.end();
      })
  };

  return winston;
};
