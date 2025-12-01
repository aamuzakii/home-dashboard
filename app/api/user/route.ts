import { PrismaClient } from "@/prisma/generated/client";
import { NextResponse } from "next/server";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: `${process.env.DATABASE_URL}`,
});
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    const name = user.name ?? "Anonymous";

    return NextResponse.json({ name });
  } catch (error) {
    console.error("Error fetching user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
