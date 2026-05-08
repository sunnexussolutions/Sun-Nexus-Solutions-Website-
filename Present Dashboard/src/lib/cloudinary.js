/**
 * SENIOR DEV TIP: 
 * We use 'Unsigned Uploads' for frontend-only apps. 
 * This allows users to upload assets directly to Cloudinary 
 * without needing a secret backend key.
 */

export const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = 'nexus_uploads'; // You must create this in Cloudinary settings

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url; // This is the permanent link to the image
  } catch (error) {
    console.error('CLOUDINARY_ERROR:', error);
    return null;
  }
};
