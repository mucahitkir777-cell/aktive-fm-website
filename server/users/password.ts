import crypto from "crypto";

const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const PASSWORD_HASH_PREFIX = "scrypt";

function timingSafeEqualString(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
  });

  return [
    PASSWORD_HASH_PREFIX,
    `N=${SCRYPT_COST},r=${SCRYPT_BLOCK_SIZE},p=${SCRYPT_PARALLELIZATION}`,
    salt,
    derivedKey.toString("hex"),
  ].join("$");
}

export function verifyPassword(password: string, passwordHash: string) {
  const [prefix, params, salt, storedHash] = passwordHash.split("$");
  if (prefix !== PASSWORD_HASH_PREFIX || !params || !salt || !storedHash) {
    return false;
  }

  const parameterMap = Object.fromEntries(
    params.split(",").map((entry) => {
      const [key, value] = entry.split("=");
      return [key, Number(value)];
    }),
  );

  const derivedKey = crypto.scryptSync(password, salt, storedHash.length / 2, {
    N: parameterMap.N,
    r: parameterMap.r,
    p: parameterMap.p,
  });

  return timingSafeEqualString(derivedKey.toString("hex"), storedHash);
}
