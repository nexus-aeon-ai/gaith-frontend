import { fetchInstance } from "../clients";

export interface StorageS3Response {
  url: string;
  key: string;
}

export interface MultiUploadResponse {
  images: StorageS3Response[];
}

const uploadSingleEndpoint = "/storage/upload/image";
const uploadMultiEndpoint = "/storage/upload/images";

export const uploadImage = async (
  file: File,
): Promise<{ status: number; data: StorageS3Response | null }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetchInstance<StorageS3Response>(uploadSingleEndpoint, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if ((response.status !== 200 && response.status !== 201) || !response.data) {
    throw new Error("Failed to upload image");
  } else {
    console.log("Image upload Response data:", response.data);
  }

  return { status: response.status, data: response.data };
};
export const uploadMultiImages = async (
  files: File[],
): Promise<{ status: number; data: StorageS3Response[] | null }> => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  const response = await fetchInstance<MultiUploadResponse>(uploadMultiEndpoint, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if ((response.status !== 200 && response.status !== 201) || !response.data) {
    throw new Error("Failed to upload images");
  } else {
    console.log("Images upload Response data:", response.data);
  }

  // Extract the images array from the response
  return { status: response.status, data: response.data.images };
};
