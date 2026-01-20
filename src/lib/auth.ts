import { createHash } from 'crypto';

export function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}

// For single-user, we'll check against an environment variable
export function authenticate(password: string): boolean {
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminHash) return false;
    return verifyPassword(password, adminHash);
}
