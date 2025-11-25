import { Request, Response, NextFunction } from 'express';
import { getFirebaseApp } from '../../../config/firebase';

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


export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    console.log('=== AUTH DEBUG ===');
    console.log('Auth header exists:', !!authHeader);
    console.log('Auth header preview:', authHeader?.substring(0, 50));

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Missing or invalid Authorization header');
      return res.status(401).json({
        status: 401,
        message: 'Missing or invalid Authorization header'
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 30) + '...');

    const firebase = getFirebaseApp();
    console.log('Firebase app initialized:', !!firebase);
    
    console.log('Attempting to verify token...');
    const decodedToken = await firebase.auth().verifyIdToken(token);
    console.log('✅ Token verified successfully!');
    console.log('User UID:', decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      orgId: (decodedToken as any).orgId,
      role: (decodedToken as any).role || 'viewer'
    };

    return next();
  } catch (error) {
    console.error('❌ Auth error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
    }
    return res.status(401).json({
      status: 401,
      message: 'Invalid or expired token',
      debug: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
