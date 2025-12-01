import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    const user2 = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    },
  })

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const name = (user as any).name ?? "Anonymous";

    return NextResponse.json({ name });
  } catch (error) {
    console.error("Error fetching user", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
