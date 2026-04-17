import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: config.get('CLOUDINARY_API_KEY'),
      api_secret: config.get('CLOUDINARY_API_SECRET'),
    });
  }

  uploadBuffer(
    buffer: Buffer,
    originalName: string,
  ): Promise<{ url: string; publicId: string; filename: string }> {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${originalName.replace(/\s+/g, '_')}`;

      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'healio/medical-reports',
          public_id: filename,
          resource_type: 'auto',
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Upload failed'));
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            filename,
          });
        },
      );

      Readable.from(buffer).pipe(upload);
    });
  }
}
