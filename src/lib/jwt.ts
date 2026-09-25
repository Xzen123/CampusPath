import type { Role } from './definitions';

const SECRET_KEY =
  process.env.NEXTAUTH_SECRET || 'campus_path_default_secret_key_change_in_production_2026';

export type SessionPayload = {
  userId: string;
  role: Role;
  expires: string;
};

// Base64URL encoding / decoding
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

// Web Crypto HMAC-SHA256 signing
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Signs a session payload into a compact JWT (header.payload.signature)
 */
export async function signSession(payload: SessionPayload): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(dataToSign)
  );

  const signature = Buffer.from(signatureBuffer)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${signature}`;
}

/**
 * Verifies a JWT token and returns the payload if valid and unexpired
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== 'string') return null;

  // Support legacy plain JSON sessions gracefully
  if (token.startsWith('{') && token.endsWith('}')) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.userId && parsed.role && (!parsed.expires || new Date(parsed.expires) > new Date())) {
        return parsed as SessionPayload;
      }
      return null;
    } catch {
      return null;
    }
  }

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  try {
    const key = await getCryptoKey();
    let sigBase64 = signature.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) {
      sigBase64 += '=';
    }
    const signatureBytes = Buffer.from(sigBase64, 'base64');

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(dataToSign)
    );

    if (!isValid) return null;

    const payload: SessionPayload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    if (payload.expires && new Date(payload.expires) < new Date()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
