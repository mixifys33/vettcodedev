import api from './api'

/**
 * Upload an image file to ImageKit via backend
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in ImageKit (e.g., 'applications/icons')
 * @returns {Promise<Object>} - Upload result with url, fileId, etc.
 */
export const uploadToImageKit = async (file, folder = 'applications') => {
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file)
    
    // Send to backend for ImageKit upload using existing endpoint
    const response = await api.post('/imagekit/upload', {
      file: base64,
      fileName: file.name,
      folder: folder,
    })
    
    if (response.data.success) {
      return {
        url: response.data.url,
        fileId: response.data.fileId,
        thumbnailUrl: response.data.thumbnailUrl,
        fileName: response.data.name,
      }
    } else {
      throw new Error(response.data.message || 'Upload failed')
    }
  } catch (error) {
    console.error('ImageKit upload error:', error)
    throw error
  }
}

/**
 * Upload multiple images to ImageKit
 * @param {File[]} files - Array of image files
 * @param {string} folder - The folder path in ImageKit
 * @returns {Promise<Object[]>} - Array of upload results
 */
export const uploadMultipleToImageKit = async (files, folder = 'applications') => {
  const uploadPromises = files.map(file => uploadToImageKit(file, folder))
  return Promise.all(uploadPromises)
}

/**
 * Convert File to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
