// app/api/upload/route.ts  (simplified; protect this in prod)
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const POST = async (_req: Request) => {
  // NOTE: Next.js app router doesn't support multer directly. This is illustrative.
  // For practical usage, use an express server or handle multipart parsing manually.
  // Approach in production: build a small express lambda for uploads or upload to S3 and trigger convert.
  return NextResponse.json(
    {
      error:
        "Implement upload with your infra (example provided in discussion)",
    },
    { status: 501 }
  );
};
