interface CompressImageOptions {
	qualityPercent?: number
	maxFileSize?: number
	minFileSize?: number
	format?:
		| 'image/jpeg'
		| 'image/png'
		| 'image/webp'
		| 'image/gif'
		| 'image/bmp'
		| 'image/tiff'
		| 'image/svg+xml'
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
export default async function compressImage(
	file: File,
	options: CompressImageOptions
): Promise<Blob> {
	const { format } = options
	let { qualityPercent, minFileSize, maxFileSize } = options
	minFileSize = minFileSize ?? 512
	maxFileSize = maxFileSize ?? file.size
	qualityPercent = qualityPercent ?? 100
	if (!maxFileSize && !qualityPercent)
		throw Error('qualityPercent must be a number between 0 and 100')
	if (qualityPercent)
		if (qualityPercent > 100 || qualityPercent < 0)
			throw Error('qualityPercent must be a number between 0 and 100')
	let blob = await compression(file, format, qualityPercent)
	if (maxFileSize) {
		if (maxFileSize > file.size)
			throw Error(
				`maxFileSize (${maxFileSize}) must not be larger than the original file size (${file.size})`
			)
		while (blob.size > maxFileSize || blob.size < minFileSize) {
			if (blob.size > maxFileSize) {
				qualityPercent = qualityPercent -= 10
				blob = await compression(file, format, qualityPercent)
			} else if (blob.size > minFileSize) {
				qualityPercent += 5
				blob = await compression(file, format, qualityPercent)
			}
		}
	}
	return blob
}

const compression = (
	file: File,
	format?: string,
	qualityPercent?: number
): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas')
		const image = new Image()
		image.onload = () => {
			canvas.width = image.width
			canvas.height = image.height
			canvas.getContext('2d')?.drawImage(image, 0, 0)
			canvas.toBlob(
				(blob) => {
					URL.revokeObjectURL(image.src)
					if (blob) return resolve(blob)
					return reject(new Error('Failed to create blob'))
				},
				format ? format : file.type,
				(qualityPercent ?? 100) / 100
			)
		}
		image.src = URL.createObjectURL(file)
	})
}
