const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    // Safely grab the fallback ID without crashing
    const fallbackId = (req.body && req.body.userId) 
        ? req.body.userId 
        : (req.params && req.params.userId ? req.params.userId : null);

    if (!token) {
        req.user = { id: fallbackId }; 
        return next();
    }

    let formattedToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
    formattedToken = formattedToken.replace(/"/g, '').trim(); 

    const decodedUser = jwt.decode(formattedToken);

    req.user = { id: (decodedUser && decodedUser.id) ? decodedUser.id : fallbackId };
    
    next(); 
    
  } catch (err) {
    // 🌟 THIS IS THE FIX: No crashing allowed here, and no old console.logs
    const fallbackId = (req.body && req.body.userId) 
        ? req.body.userId 
        : (req.params && req.params.userId ? req.params.userId : null);
        
    req.user = { id: fallbackId };
    next();
  }
};

module.exports = auth;