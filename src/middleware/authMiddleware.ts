import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Employee from '../db/models/employee';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  id: number;
}

export interface AuthenticatedRequest extends Request {
  employee?: Employee;
}

export const protectEmployee = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

      const employee = await Employee.findByPk(decoded.id);
      if (!employee) return res.status(401).json({ message: 'Employee not found' });

      req.employee = employee;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
