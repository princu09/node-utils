"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImagesFromUrls = exports.uploadPDFBuffer = exports.uploadMultipleImages = exports.upload = exports.uploadImage = exports.setupAzureStorage = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const uuid_1 = require("uuid");
const multer_1 = __importStar(require("multer"));
let blobServiceClient;
let containerClient;
const setupAzureStorage = (connectionString, containerName) => {
    try {
        blobServiceClient =
            storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        containerClient = blobServiceClient.getContainerClient(containerName);
    }
    catch (error) {
        console.error("Error setting up Azure Storage:", error);
        throw error; // Rethrow the error to indicate the problem
    }
};
exports.setupAzureStorage = setupAzureStorage;
async function uploadPDFBuffer(pdfBuffer) {
    // Generate a unique filename using UUID
    const filename = `${(0, uuid_1.v1)()}.pdf`;
    // Get a reference to the block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    // Set the Content-Disposition header to "inline"
    const blobHTTPHeaders = {
        blobContentType: "application/pdf",
        blobContentDisposition: `inline; filename="${filename}"`,
    };
    // Upload the PDF buffer to the block blob with the specified headers
    await blockBlobClient.uploadData(pdfBuffer, { blobHTTPHeaders });
    // Get the URL of the uploaded PDF
    const pdfUrl = blockBlobClient.url;
    return pdfUrl;
}
exports.uploadPDFBuffer = uploadPDFBuffer;
async function uploadImage(file) {
    const filename = `${(0, uuid_1.v1)()}_${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
    });
    const imageUrl = blockBlobClient.url;
    return imageUrl;
}
exports.uploadImage = uploadImage;
async function uploadMultipleImages(files) {
    const uploadPromises = files.map(async (file) => {
        const filename = `${(0, uuid_1.v1)()}_${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(filename);
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });
        const imageUrl = blockBlobClient.url;
        return imageUrl;
    });
    return Promise.all(uploadPromises);
}
exports.uploadMultipleImages = uploadMultipleImages;
async function removeImagesFromUrls(imageUrls) {
    const imageUrlArray = imageUrls.split(",");
    for (const imageUrl of imageUrlArray) {
        const blobName = imageUrl.split("/").pop();
        const blobClient = containerClient.getBlockBlobClient(blobName);
        try {
            const deleteResponse = await blobClient.deleteIfExists();
            if (deleteResponse.succeeded) {
                // console.log(`Blob ${blobName} deleted successfully`);
            }
            else {
                console.error(`Blob ${blobName} does not exist`);
            }
        }
        catch (error) {
            console.error(`Error deleting blob ${blobName}`, error);
        }
    }
}
exports.removeImagesFromUrls = removeImagesFromUrls;
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Adjust the file size limit as needed
});
exports.upload = upload;
