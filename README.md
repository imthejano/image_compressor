# Compress image

Compresses an image file while allowing control over quality, file size, and format.

## Installation

```bash
npm install @imjano/compress_image
```

## Usage

### Parameters

-   `file` (File): The File object representing the image to compress.
-   `options` (CompressImageOptions): Configuration options for image compression.

    -   `qualityPercent` (number, optional): The compression quality as a percentage, with values between 0 and 100. Higher values result in better quality but larger file sizes. If not specified, it defaults to 100.

    -   `maxFileSize` (number, optional): The maximum allowed file size for the compressed image, in bytes. If the compressed image exceeds this size, it will be further compressed to meet this constraint. If not specified, it defaults to the original file size.

    -   `minFileSize` (number, optional): The minimum allowed file size for the compressed image, in bytes. If the compressed image falls below this size, it will be further compressed to meet this constraint. If not specified, it defaults to 512 bytes.

    -   `format` (string, optional): The desired image format for the compressed image. Supported formats include 'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', and 'image/svg+xml'. If not specified, the format is inferred from the original image file.

### Returns

-   A Promise that resolves to the compressed image as a Blob.

### Example

```javascript
// Compress an image with custom options
const imageFile = new File(['binaryImageData'], 'example.jpg', {
	type: 'image/jpeg',
})
const compressionOptions = {
	qualityPercent: 80, // Set compression quality to 80%
	maxFileSize: 1024 * 1024, // Limit the output file size to 1MB
	format: 'image/jpeg', // Convert to JPEG format
}
compressImage(imageFile, compressionOptions)
	.then((compressedBlob) => {
		// Handle the compressed image Blob
	})
	.catch((error) => {
		console.error('Compression error:', error)
	})
```
