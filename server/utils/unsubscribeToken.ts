// server/utils/unsubscribeToken.ts
import crypto from "crypto";

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET!;

export function makeUnsubscribeToken(
  email: string,
  product: "newsletter" | "partners" | "sales" | "all",
  ttlSeconds = 60 * 60 * 24 * 7 // default 7 days
) {
  const expiry = Math.floor(Date.now() / 1000) + ttlSeconds;
  const hmac = crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(`${email}|${product}|${expiry}`)
    .digest("hex");
  return `${expiry}:${hmac}`;
}

// Example usage
const token = makeUnsubscribeToken("user@example.com", "newsletter");
const link = `https://eaziwage.com/unsubscribe?email=${encodeURIComponent(
  "user@example.com"
)}&product=newsletter&token=${encodeURIComponent(token)}`;