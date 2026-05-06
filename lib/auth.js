import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  console.warn("JWT_SECRET is not defined. Falling back to default for development ONLY.");
}
const key = new TextEncoder().encode(secretKey || "super-secret-key-for-amex-training-system");

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function requireAuth(allowedRoles = []) {
  const session = await getSession();
  
  if (!session) {
    return { error: 'Unauthorized', status: 401 };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return { error: 'Forbidden', status: 403 };
  }

  return { session };
}
