const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

const KEYLEN = 64;

// Derive a hash from a plain-text password using scrypt with a per-user salt.
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, KEYLEN);
  return `${salt}:${derived.toString('hex')}`;
}

// Verify a plain-text password against a stored "salt:hash" string.
async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hashHex] = stored.split(':');
  const derived = await scrypt(password, salt, KEYLEN);
  const hashBuf = Buffer.from(hashHex, 'hex');
  return hashBuf.length === derived.length && crypto.timingSafeEqual(hashBuf, derived);
}

module.exports = { hashPassword, verifyPassword };
