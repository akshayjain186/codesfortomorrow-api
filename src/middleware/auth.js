// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ 
//             message: 'Unauthorized: Bearer token not provided or format is invalid.' 
//         });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
//         req.user = decoded; 
        
//         next();
        
//     } catch (err) {
//         console.error("JWT Verification Error:", err.message);
//         return res.status(403).json({ 
//             message: 'Forbidden: Invalid or expired token. Please log in again.' 
//         });
//     }
// };

// module.exports = authenticateJWT; 
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;

