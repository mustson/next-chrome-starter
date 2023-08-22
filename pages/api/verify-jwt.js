import jwt from 'jsonwebtoken';

const secretKey = 'jubeikurosawacyber2077'; // Replace with your secret key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const token = req.body.token;

    try {
      const decoded = jwt.verify(token, secretKey);
      res.status(200).json({
        message: 'Token is valid',
        user: decoded,
      });
    } catch (err) {
      res.status(401).json({
        message: 'Invalid token',
      });
    }
  } else {
    res.status(405).json({
      message: 'Method not allowed',
    });
  }
}
