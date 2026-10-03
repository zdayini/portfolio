import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class R2Service {
    private client: S3Client;
    private bucket: string;
    private publicUrl: string;

    constructor(private config: ConfigService) {
        this.bucket = this.config.get('R2_BUCKET_NAME')!;
        this.publicUrl = this.config.get('R2_PUBLIC_URL')!;
        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${this.config.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: this.config.get('R2_ACCESS_KEY_ID')!,
                secretAccessKey: this.config.get('R2_SECRET_ACCESS_KEY')!,
            },
        });
    }

    async upload(file: Express.Multer.File) {
        const key = `${randomUUID()}-${file.originalname}`;
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );
        return { key, url: `${this.publicUrl}/${key}` };
    }

    async delete(key: string) {
        await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }
}