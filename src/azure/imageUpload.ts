import {
  BlobServiceClient,
  ContainerClient,
  BlockBlobClient,
  BlobHTTPHeaders,
} from "@azure/storage-blob";
import { v1 as uuidv1 } from "uuid";
import multer, { memoryStorage } from "multer";

let connectionString = "YourConnectionString";
let containerName = "image";

const setupAzureStorage = async (
  connectionString: String,
  containerName: String
) => {
  connectionString = connectionString;
  containerName = containerName;
};

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient: ContainerClient =
  blobServiceClient.getContainerClient(containerName);

async function uploadPDFBuffer(pdfBuffer: Uint8Array): Promise<string> {
  // Generate a unique filename using UUID
  const filename = `${uuidv1()}.pdf`;

  // Get a reference to the block blob client
  const blockBlobClient: BlockBlobClient =
    containerClient.getBlockBlobClient(filename);

  // Set the Content-Disposition header to "inline"
  const blobHTTPHeaders: BlobHTTPHeaders = {
    blobContentType: "application/pdf",
    blobContentDisposition: `inline; filename="${filename}"`,
  };

  // Upload the PDF buffer to the block blob with the specified headers
  await blockBlobClient.uploadData(pdfBuffer, { blobHTTPHeaders });

  // Get the URL of the uploaded PDF
  const pdfUrl: string = blockBlobClient.url;

  return pdfUrl;
}

async function uploadImage(file: Express.Multer.File): Promise<string> {
  const filename = `${uuidv1()}_${file.originalname}`;

  const blockBlobClient: BlockBlobClient =
    containerClient.getBlockBlobClient(filename);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  const imageUrl: string = blockBlobClient.url;

  return imageUrl;
}

async function uploadMultipleImages(
  files: Express.Multer.File[]
): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const filename = `${uuidv1()}_${file.originalname}`;
    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(filename);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    const imageUrl: string = blockBlobClient.url;
    return imageUrl;
  });

  return Promise.all(uploadPromises);
}

async function removeImagesFromUrls(imageUrls: string) {
  const imageUrlArray = imageUrls.split(",");

  for (const imageUrl of imageUrlArray) {
    const blobName = imageUrl.split("/").pop();
    const blobClient: BlockBlobClient = containerClient?.getBlockBlobClient(
      blobName!
    );

    try {
      const deleteResponse = await blobClient.deleteIfExists();
      if (deleteResponse.succeeded) {
        // console.log(`Blob ${blobName} deleted successfully`);
      } else {
        console.error(`Blob ${blobName} does not exist`);
      }
    } catch (error) {
      console.error(`Error deleting blob ${blobName}`, error);
    }
  }
}

const storage = memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Adjust the file size limit as needed
});

export {
  setupAzureStorage,
  uploadImage,
  upload,
  uploadMultipleImages,
  uploadPDFBuffer,
  removeImagesFromUrls,
};
