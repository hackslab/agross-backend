import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FileUploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>(
      "CLOUDFLARE_R2_ACCOUNT_ID"
    );
    if (!accountId) {
      throw new Error("CLOUDFLARE_R2_ACCOUNT_ID is not set");
    }
    const bucketName = this.configService.get<string>(
      "CLOUDFLARE_R2_BUCKET_NAME"
    );
    const publicUrl = this.configService.get<string>(
      "CLOUDFLARE_R2_PUBLIC_URL"
    );
    if (!bucketName || !publicUrl) {
      throw new Error(
        "CLOUDFLARE_R2_BUCKET_NAME or CLOUDFLARE_R2_PUBLIC_URL is not set"
      );
    }
    this.bucketName = bucketName;
    this.publicUrl = publicUrl;

    const accessKeyId = this.configService.get<string>(
      "CLOUDFLARE_R2_ACCESS_KEY_ID"
    );
    const secretAccessKey = this.configService.get<string>(
      "CLOUDFLARE_R2_SECRET_ACCESS_KEY"
    );
    if (!accessKeyId || !secretAccessKey) {
      throw new Error("R2 credentials are not set");
    }

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${uuidv4()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${this.publicUrl}/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = fileUrl.replace(`${this.publicUrl}/`, "");
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}
