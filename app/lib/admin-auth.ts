import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const cookieName = 'amir77_admin';

function secret() { return process.env.ADMIN_SESSION_SECRET || ''; }
function signature(value: string) { return createHmac('sha256', secret()).update(`amir77-admin:${value}`).digest('hex'); }

function equals(left: string, right: string) {
  const leftBytes = Buffer.from(left), rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

export function createAdminSession() {
  const expires = Date.now() + 1000 * 60 * 60 * 12;
  const value = String(expires);
  return `${value}.${signature(value)}`;
}

export function validAdminSession(value?: string) {
  if (!value || !secret()) return false;
  const [expires, received] = value.split('.');
  if (!expires || !received || Number(expires) < Date.now()) return false;
  const expected = signature(expires);
  return equals(received, expected);
}

export async function isAdmin() { return validAdminSession((await cookies()).get(cookieName)?.value); }
export function validAdminPassword(password: unknown) {
  return typeof password === 'string' && Boolean(process.env.ADMIN_PASSWORD) && equals(password, process.env.ADMIN_PASSWORD!);
}
export { cookieName };
