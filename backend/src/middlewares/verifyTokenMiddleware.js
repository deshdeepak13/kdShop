import jwt from 'jsonwebtoken';

const verifyTokenMiddleware = (req, res, next) => {
  // Get the token from the authorization header
  // console.log(req.headers.authorization)
  
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  // console.log("Token in middleware:", token);
  // const token = req.headers.authorization?.split(' ')[1]; 
// console.log("Authorization header:", req.headers.authorization); // Add this


  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual secret key
    req.user = decoded; // Attach the decoded token data (user info) to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.log({"token": token})
    console.log(error)
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default verifyTokenMiddleware;
