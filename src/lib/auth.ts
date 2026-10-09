import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { Session } from '@/models/Session';
import { User, IUser } from '@/models/User';

const SESSION_COOKIE = 'cp_session';
const CSRF_COOKIE = 'cp_csrf';
const BCRYPT_ROUNDS = 12;
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const SESSION_REMEMBER_AGE_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return timingSafeEqual(bufA, bufB);
}

export async function createSession(
  userId: string,
  userAgent: string,
  ip: string,
  remember: boolean = false
): Promise<string> {
  await connectDB();
  const token = generateToken();
  const tokenHash = hashToken(token);
  const maxAge = remember ? SESSION_REMEMBER_AGE_MS : SESSION_MAX_AGE_MS;

  await Session.create({
    token_hash: tokenHash,
    user_id: userId,
    user_agent: userAgent,
    ip: ip,
    expires_at: new Date(Date.now() + maxAge),
  });

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAge / 1000,
  });

  // Set CSRF token
  const csrfToken = generateToken();
  cookieStore.set(CSRF_COOKIE, csrfToken, {
    httpOnly: false, // readable by JS for forms
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAge / 1000,
  });

  return token;
}

export async function getSessionUser(): Promise<IUser | null> {
  try {
    await connectDB();
    const cookieStore = cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionToken) return null;

    const tokenHash = hashToken(sessionToken);
    const session = await Session.findOne({
      token_hash: tokenHash,
      expires_at: { $gt: new Date() },
    });
    if (!session) return null;

    const user = await User.findById(session.user_id).select('-password_hash');
    return user;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  await connectDB();
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionToken) {
    const tokenHash = hashToken(sessionToken);
    await Session.deleteOne({ token_hash: tokenHash });
  }
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(CSRF_COOKIE);
}

export async function destroyOtherSessions(userId: string, currentTokenHash: string): Promise<number> {
  await connectDB();
  const result = await Session.deleteMany({
    user_id: userId,
    token_hash: { $ne: currentTokenHash },
  });
  return result.deletedCount;
}

export function isAccountLocked(user: IUser): boolean {
  if (user.failed_login_attempts >= MAX_FAILED_ATTEMPTS && user.locked_until) {
    return new Date() < user.locked_until;
  }
  return false;
}

export async function recordFailedLogin(userId: string): Promise<void> {
  await connectDB();
  const update: Record<string, unknown> = {
    $inc: { failed_login_attempts: 1 },
  };
  const user = await User.findById(userId);
  if (user && user.failed_login_attempts + 1 >= MAX_FAILED_ATTEMPTS) {
    update.$set = { locked_until: new Date(Date.now() + LOCKOUT_DURATION_MS) };
  }
  await User.updateOne({ _id: userId }, update);
}

export async function resetFailedLogins(userId: string): Promise<void> {
  await connectDB();
  await User.updateOne({ _id: userId }, {
    $set: { failed_login_attempts: 0, locked_until: null },
  });
}

export function validateCSRF(request: Request): boolean {
  const csrfHeader = request.headers.get('x-csrf-token');
  const cookieHeader = request.headers.get('cookie') || '';
  const csrfCookieMatch = cookieHeader.match(/cp_csrf=([^;]+)/);
  const csrfCookie = csrfCookieMatch ? csrfCookieMatch[1] : '';

  if (!csrfHeader || !csrfCookie) return false;
  return constantTimeCompare(csrfHeader, csrfCookie);
}

// Common passwords list (subset)
const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwerty', 'abc123', 'letmein', 'welcome', 'monkey', 'dragon', 'master',
  'login', 'princess', 'football', 'shadow', 'sunshine', 'trustno1',
  'iloveyou', 'batman', 'access', 'hello', 'charlie', 'donald',
]);

export function validatePasswordStrength(password: string): { valid: boolean; message: string; strength: 'weak' | 'fair' | 'strong' } {
  if (password.length < 10) {
    return { valid: false, message: 'Password must be at least 10 characters.', strength: 'weak' };
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return { valid: false, message: 'This password is too common. Choose something more unique.', strength: 'weak' };
  }

  let score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const strength = score >= 4 ? 'strong' : score >= 2 ? 'fair' : 'weak';
  return { valid: true, message: '', strength };
}
