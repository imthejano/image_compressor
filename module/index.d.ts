interface CompressImageOptions {
    qualityPercent?: number;
    maxFileSize?: number;
    minFileSize?: number;
    format?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' | 'image/bmp' | 'image/tiff' | 'image/svg+xml';
}
/**
 * Compresses an image file while allowing control over quality, file size, and format.
 *
 * @param file - The File object representing the image to compress.
 * @param options - Configuration options for image compression.
 * @returns A Promise that resolves to the compressed image as a Blob.
 * @example
 * // Compress an image with custom options
 * const compressionOptions = {
 *   qualityPercent: 80,        // Set compression quality to 80%
 *   maxFileSize: 1024 * 1024,  // Limit the output file size to 1MB
 *   format: 'image/jpeg',      // Convert to JPEG format
 * };
 * compressImage(imageFile, compressionOptions)
 *   .then((compressedBlob) => {
 *     // Handle the compressed image Blob
 *   })
 *   .catch((error) => {
 *     console.error('Compression error:', error);
 *   });
 */
export default function compressImage(file: File, options: CompressImageOptions): Promise<Blob>;
export {};
