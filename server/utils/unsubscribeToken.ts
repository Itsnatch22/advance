import crypto from "crypto";

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET!;

export function makeUnsubscribeToken(
  email: string,
  product: "newsletter" | "partners" | "sales" | "all",
  ttlSeconds = 60 * 60 * 24 * 7
) {
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const hmac = crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(`${email}|${product}|${expiry}`)
    .digest("hex");
  return `${expiry}:${hmac}`;
}

export function verifyUnsubscribeToken(
  token: string,
  email: string,
  product: string
): boolean {
  if (!UNSUBSCRIBE_SECRET) return false;
  const colonIdx = token.indexOf(":");
  if (colonIdx === -1) return false;
  const expiryStr = token.slice(0, colonIdx);
  const hmac = token.slice(colonIdx + 1);
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() / 1000 > expiry) return false;
  const expected = crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(`${email}|${product}|${expiry}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmac, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
