import { jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";

export const adminVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
  const token = (req as any).cookies?.jwt_token;

  if (!token) return res.status(401).send("Unauthorized");

  try {
    const { payload } = await jwtVerify(token, secret);
    if ((payload as any).role !== "ADMIN") {
      return res.status(403).send("no eres admin crack");
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("Unauthorized");
  }
};
