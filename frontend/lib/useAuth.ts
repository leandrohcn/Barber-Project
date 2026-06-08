import { useEffect, useState } from 'react';

export interface AuthUser {
  sub: string;
  email: string;
  organizationId: string;
  role: 'OWNER' | 'ADMIN' | 'STAFF';
  iat: number;
  exp: number;
}

/**
 * Decode JWT payload without validation
 * (validation is done server-side)
 */
function decodeJwt(token: string): AuthUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    );
    return decoded;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      const decoded = decodeJwt(token);
      console.log('JWT decoded:', decoded);
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
