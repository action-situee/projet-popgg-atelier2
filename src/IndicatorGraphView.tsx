import {
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react"
import { Minus, Plus, Scan } from "lucide-react"
import {
  buildIndicatorGraph,
  type IndicatorGraphData,
} from "@/data/indicatorGraph"
import { poleColors, vttSections, type FicheIndicateur } from "@/data/indicators"

const GRAPH_WIDTH = 1120
const GRAPH_HEIGHT = 720
const CLUSTER_WIDTH = 370
const CLUSTER_HEIGHT = 350
const INDICATOR_ORBIT_RADIUS = 134
const MIN_NETWORK_ZOOM = 0.68
const MAX_NETWORK_ZOOM = 2.2

type GraphPosition = {
  x: number
  y: number
}

type GraphLayout = "structure" | "reseau"

type GraphTransform = {
  x: number
  y: number
  k: number
}

type PointerInteraction = {
  kind: "pan" | "node"
  pointerId: number
  nodeId?: string
  lastClientX: number
  lastClientY: number
  moved: boolean
}

const DEFAULT_NETWORK_TRANSFORM: GraphTransform = { x: 0, y: 0, k: 1 }

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

function stableHash(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash >>> 0)
}

function buildNetworkPositions(graph: IndicatorGraphData) {
  const center = { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2 }
  const modeAnchors = new Map<string, GraphPosition>()
  const nodes = [
    ...graph.modes.map((mode, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / graph.modes.length
      const position = {
        x: center.x + Math.cos(angle) * 250,
        y: center.y + Math.sin(angle) * 240,
      }
      modeAnchors.set(mode.id, position)
      return { id: mode.id, kind: "mode" as const, ...position, vx: 0, vy: 0 }
    }),
    ...graph.indicators.map((indicator) => {
      const primaryEdge = graph.edges.find(
        (edge) => edge.target === indicator.id && edge.relation === "principal",
      )
      const anchor = primaryEdge
        ? modeAnchors.get(primaryEdge.source)
        : undefined
      const hash = stableHash(indicator.id)
      const angle = ((hash % 360) * Math.PI) / 180
      const radius = 72 + (hash % 66)
      return {
        id: indicator.id,
        kind: "indicator" as const,
        x: (anchor?.x ?? center.x) + Math.cos(angle) * radius,
        y: (anchor?.y ?? center.y) + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      }
    }),
  ]
  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  for (let iteration = 0; iteration < 380; iteration += 1) {
    const cooling = 1 - iteration / 440
    const forces = new Map(nodes.map((node) => [node.id, { x: 0, y: 0 }]))

    for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < nodes.length;
        secondIndex += 1
      ) {
        const first = nodes[firstIndex]
        const second = nodes[secondIndex]
        const dx = second.x - first.x || 0.01
        const dy = second.y - first.y || 0.01
        const distanceSquared = Math.max(dx * dx + dy * dy, 64)
        const distance = Math.sqrt(distanceSquared)
        const repulsion =
          first.kind === "mode" && second.kind === "mode"
            ? 8200
            : first.kind === "mode" || second.kind === "mode"
              ? 3100
              : 720
        const force = repulsion / distanceSquared
        const forceX = (dx / distance) * force
        const forceY = (dy / distance) * force
        forces.get(first.id)!.x -= forceX
        forces.get(first.id)!.y -= forceY
        forces.get(second.id)!.x += forceX
        forces.get(second.id)!.y += forceY

        const minimumDistance =
          (first.kind === "mode" ? 48 : 17) +
          (second.kind === "mode" ? 48 : 17) +
          8
        if (distance < minimumDistance) {
          const overlap = (minimumDistance - distance) * 0.09
          forces.get(first.id)!.x -= (dx / distance) * overlap
          forces.get(first.id)!.y -= (dy / distance) * overlap
          forces.get(second.id)!.x += (dx / distance) * overlap
          forces.get(second.id)!.y += (dy / distance) * overlap
        }
      }
    }

    graph.edges.forEach((edge) => {
      const source = nodeById.get(edge.source)
      const target = nodeById.get(edge.target)
      if (!source || !target) return
      const dx = target.x - source.x
      const dy = target.y - source.y
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
      const desiredDistance = edge.relation === "principal" ? 112 : 176
      const strength = edge.relation === "principal" ? 0.019 : 0.006
      const force = (distance - desiredDistance) * strength
      const forceX = (dx / distance) * force
      const forceY = (dy / distance) * force
      forces.get(source.id)!.x += forceX
      forces.get(source.id)!.y += forceY
      forces.get(target.id)!.x -= forceX
      forces.get(target.id)!.y -= forceY
    })

    graph.modes.forEach((mode) => {
      const node = nodeById.get(mode.id)
      const anchor = modeAnchors.get(mode.id)
      if (!node || !anchor) return
      forces.get(mode.id)!.x += (anchor.x - node.x) * 0.003
      forces.get(mode.id)!.y += (anchor.y - node.y) * 0.003
    })

    nodes.forEach((node) => {
      const force = forces.get(node.id)!
      force.x += (center.x - node.x) * 0.0009
      force.y += (center.y - node.y) * 0.0009
      node.vx = (node.vx + force.x * cooling) * 0.79
      node.vy = (node.vy + force.y * cooling) * 0.79
      node.x = clamp(node.x + node.vx, 58, GRAPH_WIDTH - 58)
      node.y = clamp(node.y + node.vy, 58, GRAPH_HEIGHT - 58)
    })
  }

  return Object.fromEntries(
    nodes.map((node) => [node.id, { x: node.x, y: node.y }]),
  ) as Record<string, GraphPosition>
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
  items: FicheIndicateur[]
  onSelect: (indicator: FicheIndicateur) => void
}) {
  const [activeModeId, setActiveModeId] = useState<string | null>(null)
  const [layoutMode, setLayoutMode] = useState<GraphLayout>("structure")
  const [networkTransform, setNetworkTransform] = useState<GraphTransform>(
    DEFAULT_NETWORK_TRANSFORM,
  )
  const [draggedPositions, setDraggedPositions] =
    useState<Record<string, GraphPosition>>({})
  const interactionRef = useRef<PointerInteraction | null>(null)
  const suppressClickRef = useRef(false)
  const graph = useMemo(() => buildIndicatorGraph(items), [items])
  const networkBasePositions = useMemo(
    () => buildNetworkPositions(graph),
    [graph],
  )
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

  const getNetworkPosition = (nodeId: string) =>
    draggedPositions[nodeId] ?? networkBasePositions[nodeId]

  const resetNetwork = () => {
    setNetworkTransform(DEFAULT_NETWORK_TRANSFORM)
    setDraggedPositions({})
  }

  const changeLayout = (nextLayout: GraphLayout) => {
    setLayoutMode(nextLayout)
    setActiveModeId(null)
    if (nextLayout === "reseau") resetNetwork()
  }

  const zoomNetwork = (
    factor: number,
    focus = { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2 },
  ) => {
    setNetworkTransform((current) => {
      const nextScale = clamp(
        current.k * factor,
        MIN_NETWORK_ZOOM,
        MAX_NETWORK_ZOOM,
      )
      const scaleRatio = nextScale / current.k
      return {
        x: focus.x - (focus.x - current.x) * scaleRatio,
        y: focus.y - (focus.y - current.y) * scaleRatio,
        k: nextScale,
      }
    })
  }

  const handleNetworkWheel = (event: ReactWheelEvent<SVGSVGElement>) => {
    if (layoutMode !== "reseau" || (!event.ctrlKey && !event.metaKey)) {
      return
    }
    event.preventDefault()
    const bounds = event.currentTarget.getBoundingClientRect()
    const focus = {
      x: ((event.clientX - bounds.left) / bounds.width) * GRAPH_WIDTH,
      y: ((event.clientY - bounds.top) / bounds.height) * GRAPH_HEIGHT,
    }
    zoomNetwork(event.deltaY < 0 ? 1.12 : 0.89, focus)
  }

  const beginNetworkPan = (event: ReactPointerEvent<SVGRectElement>) => {
    if (layoutMode !== "reseau") return
    event.currentTarget.setPointerCapture(event.pointerId)
    interactionRef.current = {
      kind: "pan",
      pointerId: event.pointerId,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      moved: false,
    }
  }

  const beginNodeDrag = (
    event: ReactPointerEvent<SVGGElement>,
    nodeId: string,
  ) => {
    if (layoutMode !== "reseau") return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    interactionRef.current = {
      kind: "node",
      nodeId,
      pointerId: event.pointerId,
      lastClientX: event.clientX,
      lastClientY: event.clientY,
      moved: false,
    }
  }

  const moveNetworkPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const interaction = interactionRef.current
    if (!interaction || interaction.pointerId !== event.pointerId) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const scaleToGraph = GRAPH_WIDTH / bounds.width
    const deltaX = (event.clientX - interaction.lastClientX) * scaleToGraph
    const deltaY = (event.clientY - interaction.lastClientY) * scaleToGraph
    if (Math.abs(deltaX) + Math.abs(deltaY) > 0.8) {
      interaction.moved = true
      suppressClickRef.current = true
    }

    if (interaction.kind === "pan") {
      setNetworkTransform((current) => ({
        ...current,
        x: current.x + deltaX,
        y: current.y + deltaY,
      }))
    } else if (interaction.nodeId) {
      const nodeId = interaction.nodeId
      setDraggedPositions((current) => {
        const position = current[nodeId] ?? networkBasePositions[nodeId]
        if (!position) return current
        return {
          ...current,
          [nodeId]: {
            x: clamp(
              position.x + deltaX / networkTransform.k,
              36,
              GRAPH_WIDTH - 36,
            ),
            y: clamp(
              position.y + deltaY / networkTransform.k,
              36,
              GRAPH_HEIGHT - 36,
            ),
          },
        }
      })
    }

    interaction.lastClientX = event.clientX
    interaction.lastClientY = event.clientY
  }

  const endNetworkPointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const interaction = interactionRef.current
    if (!interaction || interaction.pointerId !== event.pointerId) return
    const moved = interaction.moved
    interactionRef.current = null
    if (moved) {
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)
    }
  }

  const canActivateAfterPointer = () => {
    if (!suppressClickRef.current) return true
    suppressClickRef.current = false
    return false
  }

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
            {layoutMode === "structure"
              ? "Les modes d’action structurent six ensembles lisibles. Les indicateurs sont colorés selon leur pôle thématique."
              : "La disposition libre rapproche les indicateurs qui partagent plusieurs modes d’action. Les positions sont stabilisées pour faciliter la lecture."}
          </p>
        </div>
        <div className="graph-header-actions">
          <div
            className="graph-layout-switch"
            role="group"
            aria-label="Disposition du graphe"
          >
            <button
              type="button"
              aria-pressed={layoutMode === "structure"}
              onClick={() => changeLayout("structure")}
            >
              Structuré
            </button>
            <button
              type="button"
              aria-pressed={layoutMode === "reseau"}
              onClick={() => changeLayout("reseau")}
            >
              Réseau
            </button>
          </div>
          {activeMode && (
            <button
              type="button"
              onClick={() => setActiveModeId(null)}
              className="graph-show-all-button"
            >
              Afficher toutes les relations
            </button>
          )}
        </div>
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

      {layoutMode === "reseau" && (
        <div className="graph-network-toolbar">
          <span>
            Déplacez le fond ou les nœuds. Utilisez Ctrl + molette pour zoomer.
          </span>
          <div
            className="graph-network-toolbar-controls"
            role="group"
            aria-label="Commandes du graphe réseau"
          >
            <button
              type="button"
              onClick={() => zoomNetwork(0.86)}
              aria-label="Réduire le graphe"
              title="Réduire"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => zoomNetwork(1.16)}
              aria-label="Agrandir le graphe"
              title="Agrandir"
            >
              <Plus size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetNetwork}
              aria-label="Recentrer le graphe"
              title="Recentrer"
            >
              <Scan size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <div
        className="indicator-graph-scroll"
        tabIndex={0}
        aria-label="Graphe défilable des relations entre modes d’action VTT et indicateurs"
      >
        <svg
          className={`indicator-graph-canvas${
            layoutMode === "reseau" ? " is-network" : ""
          }`}
          viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
          role="group"
          aria-labelledby="indicator-graph-svg-title indicator-graph-svg-description"
          onWheel={handleNetworkWheel}
          onPointerMove={moveNetworkPointer}
          onPointerUp={endNetworkPointer}
          onPointerCancel={endNetworkPointer}
        >
          <title id="indicator-graph-svg-title">
            Graphe VTT et indicateurs POPGG
          </title>
          <desc id="indicator-graph-svg-description">
            Six modes d’action structurants reliés aux indicateurs dans une
            disposition {layoutMode === "structure" ? "structurée" : "libre"}.
            Les couleurs identifient les pôles Environnement, Mobilité,
            Urbanisation et Gouvernance. Les traits continus représentent les
            liens principaux et les traits interrompus les liens secondaires
            proposés.
          </desc>

          {layoutMode === "reseau" && (
            <rect
              className="graph-network-pan-surface"
              x={0}
              y={0}
              width={GRAPH_WIDTH}
              height={GRAPH_HEIGHT}
              fill="transparent"
              onPointerDown={beginNetworkPan}
            />
          )}

          <g
            transform={
              layoutMode === "reseau"
                ? `translate(${networkTransform.x} ${networkTransform.y}) scale(${networkTransform.k})`
                : undefined
            }
          >
            {layoutMode === "structure" &&
              graph.modes.map((mode) => {
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
                    opacity={
                      activeModeId && activeModeId !== mode.id ? 0.24 : 0.74
                    }
                    vectorEffect="non-scaling-stroke"
                  />
                )
              })}

            <g aria-hidden="true">
              {graph.edges.map((edge) => {
                const source =
                  layoutMode === "reseau"
                    ? getNetworkPosition(edge.source)
                    : modePositions.get(edge.source)
                const target =
                  layoutMode === "reseau"
                    ? getNetworkPosition(edge.target)
                    : indicatorPositions.get(edge.target)
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
                    ? layoutMode === "reseau"
                      ? 0.46
                      : 0.34
                    : layoutMode === "reseau"
                      ? 0.14
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
              const position =
                layoutMode === "reseau"
                  ? getNetworkPosition(node.id)
                  : indicatorPositions.get(node.id)
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
                  onPointerDown={(event) => beginNodeDrag(event, node.id)}
                  onClick={() => {
                    if (canActivateAfterPointer()) onSelect(indicator)
                  }}
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
                    r={layoutMode === "reseau" ? 14 : 21}
                    fill={color.bg}
                    stroke={color.accent}
                    strokeWidth={1.5}
                    vectorEffect="non-scaling-stroke"
                  />
                  {layoutMode === "structure" ? (
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
                  ) : (
                    <text
                      className="graph-network-indicator-label"
                      x={position.x + 20}
                      y={position.y + 3.5}
                      fill="var(--color-text)"
                      fontFamily="'Public Sans', sans-serif"
                      fontSize={10.5}
                      fontWeight={700}
                    >
                      {node.indicatorId}
                    </text>
                  )}
                </g>
              )
            })}

            {graph.modes.map((mode) => {
              const center =
                layoutMode === "reseau"
                  ? getNetworkPosition(mode.id)
                  : modePositions.get(mode.id)!
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
                  onPointerDown={(event) => beginNodeDrag(event, mode.id)}
                  onClick={() => {
                    if (canActivateAfterPointer()) {
                      setActiveModeId(isActive ? null : mode.id)
                    }
                  }}
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
                    r={layoutMode === "reseau" ? 48 : 57}
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
                    r={layoutMode === "reseau" ? 41 : 49}
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
                    fontSize={layoutMode === "reseau" ? 12.5 : 14}
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
          </g>
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
