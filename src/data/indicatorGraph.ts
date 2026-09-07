import {
  indicateurs,
  vttSections,
  type FicheIndicateur,
  type Pole,
} from "@/data/indicators"

export type IndicatorGraphModeNode = {
  id: string
  kind: "mode"
  godNode: true
  key: string
  label: string
  axe: string
  question: string
}

export type IndicatorGraphIndicatorNode = {
  id: string
  kind: "indicator"
  indicatorId: string
  label: string
  pole: Pole
  maturite: 1 | 2 | 3 | 4 | null
}

export type IndicatorGraphEdge = {
  id: string
  source: string
  target: string
  relation: "principal" | "secondaire"
  status: "préclassement proposé"
}

export type IndicatorGraphData = {
  modes: IndicatorGraphModeNode[]
  indicators: IndicatorGraphIndicatorNode[]
  edges: IndicatorGraphEdge[]
  unmatchedSecondary: Array<{
    indicatorId: string
    label: string
  }>
}

export function toGraphNodeId(prefix: "vtt" | "indicateur", value: string) {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")

  return `${prefix}_${slug}`
}

export function buildIndicatorGraph(
  items: FicheIndicateur[] = indicateurs,
): IndicatorGraphData {
  const modes = vttSections.map((section) => ({
    id: toGraphNodeId("vtt", section.label),
    kind: "mode" as const,
    godNode: true as const,
    key: section.key,
    label: section.label,
    axe: section.axe,
    question: section.question,
  }))
  const modeByKey = new Map(modes.map((mode) => [mode.key, mode]))
  const modeByLabel = new Map(modes.map((mode) => [mode.label, mode]))
  const indicators = items.map((indicator) => ({
    id: toGraphNodeId("indicateur", indicator.id),
    kind: "indicator" as const,
    indicatorId: indicator.id,
    label: indicator.nom,
    pole: indicator.pole,
    maturite: indicator.maturite,
  }))
  const edges: IndicatorGraphEdge[] = []
  const unmatchedSecondary: IndicatorGraphData["unmatchedSecondary"] = []

  items.forEach((indicator) => {
    const indicatorNodeId = toGraphNodeId("indicateur", indicator.id)
    const primaryMode = modeByKey.get(indicator.lienVTT)
    const secondaryMode = modeByLabel.get(indicator.lienVTTSecondaire)

    if (primaryMode) {
      edges.push({
        id: `${primaryMode.id}__${indicatorNodeId}__principal`,
        source: primaryMode.id,
        target: indicatorNodeId,
        relation: "principal",
        status: "préclassement proposé",
      })
    }

    if (secondaryMode && secondaryMode.id !== primaryMode?.id) {
      edges.push({
        id: `${secondaryMode.id}__${indicatorNodeId}__secondaire`,
        source: secondaryMode.id,
        target: indicatorNodeId,
        relation: "secondaire",
        status: "préclassement proposé",
      })
    } else if (indicator.lienVTTSecondaire && !secondaryMode) {
      unmatchedSecondary.push({
        indicatorId: indicator.id,
        label: indicator.lienVTTSecondaire,
      })
    }
  })

  return { modes, indicators, edges, unmatchedSecondary }
}

export const indicatorGraph = buildIndicatorGraph()
