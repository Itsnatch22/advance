import { NextResponse } from "next/server";

export const POST = async (_req: Request) => {
  return NextResponse.json(
    {
      success: false,
      error:
        "File upload is currently disabled in this deployment. Please contact support for upload assistance.",
    },
    { status: 404 }
  );
};
