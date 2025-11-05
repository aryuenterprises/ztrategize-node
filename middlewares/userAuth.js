import jwt from "jsonwebtoken";

// const useAuth = (req, res, next) => {
//   // Get the token from the Authorization header
//   console.log(req)
//   const authHeader = req.headers["authorization"];
//   console.log("Authorization Header:", authHeader);
  
//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract token part after "Bearer"

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("decoded",decoded);
//     if(!decoded){
//         return res.status(401).json({ message: "Token is not Correct"});
//     }
//     req.user = decoded; // Attach decoded payload to request object
//     next(); // Proceed to next middleware or route handler
//   } catch (err) {
//    if (err.name === "TokenExpiredError") {
//       return res.status(401).json({ success: false, message: "Token expired" });
//     }
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };



const useAuth = (req, res, next) => {
  console.log("Cookies:", req.cookies);
  // 1. Get token from cookies
  const token = req.cookies?.token;
  console.log("Token from cookies:", token);

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Optional: extra check
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // 5. Attach user info to request
    req.user = decoded;

    // 6. Call next middleware
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default useAuth;
