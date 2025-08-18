import pino from "pino";

const transport = import.meta.env.NODE_ENV === "development" ? {
    target:  "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  } : undefined

const formatters = {
  level (label, number) {
    return { level: label }
  }
}

export const logger = pino({
  level: "trace",
  transport,
  formatters,
});

logger.info("Logger initialized");
