import { PrismaClient } from "@/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";

const adapter = new PrismaPg({
  connectionString: `${process.env.DATABASE_URL}`,
});

const prisma = new PrismaClient({ adapter });

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
  // console.log(context.params, "<<");

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

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      weeklyMinutes: updatedUser.weeklyMinutes,
      obligationMinutes: updatedUser.obligationMinutes,
    });
  } catch (error) {
    console.error("Error updating user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
