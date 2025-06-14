import { S3Client } from "@aws-sdk/client-s3";
import { logger } from "./logger";

const s3Config = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET ?? "",
  },
};
logger.debug(s3Config, "S3 Config");
export const s3Client = new S3Client(s3Config);
