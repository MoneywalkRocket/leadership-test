import { notFound } from "next/navigation";
import { getResponse } from "@/lib/storage";
import { typeMap } from "@/lib/results";
import type { ScoringResult, TypeCode } from "@/lib/types";
import ResultsClient from "./ResultsClient";

interface Props {
  params: { id: string };
}

export default async function ResultsPage({ params }: Props) {
  const data = await getResponse(params.id);

  if (!data) {
    notFound();
  }

  const scores = data.scores as ScoringResult;
  const typeDesc = typeMap.get(scores.typeCode as TypeCode);

  if (!typeDesc) {
    notFound();
  }

  return <ResultsClient result={scores} typeDesc={typeDesc} />;
}
