import { PrismaClient } from "@/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase";

const adapter = new PrismaPg({
  connectionString: `${process.env.DATABASE_URL}`,
});

const prisma = new PrismaClient({ adapter });

async function syncThreadsAccess(obligationMinutes: number) {

  // console.log(obligationMinutes, " << obligationMinutes")
  const enabled = obligationMinutes < 3 * 60;
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/extension_flags?key=eq.threads_access`,
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ enabled }),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase returned ${response.status}`);
  }

  const updatedRows: unknown = await response.json();
  const updatedFlag = Array.isArray(updatedRows) ? updatedRows[0] : null;

  if (
    !updatedFlag ||
    typeof updatedFlag !== "object" ||
    !("enabled" in updatedFlag) ||
    updatedFlag.enabled !== enabled
  ) {
    throw new Error("Supabase did not return the expected Threads flag");
  }

  return enabled;
}

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      weeklyMinutes: string;
      obligationMinutes: string;
    }>;
  }
) {
  const { weeklyMinutes, obligationMinutes } = await context.params;

  const weeklyMinutesNumber = Number(weeklyMinutes);
  const obligationMinutesNumber = Number(obligationMinutes);
  console.log(context.params, "<<");

  if (
    Number.isNaN(weeklyMinutesNumber) ||
    Number.isNaN(obligationMinutesNumber)
  ) {
    return NextResponse.json(
      { error: "weeklyMinutes and obligationMinutes must be numbers" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json(
        { error: "No user found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        weeklyMinutes: weeklyMinutesNumber,
        obligationMinutes: obligationMinutesNumber,
      },
    });

    const threadsAccessEnabled = await syncThreadsAccess(
      updatedUser.obligationMinutes,
    );

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      weeklyMinutes: updatedUser.weeklyMinutes,
      obligationMinutes: updatedUser.obligationMinutes,
      threadsAccessEnabled,
    });
  } catch (error) {
    console.error("Error updating user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
