import { NextResponse } from "next/server";
import { score, validateAnswers } from "@/lib/scoring";
import { saveResponse } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers } = body;

    // Validate
    if (!validateAnswers(answers)) {
      return NextResponse.json(
        { error: "모든 30문항에 1~7 사이의 정수로 응답해주세요." },
        { status: 400 }
      );
    }

    // Score
    const result = score(answers);

    // Save
    const id = await saveResponse({
      answers,
      scores: result,
      typeCode: result.typeCode,
      typeName: result.typeName,
    });

    return NextResponse.json({ id });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
