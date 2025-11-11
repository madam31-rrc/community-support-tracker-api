import { Request, Response, NextFunction } from 'express';
import { getFirebase } from '../config/firebase';
import { env } from '../config/env';

export interface AuthUser {
  uid: string;
  orgId?: string;
  role?: 'admin' | 'manager' | 'volunteer' | 'viewer';
}
declare module 'express-serve-static-types' {
  interface Response {}
}
declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (env.isTest) { // testing shortcut
      req.user = { uid: 'test-user', orgId: 'test-org', role: 'admin' };
      return next();
    }
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const decoded = await getFirebase().auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      orgId: (decoded as any).orgId,
      role: (decoded as any).role
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
