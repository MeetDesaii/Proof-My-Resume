import AWS from "aws-sdk";
import { config } from "../config";

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION,
});

export async function uploadToS3(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const key = `resumes/${Date.now()}-${filename.replace(/\s+/g, "-")}`;

  const params = {
    Bucket: config.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ServerSideEncryption: "AES256",
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file");
  }
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  const key = fileUrl.split(".com/")[1];

  const params = {
    Bucket: config.AWS_S3_BUCKET,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error("S3 delete error:", error);
    throw new Error("Failed to delete file");
  }
}

export async function getSignedUrl(
  key: string,
  expires = 3600
): Promise<string> {
  const params = {
    Bucket: config.AWS_S3_BUCKET,
    Key: key,
    Expires: expires,
  };

  return s3.getSignedUrl("getObject", params);
}
