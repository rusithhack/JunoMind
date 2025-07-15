import { NextResponse, type NextRequest } from "next/server"
import { put } from "@vercel/blob"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Defensive check
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    // Serialize again to be sure we store valid JSON
    const blobContent = JSON.stringify(body, null, 2)
    const blob = await put(
      `exports/user-data-${Date.now()}.json`,
      new Blob([blobContent], { type: "application/json" }),
      {
        access: "public",
        addRandomSuffix: true,
      },
    )

    return NextResponse.json({ url: blob.url })
  } catch (error: any) {
    console.error("Data export failed:", error)
    return NextResponse.json({ error: error?.message ?? "Internal Server Error" }, { status: 500 })
  }
}
