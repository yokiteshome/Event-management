import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface UserPayload {
  id: string;
  role: 'ADMIN' | 'OWNER';
  email: string;
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(req: NextRequest): Promise<UserPayload | null> {
  const token = req.cookies.get('token')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

// Helpers for role checks
export async function isAdmin(req: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req);
  return user?.role === 'ADMIN';
}

export async function isOwner(req: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req);
  return user?.role === 'OWNER';
}
