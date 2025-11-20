/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_PATH } from "./apiPaths";
import axiosInstance from "./axiosInstance";

/**
 * Uploads an image file to the server
 * @param {File} file - The image file from an <input type="file">
 * @returns {Promise<Object>} The server response
 */
export const uploadImage = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("profile_image", file);

    const response = await axiosInstance.post(API_PATH.IMAGE.UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};
