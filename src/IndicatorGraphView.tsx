import { useState, type KeyboardEvent } from "react"
import { buildIndicatorGraph, toGraphNodeId } from "@/data/indicatorGraph"
import { poleColors, vttSections, type Indicateur } from "@/data/indicators"

const GRAPH_WIDTH = 1120
const GRAPH_HEIGHT = 720
const CLUSTER_WIDTH = 370
const CLUSTER_HEIGHT = 350
const INDICATOR_ORBIT_RADIUS = 134

type GraphPosition = {
  x: number
  y: number
}

function activateWithKeyboard(
  event: KeyboardEvent<SVGGElement>,
  action: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault()
    action()
  }
}

function modeLabelLines(label: string) {
  return label === "Mise en réseau" ? ["Mise en", "réseau"] : [label]
}

export default function IndicatorGraphView({
  items,
  onSelect,
}: {
  items: Indicateur[]
  onSelect: (indicator: Indicateur) => void
}) {
  const [activeModeId, setActiveModeId] = useState<string | null>(null)
  const graph = buildIndicatorGraph(items)
  const indicatorById = new Map(
    items.map((indicator) => [indicator.id, indicator]),
  )
  const indicatorNodeById = new Map(
    graph.indicators.map((node) => [node.id, node]),
  )
  const modePositions = new Map<string, GraphPosition>()
  const indicatorPositions = new Map<string, GraphPosition>()

  graph.modes.forEach((mode, index) => {
    const column = index % 3
    const row = Math.floor(index / 3)
    const center = {
      x: CLUSTER_WIDTH / 2 + column * CLUSTER_WIDTH + 5,
      y: CLUSTER_HEIGHT / 2 + row * CLUSTER_HEIGHT + 8,
    }
    const primaryNodeIds = graph.edges
      .filter(
        (edge) => edge.source === mode.id && edge.relation === "principal",
      )
      .map((edge) => edge.target)
      .sort()
    modePositions.set(mode.id, center)
    primaryNodeIds.forEach((nodeId, nodeIndex) => {
      const angle =
        -Math.PI / 2 +
        (Math.PI * 2 * nodeIndex) / Math.max(primaryNodeIds.length, 1)
      indicatorPositions.set(nodeId, {
        x: center.x + Math.cos(angle) * INDICATOR_ORBIT_RADIUS,
        y: center.y + Math.sin(angle) * INDICATOR_ORBIT_RADIUS,
      })
    })
  })

  const activeMode =
    graph.modes.find((mode) => mode.id === activeModeId) ?? null
  const activeIndicatorNodeIds = new Set(
    activeModeId
      ? graph.edges
          .filter((edge) => edge.source === activeModeId)
          .map((edge) => edge.target)
      : [],
  )

  if (items.length === 0) {
    return (
      <div
        className="text-center py-20"
        style={{ color: "var(--color-text-muted)" }}
      >
        <p
          style={{
            fontFamily: "'Newsreader', serif",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Aucun résultat
        </p>
        <p className="text-sm mt-1">
          Essayez d’élargir les filtres pour afficher le graphe.
        </p>
      </div>
    )
  }

  return (
    <section aria-labelledby="indicator-graph-title">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
        <div>
          <h2
            id="indicator-graph-title"
            style={{
              fontFamily: "'Newsreader', serif",
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "var(--color-primary-strong)",
            }}
          >
            Relations entre modes d’action et indicateurs
          </h2>
          <p
            className="mt-1 text-sm leading-relaxed"
            style={{ color: "var(--color-text-muted)", maxWidth: 680 }}
          >
            Les modes d’action forment les nœuds structurants. Les indicateurs
            sont colorés selon leur pôle thématique.
          </p>
        </div>
        {activeMode && (
          <button
            type="button"
            onClick={() => setActiveModeId(null)}
            className="text-xs font-semibold self-start md:self-auto hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-primary)" }}
          >
            Afficher toutes les relations
          </button>
        )}
      </div>

      <div className="graph-legend" aria-label="Légende du graphe">
        <div className="graph-legend-group">
          {Object.entries(poleColors).map(([pole, color]) => (
            <span key={pole} className="graph-legend-item">
              <span
                className="graph-legend-dot"
                style={{ background: color.light, borderColor: color.accent }}
              />
              {pole}
            </span>
          ))}
        </div>
        <div className="graph-legend-group">
          <span className="graph-legend-item">
            <span className="graph-legend-line" />
            Lien principal
          </span>
          <span className="graph-legend-item">
            <span className="graph-legend-line is-secondary" />
            Lien secondaire proposé
          </span>
        </div>
      </div>

      <p className="graph-selection-status" aria-live="polite">
        {activeMode
          ? `${activeMode.label} : ${activeIndicatorNodeIds.size} indicateur${
              activeIndicatorNodeIds.size !== 1 ? "s" : ""
            } relié${activeIndicatorNodeIds.size !== 1 ? "s" : ""}.`
          : "Sélectionnez un mode d’action pour isoler ses relations."}
      </p>

      <div
        className="indicator-graph-scroll"
        tabIndex={0}
        aria-label="Graphe défilable des relations entre modes d’action VTT et indicateurs"
      >
        <svg
          className="indicator-graph-canvas"
          viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
          role="group"
          aria-labelledby="indicator-graph-svg-title indicator-graph-svg-description"
        >
          <title id="indicator-graph-svg-title">
            Graphe VTT et indicateurs POPGG
          </title>
          <desc id="indicator-graph-svg-description">
            Six modes d’action structurants reliés aux indicateurs. Les couleurs
            identifient les pôles Environnement, Mobilité, Urbanisation et
            Gouvernance. Les traits continus représentent les liens principaux
            et les traits interrompus les liens secondaires proposés.
          </desc>

          {graph.modes.map((mode) => {
            const center = modePositions.get(mode.id)!
            return (
              <circle
                key={`halo-${mode.id}`}
                className="graph-cluster-circle"
                cx={center.x}
                cy={center.y}
                r={164}
                fill="var(--color-surface)"
                stroke="var(--color-border-subtle)"
                strokeWidth={1}
                opacity={activeModeId && activeModeId !== mode.id ? 0.24 : 0.74}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}

          <g aria-hidden="true">
            {graph.edges.map((edge) => {
              const source = modePositions.get(edge.source)
              const target = indicatorPositions.get(edge.target)
              const indicatorNode = indicatorNodeById.get(edge.target)
              if (!source || !target || !indicatorNode) return null
              const isActive = !activeModeId || edge.source === activeModeId
              const opacity = activeModeId
                ? isActive
                  ? edge.relation === "principal"
                    ? 0.84
                    : 0.62
                  : 0.025
                : edge.relation === "principal"
                  ? 0.34
                  : 0.11

              return (
                <line
                  key={edge.id}
                  className="graph-edge"
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={poleColors[indicatorNode.pole].accent}
                  strokeWidth={edge.relation === "principal" ? 1.7 : 1.2}
                  strokeDasharray={
                    edge.relation === "secondaire" ? "5 6" : undefined
                  }
                  strokeOpacity={opacity}
                  vectorEffect="non-scaling-stroke"
                />
              )
            })}
          </g>

          {graph.indicators.map((node) => {
            const position = indicatorPositions.get(node.id)
            const indicator = indicatorById.get(node.indicatorId)
            if (!position || !indicator) return null
            const color = poleColors[node.pole]
            const isDimmed = Boolean(
              activeModeId && !activeIndicatorNodeIds.has(node.id),
            )
            const secondaryMode = graph.modes.find((mode) =>
              graph.edges.some(
                (edge) =>
                  edge.target === node.id &&
                  edge.source === mode.id &&
                  edge.relation === "secondaire",
              ),
            )

            return (
              <g
                key={node.id}
                className="graph-indicator-node"
                role="button"
                tabIndex={0}
                aria-label={`${node.indicatorId}, ${node.label}, pôle ${node.pole}. Mode principal ${indicator.lienVTT.replace(/^\d\.\d\s+/, "")}${
                  secondaryMode
                    ? `, mode secondaire ${secondaryMode.label}`
                    : ""
                }.`}
                onClick={() => onSelect(indicator)}
                onKeyDown={(event) =>
                  activateWithKeyboard(event, () => onSelect(indicator))
                }
                opacity={isDimmed ? 0.17 : 1}
              >
                <title>
                  {node.indicatorId} · {node.label}
                </title>
                <circle
                  className="graph-indicator-shape"
                  cx={position.x}
                  cy={position.y}
                  r={21}
                  fill={color.bg}
                  stroke={color.accent}
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={position.x}
                  y={position.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={color.accent}
                  fontFamily="'Public Sans', sans-serif"
                  fontSize={9.5}
                  fontWeight={700}
                >
                  {node.indicatorId}
                </text>
              </g>
            )
          })}

          {graph.modes.map((mode) => {
            const center = modePositions.get(mode.id)!
            const labelLines = modeLabelLines(mode.label)
            const count = new Set(
              graph.edges
                .filter((edge) => edge.source === mode.id)
                .map((edge) => edge.target),
            ).size
            const isActive = activeModeId === mode.id

            return (
              <g
                key={mode.id}
                className="graph-mode-node"
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${mode.label}, mode d’action structurant, ${count} indicateur${
                  count !== 1 ? "s" : ""
                } relié${count !== 1 ? "s" : ""}`}
                onClick={() => setActiveModeId(isActive ? null : mode.id)}
                onKeyDown={(event) =>
                  activateWithKeyboard(event, () =>
                    setActiveModeId(isActive ? null : mode.id),
                  )
                }
              >
                <circle
                  className="graph-mode-ring"
                  cx={center.x}
                  cy={center.y}
                  r={57}
                  fill="none"
                  stroke={
                    isActive
                      ? "var(--color-accent)"
                      : "var(--color-primary-soft-strong)"
                  }
                  strokeWidth={isActive ? 3 : 1.5}
                  opacity={isActive ? 1 : 0.72}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  className="graph-mode-shape"
                  cx={center.x}
                  cy={center.y}
                  r={49}
                  fill={
                    isActive
                      ? "var(--color-primary)"
                      : "var(--color-primary-strong)"
                  }
                  stroke="var(--color-surface)"
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={center.x}
                  y={center.y - (labelLines.length - 1) * 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-surface)"
                  fontFamily="'Newsreader', serif"
                  fontSize={14}
                  fontWeight={700}
                  pointerEvents="none"
                >
                  {labelLines.map((line, lineIndex) => (
                    <tspan
                      key={line}
                      x={center.x}
                      dy={lineIndex === 0 ? 0 : 18}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <p className="graph-mobile-hint">
        Le graphe se parcourt horizontalement sur petit écran.
      </p>

      <details className="graph-relations-list">
        <summary>Consulter les relations sous forme de liste</summary>
        <div className="graph-relations-grid">
          {vttSections.map((section) => {
            const primaryIndicators = items.filter(
              (indicator) => indicator.lienVTT === section.key,
            )
            return (
              <section key={section.key} className="graph-relation-group">
                <h3>{section.label}</h3>
                {primaryIndicators.length === 0 ? (
                  <p>Aucun indicateur avec les filtres actuels.</p>
                ) : (
                  <ul>
                    {primaryIndicators.map((indicator) => {
                      const color = poleColors[indicator.pole]
                      return (
                        <li key={indicator.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(indicator)}
                          >
                            <span
                              className="graph-relation-dot"
                              style={{
                                background: color.light,
                                borderColor: color.accent,
                              }}
                              aria-hidden="true"
                            />
                            <span>
                              <strong>
                                {indicator.id} · {indicator.nom}
                              </strong>
                              <small>
                                {indicator.pole} · lien secondaire proposé :{" "}
                                {indicator.lienVTTSecondaire || "aucun"}
                              </small>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
        </div>
        {graph.unmatchedSecondary.length > 0 && (
          <p className="graph-unmatched-note">
            {graph.unmatchedSecondary.length} rattachement
            {graph.unmatchedSecondary.length !== 1 ? "s" : ""} secondaire
            {graph.unmatchedSecondary.length !== 1 ? "s" : ""} ne correspondent
            pas aux six modes d’action et restent à confirmer.
          </p>
        )}
      </details>
    </section>
  )
}
