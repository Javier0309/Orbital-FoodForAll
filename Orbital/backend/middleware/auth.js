// middleware/verifySupabaseToken.js
import jwt from 'jsonwebtoken';
import axios from 'axios';

const SUPABASE_JWKS_URL = 'https://<your-project-id>.supabase.co/auth/v1/keys'; // Replace with your Supabase project URL

let cachedKeys;

const getJWKS = async () => {
  if (!cachedKeys) {
    const response = await axios.get(SUPABASE_JWKS_URL);
    cachedKeys = response.data.keys;
  }
  return cachedKeys;
};

const verifySupabaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];

  try {
    const keys = await getJWKS();
    const decodedHeader = jwt.decode(token, { complete: true });
    const key = keys.find(k => k.kid === decodedHeader.header.kid);
    if (!key) throw new Error('Key not found');

    const publicKey = jwt.JWT.asKey(key);
    const decoded = jwt.verify(token, publicKey.toPEM());

    req.userId = decoded.sub; // Supabase user ID
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifySupabaseToken;
