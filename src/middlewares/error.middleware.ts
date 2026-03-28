import type { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../exceptions/NotFoundException.ts";
import { HttpException } from "../exceptions/HttpException.ts";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof NotFoundException) {
    return res.status(error.status).json({
      error: error.message,
    });
  }

  if (error instanceof HttpException) {
    return res.status(error.status).json({
      error: error.message,
    });
  }

  if (error instanceof Error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  return res.status(500).json({
    error: "Unknown error",
  });
};
