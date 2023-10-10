"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
function compressImage(file, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { format } = options;
        let { qualityPercent, minFileSize, maxFileSize } = options;
        minFileSize = minFileSize !== null && minFileSize !== void 0 ? minFileSize : 512;
        maxFileSize = maxFileSize !== null && maxFileSize !== void 0 ? maxFileSize : file.size;
        qualityPercent = qualityPercent !== null && qualityPercent !== void 0 ? qualityPercent : 100;
        if (!maxFileSize && !qualityPercent)
            throw Error('qualityPercent must be a number between 0 and 100');
        if (qualityPercent)
            if (qualityPercent > 100 || qualityPercent < 0)
                throw Error('qualityPercent must be a number between 0 and 100');
        let blob = yield compression(file, format, qualityPercent);
        if (maxFileSize) {
            if (maxFileSize > file.size)
                throw Error(`maxFileSize (${maxFileSize}) must not be larger than the original file size (${file.size})`);
            while (blob.size > maxFileSize || blob.size < minFileSize) {
                if (blob.size > maxFileSize) {
                    qualityPercent = qualityPercent -= 10;
                    blob = yield compression(file, format, qualityPercent);
                }
                else if (blob.size > minFileSize) {
                    qualityPercent += 5;
                    blob = yield compression(file, format, qualityPercent);
                }
            }
        }
        return blob;
    });
}
exports.default = compressImage;
const compression = (file, format, qualityPercent) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const image = new Image();
        image.onload = () => {
            var _a;
            canvas.width = image.width;
            canvas.height = image.height;
            (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.drawImage(image, 0, 0);
            canvas.toBlob((blob) => {
                URL.revokeObjectURL(image.src);
                if (blob)
                    return resolve(blob);
                return reject(new Error('Failed to create blob'));
            }, format ? format : file.type, (qualityPercent !== null && qualityPercent !== void 0 ? qualityPercent : 100) / 100);
        };
        image.src = URL.createObjectURL(file);
    });
};
