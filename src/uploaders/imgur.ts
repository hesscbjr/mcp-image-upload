import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

export class ImgurUploader {
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async upload(filepath: string): Promise<string> {
    try {
      // Read file as base64
      const imageBuffer = await fs.readFile(filepath);
      const base64Image = imageBuffer.toString('base64');

      // Upload to Imgur
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        {
          image: base64Image,
          type: 'base64'
        },
        {
          headers: {
            'Authorization': `Client-ID ${this.clientId}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data.link;
      } else {
        throw new Error('Imgur upload failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Imgur API error: ${error.response?.data?.data?.error || error.message}`);
      }
      throw error;
    }
  }
}