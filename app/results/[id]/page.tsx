import { notFound } from "next/navigation";
import { decodeAnswers } from "@/lib/encode";
import { score } from "@/lib/scoring";
import { typeMap } from "@/lib/results";
import type { TypeCode } from "@/lib/types";
import ResultsClient from "./ResultsClient";

interface Props {
  params: { id: string };
}

export default async function ResultsPage({ params }: Props) {
  const answers = decodeAnswers(params.id);

  if (!answers) {
    notFound();
  }

  const scores = score(answers);
  const typeDesc = typeMap.get(scores.typeCode as TypeCode);

  if (!typeDesc) {
    notFound();
  }

  return <ResultsClient result={scores} typeDesc={typeDesc} />;
}
