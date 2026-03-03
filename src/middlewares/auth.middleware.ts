import { jwtVerify } from "jose";

export const adminVerify = async (req, res, next) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = req.cookies.jwt_token;

  if (!token) return res.status(401).send("Unauthorized");

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin") {
      return res.status(403).send("no eres admin crack");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("Unauthorized");
  }
};
