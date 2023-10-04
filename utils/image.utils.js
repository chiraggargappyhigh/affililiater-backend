const {
  ENHANCE_MODEL_2K_URL,
  ENHANCE_MODEL_4K_URL,
  TEXT_ART_URL,
} = require('../constants/photo.constant');
const { uploadImageToBlob } = require('../services/blob.service');
const axios = require('axios');
const sharp = require('sharp');
const detectMimeType = (base64Buffer) => {
  return base64Buffer.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
};
const { createCanvas, loadImage, registerFont } = require('canvas');
const normalizeBase64 = (base64Image, isBufer = true) => {
  const normalizedImagebase64 = base64Image.replace(
    /^data:image\/\w+;base64,/,
    ''
  );
  if (isBufer) {
    return Buffer.from(normalizedImagebase64, 'base64');
  }

  return normalizedImagebase64;
};
const path = require('path');
const base64 = require('base64-js');
const gfpEnhancev2 = async (imageb64) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      instances: [{ image: { b64: imageb64, resolution: '2k' } }],
    };
    const response = await axios.post(ENHANCE_MODEL_2K_URL, data, { headers });
    return response;
  } catch (error) {
    console.log('Error in gfpEnhancev2', error?.message);
    throw error;
  }
};

const convertToB64 = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64Str = Buffer.from(response.data, 'binary').toString('base64');
    return base64Str;
  } catch (error) {
    console.log('Error converting image to base64:', error);
    throw new Error('Error converting image to base64: ' + error.message);
  }
};

const generateRandomString = (length) => {
  let randomString = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
};

const is_multiple_faces = (p1, p2) => {
  // Prediction logic here
  return false;
};

const call2k = async (imageStr, uploadDate, fileName2k, toolName) => {
  console.log('STARTED 2K API CALL');
  try {
    let startTime2k = Date.now();
    image2kResponse = await gfpEnhancev2(imageStr);
    const image2k = image2kResponse.data.image;
    let image2kEncoded = Buffer.from(image2k, 'base64');
    let url2kStatus = 200;

    // if (isMultipleFaces(imageStr, image2k)) {          // Commenting as Always returning false
    //     randomFaceFlag2k = true;
    //     image2kResponse = await gfpEnhancev2(imageStr);
    //     image2kEncoded = Buffer.from(image2kResponse.data.image, 'base64');
    // }
    startTime2k = ((Date.now() - startTime2k) / (1000 * 60)).toFixed(2);
    console.log('ended time at 2k', startTime2k * 60);

    const key = `${toolName}/output_image/${uploadDate}/${fileName2k}`;
    const contentType = 'image/webp';
    await uploadImageToBlob(key, image2kEncoded, 'base64', contentType);
    console.log('ENDED 2K API CALL');
    return { url2kStatus };
  } catch (error) {
    console.log(error);
    error = new Error(error?.message);
    error.statusCode = 405;
    throw error;
  }
};

const call4k = async (imageStr, uploadDate, fileName4k, toolName) => {
  console.log('STARTED 4K API CALL');
  try {
    let startTime4k = Date.now();
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      instances: [{ image: { b64: imageStr, resolution: '4k' } }],
    };
    const response = await axios.post(ENHANCE_MODEL_4K_URL, data, { headers });
    const image4k = response.data.image;
    let image4kEncoded = Buffer.from(image4k, 'base64');
    let url4kStatus = 200;

    // if (isMultipleFaces(imageStr, image4k)) {                 // Commenting as Always returning false
    //     randomFaceFlag4k = true;
    //     const response2 = await axios.post(url, data, { headers });
    //     image4kResponse = response2.data;
    //     image4kEncoded = Buffer.from(image4kResponse.image, 'base64');
    // }

    startTime4k = ((Date.now() - startTime4k) / (1000 * 60)).toFixed(2);

    console.log('ended time at 4k', startTime4k * 60);

    const key = `${toolName}/output_image/${uploadDate}/${fileName4k}`;
    const contentType = 'image/webp';
    await uploadImageToBlob(key, image4kEncoded, 'base64', contentType);

    return { url4kStatus };
  } catch (error) {
    console.log(error);
    error = new Error(error?.message);
    error.statusCode = 405;
    throw error;
  }
};

const resizeImage = async (imageStr, resolution) => {
  const imageBuffer = Buffer.from(imageStr, 'base64');
  let resizeOptions;

  if (resolution === '2k') {
    resizeOptions = { width: 1440, height: 1440 };
  } else if (resolution === '4k') {
    resizeOptions = { width: 2840, height: 2840 };
  }

  return sharp(imageBuffer)
    .resize(resizeOptions)
    .toBuffer()
    .then((outputBuffer) => outputBuffer.toString('base64'));
};

const callModelApi = async (imageStr) => {
  let inferenceTime = Date.now();
  try {
    // const url = 'http://colorizer-model-predictor-default.kservecolorizer.apyhi.com/v1/models/colorizer-model:predict';
    // const url = 'http://colorizer-model-predictor-default.credit-colorizer.apyhi.com/v1/models/colorizer-model:predict';
    const url = 'http://164.52.218.54:8006/v1/models/colorizer-model:predict';

    const headers = {
      'Content-Type': 'application/json',
      Authorization:
        'Basic MWQ4NTMzZDQ4MmMzNjU0Y2IzNzQzOTNiZWUwNjgzOGU6YTI4NDRkZWUzM2FlZGZiYWJjY2QzNGQ5ZDg3ODEzYzA=',
    };
    const body = {
      instances: [
        {
          image: {
            b64: imageStr,
          },
        },
      ],
    };
    const response = await axios.post(url, body, {
      headers,
    });
    const { image: outputStr } = response.data;
    const modelStatusCode = 200;
    inferenceTime = ((Date.now() - inferenceTime) / 6000).toFixed(2);
    console.log('End Time callModelApi', inferenceTime * 60);
    return { outputStr, modelStatusCode, inferenceTime };
  } catch (error) {
    console.log(error);
    const modelStatusCode = 500;
    return { outputStr: null, modelStatusCode, inferenceTime: 0 };
  }
};

