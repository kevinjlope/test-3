import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = process.env.UPLOADS_PATH || path.join(process.cwd(), 'public', 'uploads');
const FULL_DIR = path.join(UPLOADS_DIR, 'full');
const THUMB_DIR = path.join(UPLOADS_DIR, 'thumb');

export const ImageService = {
  /**
   * Process an uploaded image: resize, generate thumbnail, and save to disk.
   */
  async processImage(file: File): Promise<{ url: string; thumbUrl: string }> {
    // Ensure directories exist
    await fs.mkdir(FULL_DIR, { recursive: true });
    await fs.mkdir(THUMB_DIR, { recursive: true });

    const id = uuidv4();
    const filename = `${id}.webp`;
    
    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Process Main Image (max 1200px width, convert to webp)
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(FULL_DIR, filename));

    // 2. Process Thumbnail (400x400 square, convert to webp)
    await sharp(buffer)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(path.join(THUMB_DIR, filename));

    return {
      url: `/uploads/full/${filename}`,
      thumbUrl: `/uploads/thumb/${filename}`
    };
  },

  /**
   * Utility to delete images from disk if needed.
   */
  async deleteImage(url: string, thumbUrl?: string | null) {
    try {
      if (url.startsWith('/uploads/')) {
        await fs.unlink(path.join(process.cwd(), 'public', url)).catch(() => {});
      }
      if (thumbUrl?.startsWith('/uploads/')) {
        await fs.unlink(path.join(process.cwd(), 'public', thumbUrl)).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to delete image files:', e);
    }
  }
};
