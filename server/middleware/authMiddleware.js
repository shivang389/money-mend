const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 1. Check if the frontend sent a token in the headers
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ msg: "No token provided, authorization denied." });
    }

    // 2. Verify the token (Removes "Bearer " if it exists)
    const formattedToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
    const verified = jwt.verify(formattedToken, process.env.JWT_SECRET);
    
    // 3. Attach the verified user data to the request! 
    // This is the magic line that makes req.user.id work in your controllers!
    req.user = verified; 
    
    next(); // Proceed to the controller
  } catch (err) {
    res.status(401).json({ msg: "Token is invalid or expired." });
  }
};

module.exports = auth;