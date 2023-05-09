import { ApiPost } from "./request";

export const classifyText = (text, callback) => {
  ApiPost('/classify/text', { text }, callback, () => {
    console.error('api/calliope: Could not classify cookie banner text');
  });
};

export const classifyImage = (imageData, callback) => {
  ApiPost('/classify/image', { image_data: imageData }, callback, () => {
    console.error('api/janus: Could not classify cookie banner screenshot');
  });
};
