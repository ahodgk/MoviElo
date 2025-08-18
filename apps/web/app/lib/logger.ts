import pino from "pino";

const transport = import.meta.env.NODE_ENV === "development" ? {
    target:  "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  } : undefined
export const logger = pino({
  level: "trace",
  transport,
});

logger.info("Logger initialized");
