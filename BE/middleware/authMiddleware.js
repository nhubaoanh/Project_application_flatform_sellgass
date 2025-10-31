import jwt from "jsonwebtoken";

const JWT_SECRET = "SECRET_KEY_ABC"; // tốt nhất để trong .env

const authMiddleware = (req, res, next) => {
  console.log("JWT_SECRET used in middleware:", JWT_SECRET);
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Thiếu token" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    // console.log("Auth header:", req.headers["authorization"]);
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log("Verify success:", decoded);
    req.user = decoded; // gắn user vào req để dùng sau
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token sai hoặc hết hạn" });
  }
};

export default authMiddleware;
