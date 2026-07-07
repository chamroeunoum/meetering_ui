/**
 * File Plugin — File type detection and upload size utilities
 *
 * Provides helper functions for:
 *   - Detecting file types (image, video) by extension
 *   - Storing and retrieving the server-configured max upload size
 *
 * All functions handle corrupted localStorage gracefully via try/catch.
 *
 * @module plugins/file
 */

/**
 * Extract the file extension from a filename.
 *
 * @param {string} filename - e.g. "document.pdf", "photo.jpg"
 * @returns {string} Lowercase extension without the dot, e.g. "pdf"
 */
export function getExtension(filename) {
  const parts = filename.split('.')
  return parts[parts.length - 1].toLowerCase()
}

/**
 * Check if a filename has an image extension.
 *
 * Supported formats: jpg, gif, bmp, png
 *
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the file appears to be an image
 */
export function isImage(filename) {
  const ext = getExtension(filename)
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'png':
      return true
    default:
      return false
  }
}

/**
 * Check if a filename has a video extension.
 *
 * Supported formats: m4v, avi, mpg, mp4
 *
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the file appears to be a video
 */
export function isVideo(filename) {
  const ext = getExtension(filename)
  switch (ext) {
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      return true
    default:
      return false
  }
}

/**
 * Store the maximum upload file size (in MB) from the server.
 * The server sends this value on login as upload_max_filesize (e.g., "50M").
 *
 * @param {number} sizeInMB - Max upload size in megabytes
 */
export function setMaxUploadFilesize(sizeInMB) {
  try {
    localStorage.setItem('max_upload_filesize', JSON.stringify(sizeInMB))
  } catch (error) {
    console.error('[file plugin] Failed to store max upload size:', error)
  }
}

/**
 * Retrieve the stored maximum upload file size.
 *
 * @returns {number} Max upload size in MB, or 0 if not set or corrupted
 */
export function getMaxUploadFilesize() {
  try {
    const raw = localStorage.getItem('max_upload_filesize')
    return raw ? parseFloat(JSON.parse(raw)) : 0
  } catch (error) {
    console.error('[file plugin] Failed to read max upload size:', error)
    return 0
  }
}
