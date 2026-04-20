import imageCompression from "browser-image-compression";
import { uploadAPI } from "./api";

/**
 * Compresses an image file
 * @param {File} file - The image file to compress
 * @returns {Promise<File>} - Compressed file
 */
export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Compression Error:", error);
    return file; // Fallback to original
  }
};

/**
 * Compresses (if image) and uploads a file to Cloudinary via backend proxy
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Upload result
 */
export const uploadToCloudinary = async (file, onProgress) => {
  let fileToUpload = file;
  
  if (file.type.startsWith("image/")) {
    fileToUpload = await compressImage(file);
  }

  const formData = new FormData();
  formData.append("file", fileToUpload);

  const res = await uploadAPI.uploadFile(formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });
  return res.data?.data;
};