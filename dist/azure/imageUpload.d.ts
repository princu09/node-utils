import multer from "multer";
declare const setupAzureStorage: (connectionString: String, containerName: String) => Promise<void>;
declare function uploadPDFBuffer(pdfBuffer: Uint8Array): Promise<string>;
declare function uploadImage(file: Express.Multer.File): Promise<string>;
declare function uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]>;
declare function removeImagesFromUrls(imageUrls: string): Promise<void>;
declare const upload: multer.Multer;
export { setupAzureStorage, uploadImage, upload, uploadMultipleImages, uploadPDFBuffer, removeImagesFromUrls, };
