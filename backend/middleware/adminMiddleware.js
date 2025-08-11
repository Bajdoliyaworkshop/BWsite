import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { secret } from '../config/jwt.js';

const adminMiddleware = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({ error: 'Authorization token required' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, secret);
    
    // Find admin with this token
    const admin = await Admin.findOne({
      _id: decoded.id,
      'tokens.token': token
    });

    if (!admin) {
      return res.status(401).send({ error: 'Admin not found' });
    }

    // Attach admin and token to request
    req.token = token;
    req.admin = admin;
    next();
  } catch (err) {
    console.error('Admin middleware error:', err.message);
    res.status(401).send({ 
      error: 'Please authenticate as admin',
      details: err.message 
    });
  }
};

export default adminMiddleware;