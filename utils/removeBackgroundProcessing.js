const axios = require('axios');
const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs');

// Function to remove the background from the image and return the base64 string
async function removeBackgroundProcessing(srcImageUrl, maskImageUrl) {
  try {
    // Download the source and mask images
    const [srcImageResponse, maskImageResponse] = await Promise.all([
      axios.get(srcImageUrl, { responseType: 'arraybuffer' }),
      axios.get(maskImageUrl, { responseType: 'arraybuffer' })
    ]);

    // Convert the WebP images to PNG using sharp
    const srcImage = await sharp(srcImageResponse.data).toFormat('png').toBuffer();
    const maskImage = await sharp(maskImageResponse.data).toFormat('png').toBuffer();

    // Load the images using Jimp
    const srcJimpImage = await Jimp.read(srcImage);
    const maskJimpImage = await Jimp.read(maskImage);

    // Resize the mask image to match the source image dimensions
    maskJimpImage.resize(srcJimpImage.bitmap.width, srcJimpImage.bitmap.height);

    // Iterate through each pixel of the images
    srcJimpImage.scan(0, 0, srcJimpImage.bitmap.width, srcJimpImage.bitmap.height, (x, y, idx) => {
      const maskPixel = Jimp.intToRGBA(maskJimpImage.getPixelColor(x, y));

      // Calculate the grayscale intensity of the mask pixel
      const maskIntensity = 0.299 * maskPixel.r + 0.587 * maskPixel.g + 0.114 * maskPixel.b;

      // Apply the mask intensity to the alpha channel of the source image
      srcJimpImage.bitmap.data[idx + 3] = maskIntensity;
    });
    // Convert the resulting Jimp image to a buffer
    const resultBuffer = await srcJimpImage.getBufferAsync(Jimp.MIME_PNG);

    // Convert the buffer to a base64-encoded string
    const resultBase64 = resultBuffer.toString('base64');

    return resultBase64;
  } catch (error) {
    console.error('Error removing background:', error);
    return null;
  }
}
  module.exports = {removeBackgroundProcessing}