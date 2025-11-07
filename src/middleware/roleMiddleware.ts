import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user is an admin
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }

  next();
};

/**
 * Middleware to check if user is a farmer
 */
export const farmerOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  }

  if (req.user.role !== 'farmer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Farmers only.'
    });
  }

  next();
};

/**
 * Middleware to check if user is a veterinarian
 */
export const vetOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  }

  if (req.user.role !== 'veterinarian' && req.user.role !== 'vet') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Veterinarians only.'
    });
  }

  next();
};