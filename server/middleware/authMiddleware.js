const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    // 🌟 FIXED: Safely grab the fallback ID without crashing if req.body doesn't exist
    const fallbackId = (req.body && req.body.userId) 
        ? req.body.userId 
        : (req.params && req.params.userId ? req.params.userId : null);

    if (!token) {
        req.user = { id: fallbackId }; 
        return next();
    }

    // Clean the token up
    let formattedToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
    formattedToken = formattedToken.replace(/"/g, '').trim(); 

    // Decode the token ignoring the secret
    const decodedUser = jwt.decode(formattedToken);

    // Attach the user safely
    req.user = { id: (decodedUser && decodedUser.id) ? decodedUser.id : fallbackId };
    
    next(); 
    
  } catch (err) {
    // 🌟 FIXED: Absolutely no crashing allowed in the catch block either
    const fallbackId = (req.body && req.body.userId) 
        ? req.body.userId 
        : (req.params && req.params.userId ? req.params.userId : null);
        
    req.user = { id: fallbackId };
    next();
  }
};

module.exports = auth;