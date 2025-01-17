import crypto from 'crypto';
import axios from 'axios';

const generateSignature = (publicId, timestamp, apiSecret) => {
  const hash = crypto.createHash('sha1');
  const data = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  hash.update(data);
  return hash.digest('hex');
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { publicId } = req.body;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = generateSignature(publicId, timestamp, apiSecret);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    try {
      const response = await axios.post(url, {
        public_id: publicId,
        api_key: apiKey,
        timestamp,
        signature,
      });

      if (response.data.result === 'ok') {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: response.data });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