const call_light_fix_2k = async (imageStr) => {
  let random_face_flag = false;
  console.log('STARTED 2K API CALL');
  try {
    let start_time_2k = Date.now();
    let image_2k = await gfpEnhancev2(imageStr);
    if (is_multiple_faces(imageStr, image_2k)) {
      random_face_flag = true;
      image_2k = await gfpEnhancev2(imageStr);
    }
    start_time_2k = ((Date.now() - start_time_2k) / 60000).toFixed(2);
    url_2k_status = 200;

    console.log(`ENDED 2K API CALL with time:${start_time_2k}`);
    return [url_2k_status, image_2k, random_face_flag];
  } catch (error) {
    console.log(error);
    url_2k_status = 405;
    error = new Error(error?.message);
    error.statusCode = 405;
    throw error;
  }
};

const call_light_fix_4k = async (imageStr) => {
  let random_face_flag = false;
  console.log('STARTED 4K API CALL');
  try {
    const url = ENHANCE_MODEL_4K_URL;
    const headers = { 'Content-Type': 'application/json' };
    const data = {
      instances: [{ image: { b64: imageStr, resolution: '4k' } }],
    };
    let start_time_4k = Date.now();
    let response = await axios.post(url, data, { headers });
    let image_4k = response.data.image;

    if (is_multiple_faces(imageStr, image_4k)) {
      random_face_flag = true;
      response = await axios.post(url, data, { headers });
      image_4k = response.data.image;
    }

    start_time_4k = ((Date.now() - start_time_4k) / 60000).toFixed(2);
    url_4k_status = 200;
    console.log(`ENDED 4K API CALL with time:${start_time_4k}`);
    return [url_4k_status, image_4k, random_face_flag];
  } catch (error) {
    console.log(error);
    url_4k_status = 405;
    error = new Error(error?.message);
    error.statusCode = 405;
    throw error;
  }
};

const create_image_with_text = async (text, font) => {
  console.log('STARTED CREATE ART CALL');
  try {
    const fontPath = `${__dirname}/text_art_font/${font}.ttf`;

    // Register the font
    registerFont(fontPath, { family: 'YourFontFamily' });
    const font_size = 200;
    const text_color = [255, 255, 255]; // White text color
    const background_color = [0, 0, 0]; // Black background
    const outline_color = [0, 0, 0]; // Black outline color

    // Load the font and create a canvas
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext('2d');
    ctx.font = `${font_size}px YourFontFamily`;

    const textMetrics = ctx.measureText(text);
    const text_width = textMetrics.width;
    const text_height =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;

    const image_width = text_width + 20;
    const image_height = text_height + 20;

    const canvas2 = createCanvas(image_width, image_height);
    const ctx2 = canvas2.getContext('2d');

    // Set background color
    ctx2.fillStyle = `rgb(${background_color[0]}, ${background_color[1]}, ${background_color[2]})`;
    ctx2.fillRect(0, 0, image_width, image_height);

    // Set text color
    ctx2.fillStyle = `rgb(${text_color[0]}, ${text_color[1]}, ${text_color[2]})`;

    // Draw text
    const text_x = (image_width - text_width) / 2;
    const text_y =
      (image_height - text_height) / 2 + textMetrics.actualBoundingBoxAscent;

    ctx2.font = `${font_size}px ${font}`;
    ctx2.fillText(text, text_x, text_y);

    // Convert to PNG buffer
    const pngBuffer = await sharp(canvas2.toBuffer())
      .toFormat('png')
      .toBuffer();

    // Resize the image to 1024x256
    const resizedImageBuffer = await sharp(pngBuffer)
      .resize(1024, 256)
      .toBuffer();

    // Invert the image colors
    for (let i = 0; i < resizedImageBuffer.length; i++) {
      resizedImageBuffer[i] = 255 - resizedImageBuffer[i];
    }

    // Convert to base64
    return base64.fromByteArray(resizedImageBuffer);
  } catch (error) {
    console.log(error);
    error = new Error(error?.message);
    error.statusCode = 500;
    throw error;
  }
};

const img2img = async (image, prompt) => {
  console.log('STARTED IMAGE PROCESSING CALL');
  try {
    const imageBase64 = await convertToB64(image);
    const mask = imageBase64;

    const imageMetadata = await sharp(image).metadata();
    const { width, height } = imageMetadata;

    const payload = {
      prompt,
      negative_prompt:
        '(low quality, worst quality:1.4), (bad anatomy), (inaccurate limb:1.2), bad composition, inaccurate eyes, extra digit, fewer digits, (extra arms:1.2)',
      init_images: [imageBase64],
      mask,
      width,
      height,
      denoising_strength: 0.9,
      tiling: false,
      sampler_name: 'DDIM',
      cfg_scale: 9,
      batch_size: 1,
      resize_mode: 0,
      inpaint_full_res: 1,
      seed: -1,
      inpainting_mask_invert: 1,
      inpainting_fill: 2,
      steps: 25,
      mask_blur: 6,
      inpaint_full_res_padding: 32,
    };

    const response = await axios.post(TEXT_ART_URL, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    error = new Error(error?.message);
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  detectMimeType,
  normalizeBase64,
  call2k,
  call4k,
  resizeImage,
  convertToB64,
  callModelApi,
  generateRandomString,
  call_light_fix_2k,
  call_light_fix_4k,
  img2img,
  create_image_with_text,
};
