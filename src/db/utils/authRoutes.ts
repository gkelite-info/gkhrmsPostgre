import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const tokenBlacklist: string[] = [];

export const generateToken = (userId: number): string => {
  const secret: Secret = process.env.JWT_SECRET as Secret;

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "2d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ id: userId }, secret, options);
};

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: "Token has been logged out" });
  }

  try {
    const secret: Secret = process.env.JWT_SECRET as Secret;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};