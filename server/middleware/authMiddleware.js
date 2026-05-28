const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // 1. Check if the frontend sent a token
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ msg: "No token provided, authorization denied." });
    }

    // 2. Bulletproof Token Cleanup (Destroys hidden spaces and quotes)
    let formattedToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
    formattedToken = formattedToken.replace(/"/g, '').trim(); 

    // 3. The "Missing Secret" Check
    if (!process.env.JWT_SECRET) {
        console.error("🚨 CRITICAL ERROR: JWT_SECRET is missing from Render!");
        return res.status(500).json({ 
            msg: "Server configuration error: Missing Secret Key. Check Render Environment Variables." 
        });
    }

    // 4. Verify the token
    const verified = jwt.verify(formattedToken, process.env.JWT_SECRET);
    
    // 5. Attach user and proceed
    req.user = verified; 
    next(); 
    
  } catch (err) {
    // 🌟 THE CONFESSION: Send the exact error to Render Logs AND the Browser
    console.error("❌ JWT VERIFY FAILED:", err.message);
    res.status(401).json({ 
        msg: "Token is invalid or expired.", 
        exactError: err.message // This will tell us the true bug!
    });
  }
};

module.exports = auth;