import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fileUploadLogs } from "@repo/database";
import { createServerFn } from "@tanstack/react-start";

import { z } from "zod";
import { getSupabaseServerClient } from "~/utils/supabase";
import { db } from "../db";
import { logger } from "../logger";
import { protectMiddleware } from "../middleware/auth";
import { s3Client } from "../S3";

let inc = 0;
async function createFilePut(
  _filename: string,
  userId: string,
  bucketName: string,
) {
  logger.info("Creating signed URL");

  const supabase = getSupabaseServerClient();
  const file_segments = _filename.split("/");
  if (file_segments.length > 1) {
    _filename = file_segments[file_segments.length - 1];
  }

  var filename = `${file_segments.slice(0, file_segments.length - 1).join("/")}${Math.random().toString(36).substring(2, 10)}${inc++}-${_filename}`;
  const r = await supabase.storage
    .from(bucketName)
    .createSignedUploadUrl(filename);

  logger.info(`Signed URL: ${r.data?.signedUrl}`);

  // await db.insert(fileUploadLogs).values({
  //   userId,
  //   fileName: filename,
  //   s3id: r.data?.path,
  // });

  return {
    data: r.data,
    filename,
    error: r.error,
    publicUrl: supabase.storage.from(bucketName).getPublicUrl(filename).data
      .publicUrl,
  };
}

export const requestS3PutUrlFn = createServerFn({ method: "POST" })
  .middleware([protectMiddleware])
  .validator(
    z.object({
      name: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    const r = await createFilePut(
      // s3Client,
      data.name,
      context.user.id,
      "article-images",
    );

    if (r.error) {
      logger.error(r.error);
      throw new Error("Error creating signed URL");
    }

    return {
      signedUrl: r?.data?.signedUrl,
      path: r.data?.path,
      filename: r.filename,
      publicUrl: r.publicUrl,
    };
  });

export async function createFilePutS3(
  client: S3Client,
  name: string,
  userId: string,
  bucketName: string,
) {
  logger.info("Creating signed URL");

  // const client = request.server.s3;
  var filename = `${name}-${Math.random().toString(36).substring(2, 10)}${inc++}`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    ContentType: "image/jpeg, image/png, image/gif, image/jpg,  image/svg",
  });
  logger.info("Command created");
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  logger.info(`Signed URL: ${await signedUrl}`);

  return { data: { signedUrl }, filename, error: null };
}
