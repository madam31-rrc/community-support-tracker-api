import { Request, Response, NextFunction } from 'express';
import { getFirebaseApp } from '../../../config/firebase';
import { env } from '../../../config/env';

export type UserRole = 'admin' | 'manager' | 'volunteer' | 'viewer';

export interface AuthUser {
  uid: string;
  orgId?: string;
  role?: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (env.isTest) {
      req.user = { uid: 'test-user', orgId: 'test-org', role: 'admin' };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const firebase = getFirebaseApp();
    const decoded = await firebase.auth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      orgId: (decoded as any).orgId,
      role: (decoded as any).role
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
