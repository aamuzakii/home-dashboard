import { NextResponse } from "next/server";

interface RouteParams {
  weeklyMinutes: string;
  obligationMinutes: string;
}

export async function GET(
  _request: Request,
  context: { params: RouteParams }
) {
  const { weeklyMinutes, obligationMinutes } = context.params;

  const weeklyMinutesNumber = Number(weeklyMinutes);
  const obligationMinutesNumber = Number(obligationMinutes);

  if (
    Number.isNaN(weeklyMinutesNumber) ||
    Number.isNaN(obligationMinutesNumber)
  ) {
    return NextResponse.json(
      { error: "weeklyMinutes and obligationMinutes must be numbers" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    weeklyMinutes: weeklyMinutesNumber,
    obligationMinutes: obligationMinutesNumber,
  });
}
