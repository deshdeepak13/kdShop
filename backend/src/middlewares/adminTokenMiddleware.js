import jwt from "jsonwebtoken";

const adminTokenMiddleware = (req, res, next) => {
  // Get the token from the authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied, no token provided." });
  }

  try {
    // Verify the token using the secret key from the environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret-123");
    console.log(decoded);

    // Check if the user has the 'admin' role
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied, admin privileges required." });
    }

    // Attach the decoded token data (user info) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Log token and error for debugging purposes (disable in production)
    console.error("Token verification failed:", {
      token,
      error: error.message,
    });

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default adminTokenMiddleware;
