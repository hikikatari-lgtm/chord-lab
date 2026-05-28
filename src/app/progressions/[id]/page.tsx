import { notFound } from "next/navigation";
import { PRESETS, getProgression } from "@/data/presets";
import ProgressionView from "./ProgressionView";

export function generateStaticParams() {
  return PRESETS.map((p) => ({ id: p.id }));
}

export default async function ProgressionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const progression = getProgression(id);
  if (!progression) notFound();
  return <ProgressionView key={progression.id} progression={progression} />;
}
