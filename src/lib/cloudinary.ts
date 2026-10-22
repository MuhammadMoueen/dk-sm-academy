import "server-only";

import { v2 as cloudinary } from "cloudinary";

let configured = false;

export class CloudinaryConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryConfigurationError";
  }
}

export class CloudinaryUploadError extends Error {
  readonly providerStatus?: number;

  constructor(message: string, providerStatus?: number) {
    super(message);
    this.name = "CloudinaryUploadError";
    this.providerStatus = providerStatus;
  }
}

function configureCloudinary() {
  if (configured) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new CloudinaryConfigurationError(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  configured = true;
}

export async function uploadImage(
  buffer: Buffer,
  folder: string,
  publicId: string,
) {
  configureCloudinary();
  return new Promise<{ secureUrl: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `dk-sm-academy/${folder}`,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          const providerError = error as
            | { message?: string; http_code?: number }
            | undefined;
          reject(
            new CloudinaryUploadError(
              providerError?.message ?? "Cloudinary did not return an image URL.",
              providerError?.http_code,
            ),
          );
          return;
        }
        resolve({ secureUrl: result.secure_url });
      },
    );
    stream.end(buffer);
  });
}
