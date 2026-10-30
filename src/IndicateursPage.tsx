import "@/catalogue.css";
import { linkedData, linkedPolicies, vttKeys, type CatalogueTarget } from "@/data/catalogueRelations";
import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Columns3, Database, FileText, Grid2X2, Landmark, List, Search, SlidersHorizontal, X } from "lucide-react";
import {
  indicateurs,
  poleColors,
  maturiteLabel,
  maturiteColor,
  vttSections,
  type Pole,
  type Liste,
  type FicheIndicateur,
} from "@/data/indicators";
import {
  catalogueMetadata,
  donneesCatalogue,
  indicateursComplementaires,
  politiquesPubliques,
  type DonneeCatalogue,
  type PolitiquePublique,
} from "@/data/workbookCatalogue";

const FICHES_INDICATEURS: FicheIndicateur[] = [...indicateurs, ...indicateursComplementaires];
const POLES: Pole[] = ["Environnement", "Mobilité", "Urbanisation", "Gouvernance", "Social"];
const LISTES: Liste[] = ["L1", "L2", "L3", "L4"];
const DEFAULT_LISTES: Liste[] = ["L1", "L2"];
const LISTE_COLORS: Record<Liste, string> = {
  L1: "var(--color-primary)",
  L2: "var(--color-violet)",
  L3: "var(--color-ochre-strong)",
  L4: "var(--color-text)",
};
const MATURITES = [1, 2, 3, 4] as const;
const VTT_SECTION_KEYS = new Set(vttSections.map((section) => section.key));

const hasDefinedVtt = (ind: FicheIndicateur) => VTT_SECTION_KEYS.has(ind.lienVTT);

const typologieShort: Record<string, string> = {
  "Résultat": "Résultat",
  "Indicateur stratégique": "Stratégique",
  "Moyen": "Moyen",
  "Contexte": "Contexte",
  "Indicateur opérationnel": "Opérationnel",
  "Indicateur d'efficience": "Efficience",
  "Indicateur d’efficience": "Efficience",
  "Stratégique": "Stratégique",
};

type ViewMode = "grille" | "colonnes" | "vtt" | "matrice";
type CardDensity = "mini" | "etendue";
type Presentation = CardDensity;
type CatalogueSection = "indicateurs" | "donnees" | "politiques";
type MaturityFilter = number | "Tous" | "Non renseignée";

// ─── Atoms ───────────────────────────────────────────────────────────────────

function MaturiteDots({ value, size = 9 }: { value: 1 | 2 | 3 | 4 | null; size?: number }) {
  if (value === null) {
    return <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>Maturité non renseignée</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {MATURITES.map((n) => (
        <span
          key={n}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: n <= value ? maturiteColor[value] : "var(--color-border)",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="catalog-filter-chip"
      data-active={active || undefined}
    >
      {color && <span className="catalog-filter-chip-dot" style={{ background: color }} aria-hidden="true" />}
      {children}
    </button>
  );
}

// ─── Mini card ────────────────────────────────────────────────────────────────

function MiniCard({ ind, onClick }: { ind: FicheIndicateur; onClick: () => void }) {
  const c = poleColors[ind.pole];
  const vtt = vttSections.find((s) => s.key === ind.lienVTT);
  return (
    <button
      onClick={onClick}
      className="data-card w-full text-left rounded-2xl overflow-hidden flex flex-col group"
      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
    >
      {/* Header · same as EtendueCard */}
      <div className="px-4 pt-4 pb-3 flex-1" style={{ background: c.bg }}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold tracking-wider" style={{ color: c.accent }}>
            {ind.id}
          </span>
          <div className="flex gap-1.5 shrink-0">
            <span
              className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{
                background: ind.liste === "L1" ? "var(--color-primary)" : "var(--color-surface-translucent)",
                color: ind.liste === "L1" ? "var(--color-surface)" : c.accent,
              }}
            >
              {ind.liste}
            </span>
            <span
              className="text-[11px] px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--color-surface-translucent)", color: c.accent }}
            >
              {typologieShort[ind.typologie] ?? ind.typologie}
            </span>
          </div>
        </div>
        <h3
          className="text-left"
          style={{
            fontFamily: "'Newsreader', serif",
            fontWeight: 700,
            fontSize: 14,
            color: c.accent,
            lineHeight: 1.3,
          }}
        >
          {ind.nom}
        </h3>
        <span className="text-[11px] mt-0.5 inline-block" style={{ color: c.accent }}>
          {ind.pole}
        </span>
      </div>

      {/* Footer · maturité + VTT only */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--color-border-subtle)" }}
      >
        <MaturiteDots value={ind.maturite} size={8} />
        <div className="flex items-center gap-1.5">
          {vtt && (
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: vtt.bg, color: vtt.accent }}>
              {vtt.label}
            </span>
          )}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="opacity-0 group-hover:opacity-40 transition-opacity">
            <path d="M4 2l4 4-4 4" stroke="var(--color-primary-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </button>
  );
}

// ─── Étendue card ─────────────────────────────────────────────────────────────

function EtendueCard({ ind, onClick }: { ind: FicheIndicateur; onClick: () => void }) {
  const c = poleColors[ind.pole];
  const vtt = vttSections.find((s) => s.key === ind.lienVTT);
  return (
    <button
      onClick={onClick}
      className="data-card w-full text-left rounded-2xl overflow-hidden flex flex-col group"
      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
    >
      {/* Top stripe */}
      <div className="px-4 pt-4 pb-3" style={{ background: c.bg }}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold tracking-wider" style={{ color: c.accent }}>
            {ind.id}
          </span>
          <div className="flex gap-1.5 shrink-0">
            <span
              className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{
                background: ind.liste === "L1" ? "var(--color-primary)" : "var(--color-surface-translucent)",
                color: ind.liste === "L1" ? "var(--color-surface)" : c.accent,
              }}
            >
              {ind.liste}
            </span>
            <span
              className="text-[11px] px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--color-surface-translucent)", color: c.accent }}
            >
              {typologieShort[ind.typologie] ?? ind.typologie}
            </span>
          </div>
        </div>
        <h3
          className="text-left"
          style={{
            fontFamily: "'Newsreader', serif",
            fontWeight: 700,
            fontSize: 14,
            color: c.accent,
            lineHeight: 1.3,
          }}
        >
          {ind.nom}
        </h3>
        <span className="text-[11px] mt-0.5 inline-block" style={{ color: c.accent }}>
          {ind.pole}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex flex-col gap-2.5 flex-1" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          {[
            ["Unité", ind.unite],
            ["Rafraîchissement", ind.rafraichissement],
            ["Granularité", ind.granularite],
            ["Valeur cible", ind.valeurCible],
          ].map(([k, v]) => (
            <div key={k}>
              <span className="block text-[11px] uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>{k}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--color-primary-strong)" }}>{v || "·"}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid var(--color-border-faint)" }}>
          <MaturiteDots value={ind.maturite} size={8} />
          <div className="flex items-center gap-1.5">
            {vtt && (
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: vtt.bg, color: vtt.accent }}>
                {vtt.label}
              </span>
            )}
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              className="opacity-0 group-hover:opacity-40 transition-opacity"
            >
              <path d="M4 2l4 4-4 4" stroke="var(--color-primary-strong)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Columns view ────────────────────────────────────────────────────────────

function ColumnsView({ items, onSelect }: { items: FicheIndicateur[]; onSelect: (ind: FicheIndicateur) => void }) {
  const stages: Array<{ key: string; value: 1 | 2 | 3 | 4 | null; title: string; label: string; color: string }> = MATURITES.map((m) => ({
    key: String(m),
    value: m,
    title: `Maturité ${m}`,
    label: maturiteLabel[m],
    color: maturiteColor[m],
  }));

  if (items.some((ind) => ind.maturite === null)) {
    stages.push({
      key: "unrated",
      value: null,
      title: "Non renseignée",
      label: "Maturité à qualifier",
      color: "var(--color-text-muted)",
    });
  }

  return (
    <section aria-labelledby="columns-view-title">
      <h2 id="columns-view-title" className="sr-only">Indicateurs par niveau de maturité</h2>
      <div
        className="indicator-board-scroll"
        role="region"
        aria-label="Tableau en colonnes des indicateurs par niveau de maturité"
        tabIndex={0}
      >
        <div className="indicator-board">
          {stages.map((stage) => {
            const stageItems = items.filter((ind) => ind.maturite === stage.value);

            return (
              <section key={stage.key} className="indicator-board-column" aria-labelledby={`board-stage-${stage.key}`}>
                <header className="indicator-board-column-header">
                  <span className="indicator-board-stage-dot" style={{ background: stage.color }} aria-hidden="true" />
                  <span className="indicator-board-stage-label">
                    <strong id={`board-stage-${stage.key}`}>{stage.title}</strong>
                    <span>{stage.label}</span>
                  </span>
                  <span className="indicator-board-count">{stageItems.length}</span>
                </header>

                <div className="indicator-board-stack">
                  {stageItems.length === 0 ? (
                    <p className="indicator-board-empty">Aucun indicateur avec les filtres actifs.</p>
                  ) : (
                    stageItems.map((ind) => {
                      const pole = poleColors[ind.pole];
                      const vtt = vttSections.find((section) => section.key === ind.lienVTT);

                      return (
                        <button
                          key={ind.id}
                          type="button"
                          className="indicator-board-card"
                          onClick={() => onSelect(ind)}
                          aria-label={`Ouvrir la fiche ${ind.id} · ${ind.nom}`}
                        >
                          <span className="indicator-board-card-meta">
                            <span className="indicator-board-card-id" style={{ color: pole.accent }}>{ind.id}</span>
                            <span className="indicator-board-pole" style={{ background: pole.bg, color: pole.accent }}>
                              <span style={{ background: pole.light }} aria-hidden="true" />
                              {ind.pole}
                            </span>
                            <span className="indicator-board-list">{ind.liste}</span>
                          </span>
                          <strong>{ind.nom}</strong>
                          <span className="indicator-board-card-footer">
                            <span>{vtt?.label ?? "Mode d’action non renseigné"}</span>
                            <span>{typologieShort[ind.typologie] ?? ind.typologie}</span>
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Sidebar helpers ─────────────────────────────────────────────────────────

function SidebarSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <h4
        className="text-[11px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--color-text-muted)" }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
      {children}
    </section>
  );
}

function MetaCell({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 ${full ? "col-span-2" : ""}`}
      style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}
    >
      <span className="block text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span className="text-xs font-semibold" style={{ color: "var(--color-primary-strong)" }}>{value || "·"}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ ind, onClose, onNavigate }: { ind: FicheIndicateur; onClose: () => void; onNavigate: (target: CatalogueTarget) => void }) {
  const c = poleColors[ind.pole];
  const vtt = vttSections.find((s) => s.key === ind.lienVTT);
  const secondaryKeys = vttKeys(ind).filter((key) => key !== ind.lienVTT);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: "var(--color-overlay)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-[70] flex flex-col overflow-hidden"
        style={{
          width: "min(460px, 92vw)",
          background: "var(--color-canvas)",
          borderLeft: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Sidebar header */}
        <div className="px-6 pt-5 pb-4 shrink-0" style={{ background: c.bg, borderBottom: "1.5px solid var(--color-border)" }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-bold tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: "var(--color-surface-translucent)", color: c.accent }}
              >
                {ind.id}
              </span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: ind.liste === "L1" ? "var(--color-primary)" : "var(--color-surface-translucent)",
                  color: ind.liste === "L1" ? "var(--color-surface)" : c.accent,
                }}
              >
                {ind.liste} · {ind.horizon}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--color-surface-translucent)", color: c.accent }}>
                {typologieShort[ind.typologie] ?? ind.typologie}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer la fiche indicateur"
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:opacity-60 transition-opacity"
              style={{ background: "var(--color-border)", color: c.accent }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <h2
            style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 700,
              fontSize: 22,
              color: c.accent,
              lineHeight: 1.2,
            }}
          >
            {ind.nom}
          </h2>
          <p className="text-xs mt-1 font-semibold" style={{ color: c.accent, opacity: 0.65 }}>
            {ind.pole}
          </p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">

          {/* Définition */}
          <SidebarSection label="Définition">
            <p className="text-sm leading-relaxed" style={{ color: ind.definition ? "var(--color-primary-strong)" : "var(--color-text-muted)" }}>
              {ind.definition || "Non renseignée dans la liste source."}
            </p>
          </SidebarSection>

          {(ind.sousTheme || ind.documentsReference) && (
            <SidebarSection label="Positionnement">
              <div className="flex flex-col gap-2">
                {ind.sousTheme && <MetaCell label="Sous-thème" value={ind.sousTheme} full />}
                {ind.documentsReference && <MetaCell label="Documents de référence" value={ind.documentsReference} full />}
              </div>
            </SidebarSection>
          )}

          <SidebarSection label="Liens du référentiel">
            <p className="text-xs mb-3">Liens du classeur, à confirmer avec les pôles.</p>
            <RelationLinks label="Données sources" targets={linkedData(ind, donneesCatalogue).map((d) => ({kind: "donnees", id: d.id, label: d.titre}))} onNavigate={onNavigate} />
            <RelationLinks label="Politiques publiques" targets={linkedPolicies(ind, politiquesPubliques).map((p) => ({kind: "politiques", id: p.id, label: p.details || p.theme}))} onNavigate={onNavigate} />
          </SidebarSection>

          {/* Maturité */}
          <SidebarSection label="Maturité · échelle provisoire">
            {ind.maturite === null ? (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Non renseignée dans la liste source.</p>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {MATURITES.map((n) => (
                    <span key={n} style={{ width: 13, height: 13, borderRadius: "50%", background: n <= ind.maturite! ? maturiteColor[ind.maturite!] : "var(--color-border)", display: "inline-block" }} />
                  ))}
                </div>
                <span className="text-sm font-semibold" style={{ color: maturiteColor[ind.maturite] }}>
                  {ind.maturite} · {maturiteLabel[ind.maturite]}
                </span>
              </div>
            )}
          </SidebarSection>

          {/* Caractéristiques mesure */}
          {(ind.unite || ind.rafraichissement || ind.granularite || ind.anneesDisponibilite || ind.valeurCible || ind.spatialisation !== null) && (
            <SidebarSection label="Mesure">
              <div className="grid grid-cols-2 gap-2">
                {([
                  ["Unité", ind.unite],
                  ["Rafraîchissement", ind.rafraichissement],
                  ["Granularité", ind.granularite],
                  ["Années de disponibilité", ind.anneesDisponibilite],
                  ["Valeur cible", ind.valeurCible],
                  ["Spatialisation", ind.spatialisation === true ? "Oui" : ind.spatialisation === false ? "Non" : "·"],
                ] as [string, string][]).map(([k, v]) => (
                  <MetaCell key={k} label={k} value={v} />
                ))}
              </div>
            </SidebarSection>
          )}

          {/* Méthode */}
          {(ind.methodologie || ind.formule) && (
            <SidebarSection label="Méthode de calcul">
              {ind.methodologie && <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--color-primary-strong)" }}>{ind.methodologie}</p>}
              {ind.formule && (
                <code className="block text-xs px-3 py-2 rounded-lg font-mono" style={{ background: "var(--color-border-faint)", color: "var(--color-primary-strong)" }}>
                  {ind.formule}
                </code>
              )}
            </SidebarSection>
          )}

          {/* Sources de données */}
          {(ind.donnee || ind.pointeurDonnees) && (
            <SidebarSection label="Sources de données">
              <div className="flex flex-col gap-2">
                {ind.donnee && <MetaCell label="Donnée" value={ind.donnee} full />}
                {ind.pointeurDonnees && (
                  <div>
                    <span className="block text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "var(--color-text-muted)" }}>Pointeur / Lien</span>
                    <p className="text-xs leading-relaxed break-words" style={{ color: "var(--color-primary-strong)", wordBreak: "break-word" }}>{ind.pointeurDonnees}</p>
                  </div>
                )}
              </div>
            </SidebarSection>
          )}

          {/* Modes d’action VTT proposés */}
          {(vtt || secondaryKeys.length > 0) && (
            <SidebarSection label="Rattachement VTT proposé">
              <div className="flex flex-col gap-2">
                {vtt && <div className="rounded-xl px-4 py-3" style={{ background: vtt.bg, border: "1px solid var(--color-border-subtle)" }}>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wide" style={{ color: vtt.accent, opacity: 0.65 }}>Mode d’action principal</span>
                    <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 17, color: vtt.accent }}>{vtt.label}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: vtt.accent }}>{vtt.question}</p>
                </div>}
                {secondaryKeys.map((key) => {
                  const secondary = vttSections.find((section) => section.key === key);
                  return <div key={key} className="rounded-xl px-4 py-3" style={{ background: secondary?.bg ?? "var(--color-border-faint)" }}>
                    <span className="block text-xs">Rattachement secondaire proposé</span>
                    <span className="text-sm font-semibold">{secondary?.label ?? key}</span>
                    {!secondary && <p className="text-xs mt-1">Libellé source à qualifier : hors des six modes VTT.</p>}
                  </div>;
                })}
              </div>
            </SidebarSection>
          )}

          {/* Politique publique */}
          {(ind.idPolitique1 || ind.documentPolitique1) && (
            <SidebarSection label="Politique publique de référence">
              <div className="rounded-xl px-4 py-3 flex flex-col gap-2" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)" }}>
                {ind.idPolitique1 && (
                  <span className="text-[11px] font-bold tracking-wider" style={{ color: c.accent }}>{ind.idPolitique1}</span>
                )}
                {ind.documentPolitique1 && (
                  <span className="text-xs font-semibold" style={{ color: "var(--color-primary-strong)" }}>{ind.documentPolitique1}</span>
                )}
                {ind.descriptionPolitique1 && (
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-text)", opacity: 0.75 }}>{ind.descriptionPolitique1}</p>
                )}
              </div>
            </SidebarSection>
          )}

          {/* Liste & débat */}
          <SidebarSection label="Classement &amp; concertation">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: ind.liste === "L1" ? "var(--color-primary-strong)" : c.bg, color: ind.liste === "L1" ? "var(--color-accent-soft)" : c.accent }}>
                  {ind.liste} · {ind.horizon}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: ind.debattu ? "var(--color-primary-soft)" : "var(--color-border-faint)", color: ind.debattu ? "var(--color-primary-strong)" : "var(--color-text)" }}>
                  {ind.debattu ? "Débattu en atelier" : "Non débattu en atelier"}
                </span>
              </div>
            </div>
          </SidebarSection>

          {(ind.droitsDiffusion || ind.statutRaci) && (
            <SidebarSection label="Organisation de la production">
              <div className="flex flex-col gap-2">
                {ind.droitsDiffusion && <MetaCell label="Droits et diffusion" value={ind.droitsDiffusion} full />}
                {ind.statutRaci && <MetaCell label="Statut RACI" value={ind.statutRaci} full />}
              </div>
            </SidebarSection>
          )}

        </div>

        {/* Footer nav */}
        <div
          className="px-6 py-4 flex items-center justify-between shrink-0"
          style={{ borderTop: "1px solid var(--color-border-subtle)", background: "var(--color-canvas)" }}
        >
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {ind.pole} · {ind.liste}
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-semibold hover:opacity-60 transition-opacity"
            style={{ color: "var(--color-primary)" }}
          >
            Fermer
            <svg aria-hidden="true" width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── VTT view ─────────────────────────────────────────────────────────────────

function UnclassifiedIndicatorsSection({
  title,
  description,
  items,
  onSelect,
}: {
  title: string;
  description: string;
  items: FicheIndicateur[];
  onSelect: (ind: FicheIndicateur) => void;
}) {
  if (items.length === 0) return null;

  return (
    <details className="catalog-unclassified-section">
      <summary className="catalog-unclassified-summary">
        <span className="catalog-unclassified-heading">
          <strong>{title}</strong>
          <span>{description}</span>
        </span>
        <span className="catalog-unclassified-count">
          {items.length} indicateur{items.length !== 1 ? "s" : ""}
        </span>
        <ChevronDown className="catalog-unclassified-chevron" aria-hidden="true" size={18} strokeWidth={1.8} />
      </summary>

      <div className="catalog-unclassified-grid">
        {items.map((ind) => {
          const pole = poleColors[ind.pole];
          const reasons = [
            ind.maturite === null ? "Maturité non renseignée" : "",
            !hasDefinedVtt(ind) ? "Mode d’action non renseigné" : "",
          ].filter(Boolean);

          return (
            <button
              key={ind.id}
              type="button"
              className="catalog-unclassified-item"
              onClick={() => onSelect(ind)}
              aria-label={`Ouvrir la fiche ${ind.id} · ${ind.nom}`}
            >
              <span className="catalog-unclassified-item-heading">
                <span style={{ color: pole.accent }}>{ind.id}</span>
                <strong>{ind.nom}</strong>
              </span>
              <span className="catalog-unclassified-meta">
                <span className="catalog-unclassified-pole" style={{ background: pole.light }} aria-hidden="true" />
                <span>{ind.pole}</span>
                <span>·</span>
                <span>{ind.liste}</span>
                {reasons.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{reasons.join(" · ")}</span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </details>
  );
}

function VTTView({
  items,
  density,
  filterMaturite,
  onMaturiteClick,
  onSelect,
}: {
  items: FicheIndicateur[];
  density: CardDensity;
  filterMaturite: MaturityFilter;
  onMaturiteClick: (m: MaturityFilter) => void;
  onSelect: (ind: FicheIndicateur) => void;
}) {
  const classifiedItems = items.filter((ind) => ind.maturite !== null && vttKeys(ind).some((key) => VTT_SECTION_KEYS.has(key)));
  const otherItems = items.filter((ind) => ind.maturite === null || !vttKeys(ind).some((key) => VTT_SECTION_KEYS.has(key)));

  return (
    <div className="flex flex-col gap-2">
      <p className="catalog-count-note">Un indicateur peut apparaître dans plusieurs modes. Le compteur porte sur les indicateurs uniques.</p>
      {classifiedItems.length > 0 && vttSections.map((section) => {
        const sectionItems = classifiedItems.filter((i) => vttKeys(i).includes(section.key));

        return (
          <div
            key={section.key}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--color-border-subtle)" }}
          >
            {/* Section header */}
            <div
              className="px-6 py-5 flex items-center gap-4"
              style={{ background: section.bg, borderBottom: "1px solid var(--color-border-subtle)" }}
            >
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: "'Newsreader', serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: section.accent,
                    lineHeight: 1.1,
                  }}
                >
                  {section.label}
                </h3>
                <p className="text-xs mt-0.5 font-semibold" style={{ color: section.accent, opacity: 0.55 }}>
                  {section.axe} · {sectionItems.length} {sectionItems.length === 1 ? "indicateur lié" : "indicateurs liés"} (principaux et secondaires)
                </p>
              </div>
              {/* Maturité legend inline */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: section.accent }}>
                  Maturité provisoire
                </span>
                {MATURITES.map((m) => {
                  const count = sectionItems.filter((i) => i.maturite === m).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={m}
                      onClick={() => onMaturiteClick(filterMaturite === m ? "Tous" : m)}
                      aria-pressed={filterMaturite === m}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors"
                      style={{
                        background: filterMaturite === m ? maturiteColor[m] : "var(--color-surface-translucent)",
                        color: filterMaturite === m ? "var(--color-surface)" : section.accent,
                        border: `1px solid ${filterMaturite === m ? maturiteColor[m] : "var(--color-border)"}`,
                      }}
                      title={`${maturiteLabel[m as 1|2|3|4]} (${count})`}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: maturiteColor[m as 1|2|3|4], display: "inline-block" }} />
                      {count}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section body · flat list, no maturité sub-groups */}
            <div className="px-6 py-5" style={{ background: "var(--color-surface-soft)" }}>
              {sectionItems.length === 0 ? (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--color-surface)", color: "var(--color-text-muted)", border: "1px solid var(--color-border-subtle)" }}>
                  Aucun rattachement identifié dans la sélection actuelle.
                </div>
              ) : density === "mini" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionItems.map((ind) => <div key={ind.id}><p className="text-xs mb-2">{ind.lienVTT === section.key ? "Principal" : "Secondaire"} dans ce mode</p><MiniCard ind={ind} onClick={() => onSelect(ind)} /></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionItems.map((ind) => <div key={ind.id}><p className="text-xs mb-2">{ind.lienVTT === section.key ? "Principal" : "Secondaire"} dans ce mode</p><EtendueCard ind={ind} onClick={() => onSelect(ind)} /></div>)}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <UnclassifiedIndicatorsSection
        title="Autres indicateurs"
        description="Maturité non renseignée ou aucun rattachement aux six modes VTT."
        items={otherItems}
        onSelect={onSelect}
      />
    </div>
  );
}

// ─── Matrice view ─────────────────────────────────────────────────────────────

function MatriceView({
  items,
  onCellClick,
  activeCell,
  onSelect,
}: {
  items: FicheIndicateur[];
  onCellClick: (vtt: string, m: number) => void;
  activeCell: { vtt: string; m: number } | null;
  onSelect: (ind: FicheIndicateur) => void;
}) {
  const matrixItems = items.filter((ind) => ind.maturite !== null && hasDefinedVtt(ind));
  const outsideMatrixItems = items.filter((ind) => ind.maturite === null || !hasDefinedVtt(ind));

  return (
    <>
      <p className="catalog-count-note">Rattachements principaux uniquement. Les liens secondaires sont visibles dans la vue Par VTT.</p>
      <div className="maturity-matrix-scroll" tabIndex={0} aria-label="Matrice VTT, défilement horizontal si nécessaire">
        <table className="maturity-matrix">
        <caption className="sr-only">
          Indicateurs classés par mode d’action VTT principal proposé et niveau de maturité.
        </caption>
        <thead>
          <tr>
            <th className="maturity-matrix-mode-heading">
              Mode d’action VTT principal proposé
            </th>
            {MATURITES.map((m) => (
              <th key={m} className="maturity-matrix-level-heading">
                <div className="maturity-matrix-level-label">
                  <span className="maturity-matrix-level-dot" style={{ background: maturiteColor[m] }} />
                  <strong>Maturité {m}</strong>
                  <span>{maturiteLabel[m]}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vttSections.map((section, si) => {
            const rowItems = matrixItems.filter((i) => i.lienVTT === section.key);
            return (
              <tr
                key={section.key}
                className="maturity-matrix-row"
                style={{ borderTopColor: si === 0 ? "var(--color-border)" : "var(--color-border-subtle)" }}
              >
                <th scope="row" className="maturity-matrix-mode-cell">
                  <div className="maturity-matrix-mode-label">
                    <span style={{ color: section.accent }}>
                      {section.label}
                    </span>
                    <small style={{ color: section.accent }}>
                      {rowItems.length} indicateur{rowItems.length !== 1 ? "s" : ""}
                    </small>
                  </div>
                </th>
                {MATURITES.map((m) => {
                  const cellItems = rowItems.filter((i) => i.maturite === m);
                  const isActive = activeCell?.vtt === section.key && activeCell?.m === m;
                  const isEmpty = cellItems.length === 0;
                  return (
                    <td key={m} className="maturity-matrix-data-cell">
                      <button
                        onClick={() => !isEmpty && onCellClick(section.key, m)}
                        disabled={isEmpty}
                        aria-pressed={!isEmpty ? isActive : undefined}
                        aria-label={isEmpty ? `${section.label}, maturité ${m} : aucun indicateur` : `${section.label}, maturité ${m} : ${cellItems.length} indicateur${cellItems.length !== 1 ? "s" : ""}`}
                        className={`maturity-matrix-cell ${isEmpty ? "is-empty" : "is-filled"} ${isActive ? "is-active" : ""}`}
                        style={isActive ? { background: section.bg, borderColor: section.accent } : undefined}
                      >
                        {isEmpty ? (
                          <span aria-hidden="true">·</span>
                        ) : (
                          <span className="maturity-matrix-indicators" aria-hidden="true">
                            {cellItems.map((ind) => {
                              const pole = poleColors[ind.pole];
                              return (
                                <span
                                  key={ind.id}
                                  className="maturity-matrix-indicator"
                                  style={{ borderInlineStartColor: pole.light }}
                                  title={`${ind.id} · ${ind.nom}`}
                                >
                                  <span className="maturity-matrix-indicator-id" style={{ color: pole.accent }}>{ind.id}</span>
                                  <span className="maturity-matrix-indicator-name">{ind.nom}</span>
                                </span>
                              );
                            })}
                          </span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className="maturity-matrix-total-label">Total</th>
            {MATURITES.map((m) => {
              const count = matrixItems.filter((i) => i.maturite === m).length;
              return (
                <td key={m} className="maturity-matrix-total-value">
                  <span style={{ color: count > 0 ? maturiteColor[m] : "var(--color-text)" }}>
                    {count}
                  </span>
                </td>
              );
            })}
          </tr>
        </tfoot>
        </table>
      </div>
      <UnclassifiedIndicatorsSection
        title="Indicateurs hors matrice"
        description="Niveau de maturité ou mode d’action VTT principal non renseigné."
        items={outsideMatrixItems}
        onSelect={onSelect}
      />
    </>
  );
}

// ─── Données et politiques publiques ─────────────────────────────────────────

function RelationLinks({ label, targets, onNavigate }: { label: string; targets: (CatalogueTarget & {label: string})[]; onNavigate: (target: CatalogueTarget) => void }) {
  return <div className="catalog-relations">
    <span className="text-xs">{label}</span>
    {targets.length ? targets.map((target) => <button key={target.id} type="button" onClick={() => onNavigate(target)}>
      {target.id} · {target.label}
    </button>) : <p className="text-xs">Aucun lien identifié dans le classeur.</p>}
  </div>;
}

function RegisterValue({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <span className="block text-[11px] uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text)" }}>{value}</p>
    </div>
  );
}

function DonneesView({ items, focusId, onNavigate }: { items: DonneeCatalogue[]; focusId: string; onNavigate: (target: CatalogueTarget) => void }) {
  return (
    <section aria-labelledby="donnees-title">
      <header className="mb-6 max-w-3xl">
        <h2 id="donnees-title" style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 28, color: "var(--color-text-strong)" }}>
          Catalogue de données
        </h2>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          Sources mobilisées par les indicateurs. Ouvrez une ligne pour voir leur disponibilité et l’organisation de la collecte.
        </p>
      </header>

      <div className="catalog-register" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div className="catalog-register-head catalog-register-data" aria-hidden="true">
          <span>ID</span><span>Donnée</span><span>Pôle</span><span>Fournisseur</span><span>Couverture</span>
        </div>
        {items.map((item) => (
          <details key={item.id} id={`record-${item.id}`} open={focusId === item.id || undefined} className="catalog-register-row">
            <summary className="catalog-register-summary catalog-register-data">
              <span className="text-xs font-bold tracking-wide" style={{ color: "var(--color-primary)" }}>{item.id}</span>
              <span className="font-semibold" style={{ color: "var(--color-text-strong)" }}>{item.titre}</span>
              <span>{item.pole || "Non renseigné"}</span>
              <span>{item.fournisseurs || "Non renseigné"}</span>
              <span>{item.couverture || "Non renseignée"}</span>
            </summary>
            <div className="catalog-register-detail">
              <div className="grid gap-5 md:grid-cols-3">
                <RegisterValue label="Homogénéité" value={item.homogeneite} />
                <RelationLinks label="Indicateurs concernés" targets={FICHES_INDICATEURS.filter((ind) => linkedData(ind, [item]).length).map((ind) => ({kind: "indicateurs", id: ind.id, label: ind.nom}))} onNavigate={onNavigate} />
                <RegisterValue label="Fournisseur confirmé" value={item.fournisseurConfirme} />
              </div>
              {item.territoires.length > 0 && (
                <div className="mt-5">
                  <span className="block text-[11px] uppercase tracking-wide mb-2" style={{ color: "var(--color-text-muted)" }}>Disponibilité territoriale</span>
                  <div className="grid gap-3 md:grid-cols-2">
                    {item.territoires.map((source) => (
                      <div key={source.territoire} className="catalog-source-line">
                        <span className="text-xs font-semibold" style={{ color: "var(--color-primary-strong)" }}>{source.territoire}</span>
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {[source.donnee, source.fournisseur, source.frequence, source.granularite].filter(Boolean).join(" · ")}
                        </span>
                        {source.lien && (
                          source.lien.startsWith("http") ? (
                            <a
                              href={source.lien}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold underline underline-offset-2"
                              style={{ color: "var(--color-primary)" }}
                            >
                              Ouvrir la source
                            </a>
                          ) : (
                            <span className="text-xs break-all" style={{ color: "var(--color-primary)" }}>{source.lien}</span>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-5 mt-5 md:grid-cols-3">
                <RegisterValue label="Droits de diffusion" value={item.droits} />
                <RegisterValue label="Procédure d’accès" value={item.procedureAcces} />
                <RegisterValue label="Calendrier de collecte" value={item.calendrierCollecte} />
                <RegisterValue label="Contrôle qualité" value={item.controleQualite} />
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function PolitiquesView({ items, focusId, onNavigate }: { items: PolitiquePublique[]; focusId: string; onNavigate: (target: CatalogueTarget) => void }) {
  return (
    <section aria-labelledby="politiques-title">
      <header className="mb-6 max-w-3xl">
        <h2 id="politiques-title" style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 28, color: "var(--color-text-strong)" }}>
          Registre des politiques publiques
        </h2>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          Objectifs recensés dans les documents de référence. Ouvrez une ligne pour voir les indicateurs et modes d’action associés.
        </p>
      </header>

      <div className="catalog-register" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
        <div className="catalog-register-head catalog-register-policy" aria-hidden="true">
          <span>ID</span><span>Objectif ou orientation</span><span>Document</span><span>Mode d’action VTT</span>
        </div>
        {items.map((item) => (
          <details key={item.id} id={`record-${item.id}`} open={focusId === item.id || undefined} className="catalog-register-row">
            <summary className="catalog-register-summary catalog-register-policy">
              <span className="text-xs font-bold tracking-wide" style={{ color: "var(--color-primary)" }}>{item.id}</span>
              <span className="font-semibold catalog-register-description" style={{ color: "var(--color-text-strong)" }}>{item.details || item.theme}</span>
              <span>{item.document || "Non renseigné"}</span>
              <span>{item.lienVTT || "Non renseigné"}</span>
            </summary>
            <div className="catalog-register-detail grid gap-5 md:grid-cols-2">
              <RegisterValue label="Thème" value={item.theme} />
              <RegisterValue label="Sous-thème" value={item.sousTheme} />
              <RelationLinks label="Indicateurs associés" targets={FICHES_INDICATEURS.filter((ind) => linkedPolicies(ind, [item]).length).map((ind) => ({kind: "indicateurs", id: ind.id, label: ind.nom}))} onNavigate={onNavigate} />
              <RegisterValue label="Liste de priorisation" value={item.listePriorisation} />
              <RegisterValue label="Lien avec la Charte de transition" value={item.lienCharteTransition} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── Density toggle ───────────────────────────────────────────────────────────

function PresentationToggle({ value, onChange }: { value: Presentation; onChange: (presentation: Presentation) => void }) {
  const options = [
    { id: "mini", label: "Mini", icon: List },
    { id: "etendue", label: "Étendue", icon: Grid2X2 },

  ] as const;

  return (
    <div
      className="catalog-density-switch"
      role="group"
      aria-label="Densité des fiches"
    >
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className="catalog-density-option"
          data-active={value === id || undefined}
          title={`Vue ${label.toLowerCase()}`}
        >
          <Icon aria-hidden="true" size={13} strokeWidth={1.8} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function IndicateursPage({ onBack }: { onBack: () => void }) {
  const [catalogueSection, setCatalogueSection] = useState<CatalogueSection>("indicateurs");
  const [viewMode, setViewMode] = useState<ViewMode>("grille");
  const [presentation, setPresentation] = useState<Presentation>("mini");
  const [filterPole, setFilterPole] = useState<Pole | "Tous">("Tous");
  const [filterListes, setFilterListes] = useState<Liste[]>(DEFAULT_LISTES);
  const [filterMaturite, setFilterMaturite] = useState<MaturityFilter>("Tous");
  const [search, setSearch] = useState("");
  const [registerSearch, setRegisterSearch] = useState("");
  const [selected, setSelected] = useState<FicheIndicateur | null>(null);
  const [activeMatrixCell, setActiveMatrixCell] = useState<{ vtt: string; m: number } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [focusRecord, setFocusRecord] = useState("");
  const [trail, setTrail] = useState<{section: CatalogueSection; query: string; record: string; indicator: FicheIndicateur | null; scroll: number}[]>([]);
  function navigate(target: CatalogueTarget) {
    setTrail((entries) => [...entries, {section: catalogueSection, query: registerSearch, record: focusRecord, indicator: selected, scroll: window.scrollY}]);
    if (target.kind === "indicateurs") {
      setSelected(FICHES_INDICATEURS.find((ind) => ind.id === target.id) ?? null);
    } else {
      setSelected(null); setCatalogueSection(target.kind); setRegisterSearch(target.id); setFocusRecord(target.id);
    }
  }
  function returnToContext() {
    const previous = trail[trail.length - 1];
    if (!previous) {setSelected(null); return;}
    setCatalogueSection(previous.section); setRegisterSearch(previous.query); setFocusRecord(previous.record); setSelected(previous.indicator);
    setTrail((entries) => entries.slice(0, -1));
    requestAnimationFrame(() => window.scrollTo({top: previous.scroll, behavior: "instant"}));
  }
  useEffect(() => {
    if (focusRecord) document.getElementById(`record-${focusRecord}`)?.querySelector("summary")?.focus();
  }, [focusRecord, catalogueSection]);
  function resetFilters() {
    setSearch(""); setFilterPole("Tous"); setFilterListes(DEFAULT_LISTES); setFilterMaturite("Tous"); setActiveMatrixCell(null);
  }

  const baseFiltered = useMemo(() => {
    return FICHES_INDICATEURS.filter((ind) => {
      if (filterPole !== "Tous" && ind.pole !== filterPole) return false;
      if (!filterListes.includes(ind.liste)) return false;
      if (filterMaturite === "Non renseignée" && ind.maturite !== null) return false;
      if (typeof filterMaturite === "number" && ind.maturite !== filterMaturite) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [ind.nom, ind.id, ind.definition, ...vttKeys(ind), ind.sousTheme, ind.documentPolitique1].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [filterPole, filterListes, filterMaturite, search]);

  const filteredDonnees = useMemo(() => {
    const q = registerSearch.trim().toLowerCase();
    if (!q) return donneesCatalogue;
    const exact = donneesCatalogue.find((item) => item.id.toLowerCase() === q);
    if (exact) return [exact];
    return donneesCatalogue.filter((item) =>
      [item.id, item.titre, item.pole, item.fournisseurs, item.indicateurs, item.couverture]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [registerSearch]);

  const filteredPolitiques = useMemo(() => {
    const q = registerSearch.trim().toLowerCase();
    if (!q) return politiquesPubliques;
    const exact = politiquesPubliques.find((item) => item.id.toLowerCase() === q);
    if (exact) return [exact];
    return politiquesPubliques.filter((item) =>
      [item.id, item.document, item.theme, item.sousTheme, item.details, item.indicateurs, item.lienVTT]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [registerSearch]);

  const matrixFiltered = useMemo(() => {
    if (!activeMatrixCell) return [];
    return baseFiltered.filter(
      (i) => i.lienVTT === activeMatrixCell.vtt && i.maturite === activeMatrixCell.m
    );
  }, [baseFiltered, activeMatrixCell]);

  const statsMaturite = MATURITES.map((maturite) => ({
    label: `Maturité ${maturite} · ${maturiteLabel[maturite]}`,
    value: indicateurs.filter((i) => i.maturite === maturite).length,
  }));
  const allListesSelected = filterListes.length === LISTES.length;
  const hasUnratedIndicators = filterListes.some((liste) => liste === "L3" || liste === "L4");
  const usesDefaultListes = filterListes.length === DEFAULT_LISTES.length && DEFAULT_LISTES.every((liste) => filterListes.includes(liste));
  const activeFilterCount = Number(filterPole !== "Tous") + Number(!usesDefaultListes) + Number(filterMaturite !== "Tous");
  const hasActiveFilters = activeFilterCount > 0 || search.length > 0;
  const cardDensity: CardDensity = presentation;

  const toggleListe = (liste: Liste) => {
    setFilterListes((current) =>
      current.includes(liste)
        ? current.filter((value) => value !== liste)
        : LISTES.filter((value) => [...current, liste].includes(value))
    );
    setActiveMatrixCell(null);
  };

  const viewButtons: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "grille",
      label: "Grille",
      icon: <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="7.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="0.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="7.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>,
    },
    {
      id: "colonnes",
      label: "Colonnes",
      icon: <Columns3 aria-hidden="true" size={13} strokeWidth={1.8} />,
    },
    {
      id: "vtt",
      label: "Par VTT",
      icon: <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="0.5" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="0.5" y="5" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="0.5" y="9.5" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>,
    },
    {
      id: "matrice",
      label: "Matrice",
      icon: <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M1 4.5h11M1 8.5h11M4.5 1v11M8.5 1v11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    },
  ];

  return (
    <main className="min-h-full" style={{ background: "var(--color-canvas)", fontFamily: "'Public Sans', sans-serif" }}>

      {/* Sidebar */}
      {selected && <Sidebar key={selected.id} ind={selected} onClose={returnToContext} onNavigate={navigate} />}

      {/* Page header */}
      <div className="catalog-page-header" style={{ background: "var(--color-primary-soft-strong)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="catalog-page-header-inner max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="page-back flex items-center gap-2 text-xs font-semibold mb-3 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Retour à l'accueil
          </button>

          <h1
            style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              color: "var(--color-text-strong)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Fiches indicateurs
          </h1>
          <p className="catalog-page-lead mt-2" style={{ color: "var(--color-text)" }}>
            {FICHES_INDICATEURS.length} fiches · classeur du {catalogueMetadata.sourceDate}. Les listes L1/L2 sont affichées par défaut.
          </p>
          <details className="catalog-reference-summary"><summary>Repères du portefeuille</summary>

          {/* Three orientation figures only; VTT detail belongs in the dedicated views. */}
          <div className="catalog-summary-stats">
            {[
              { label: "indicateurs L1 + L2", value: indicateurs.length },
              { label: "L3/L4 · maturité non renseignée", value: indicateursComplementaires.length },
              ...statsMaturite,
            ].map((s) => (
              <div key={s.label} className="catalog-summary-stat">
                <span className="catalog-summary-value">
                  {s.value}
                </span>
                <span className="catalog-summary-label">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs">Totaux avant filtrage. La maturité porte sur la production des indicateurs, pas sur les résultats des politiques.</p>
          </details>
        </div>
      </div>

      {trail.length > 0 && <div className="catalog-context-back"><button onClick={returnToContext}>Retour au contexte précédent</button><span>Les filtres de consultation sont conservés.</span></div>}
      <nav className="catalog-section-nav" aria-label="Contenu du catalogue" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="catalog-section-tabs max-w-6xl mx-auto px-6">
          {([
            { id: "indicateurs", label: "Indicateurs", count: FICHES_INDICATEURS.length, icon: FileText },
            { id: "donnees", label: "Données", count: donneesCatalogue.length, icon: Database },
            { id: "politiques", label: "Politiques publiques", count: politiquesPubliques.length, icon: Landmark },
          ] as const).map(({ id, label, count, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-current={catalogueSection === id ? "page" : undefined}
              onClick={() => {
                setCatalogueSection(id);
                setSelected(null);
                setRegisterSearch(""); setFocusRecord(""); setTrail([]);
              }}
              className="catalog-section-tab"
              style={{ color: catalogueSection === id ? "var(--color-primary-strong)" : "var(--color-text-muted)" }}
            >
              <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
              <span>{label}</span>
              <span className="catalog-section-count">{count}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Toolbar */}
      {catalogueSection === "indicateurs" ? (
      <div className="catalog-toolbar sticky top-0 z-40" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="catalog-commandbar max-w-6xl mx-auto px-6">
          <div className="catalog-commandbar-main">
          <div className="catalog-view-switch" role="group" aria-label="Vue du catalogue">
            {viewButtons.map((v) => (
              <button
                type="button"
                key={v.id}
                onClick={() => {
                  setViewMode(v.id);
                  setActiveMatrixCell(null);
                  if (v.id === "matrice") setFilterMaturite("Tous");

                }}
                aria-pressed={viewMode === v.id}
                className="catalog-view-option"
                data-active={viewMode === v.id || undefined}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </div>

          {(viewMode === "grille" || viewMode === "vtt") && <div className="catalog-density"><span>Affichage</span><PresentationToggle value={presentation} onChange={setPresentation} /></div>}

          <div className="catalog-search">
            <Search aria-hidden="true" size={15} strokeWidth={1.8} />
            <input
              type="search"
              placeholder="Rechercher un indicateur"
              aria-label="Rechercher un indicateur"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearch("");
              }}
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Effacer la recherche" className="catalog-search-clear">
                <X aria-hidden="true" size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            className="catalog-filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="indicator-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal aria-hidden="true" size={15} />
            Filtres
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>

          <output className="catalog-result-count" aria-live="polite">
            {baseFiltered.length} résultat{baseFiltered.length !== 1 ? "s" : ""}
          </output>
          </div>

          <div id="indicator-filters" className={`catalog-filter-panel${filtersOpen ? " is-open" : ""}`}>
          <fieldset className="catalog-filter-group">
            <legend>Pôle thématique</legend>
            <div className="catalog-filter-options">
            <FilterChip active={filterPole === "Tous"} onClick={() => setFilterPole("Tous")}>Tous</FilterChip>
            {POLES.map((p) => (
              <FilterChip
                key={p}
                active={filterPole === p}
                onClick={() => setFilterPole(p)}
                color={poleColors[p].accent}
              >
                {p}
              </FilterChip>
            ))}
            </div>
          </fieldset>

          <fieldset className="catalog-filter-group catalog-filter-group-listes">
            <legend>Liste de travail</legend>
            <div className="catalog-filter-options">
            <FilterChip active={allListesSelected} onClick={() => setFilterListes(LISTES)}>Tous</FilterChip>
            {LISTES.map((l) => (
              <FilterChip key={l} active={filterListes.includes(l)} onClick={() => toggleListe(l)} color={LISTE_COLORS[l]}>{l}</FilterChip>
            ))}
            </div>
          </fieldset>

          {viewMode !== "matrice" && (
            <fieldset className="catalog-filter-group catalog-filter-group-maturity">
              <legend>Maturité provisoire</legend>
              <div className="catalog-filter-options">
              <FilterChip active={filterMaturite === "Tous"} onClick={() => setFilterMaturite("Tous")}>Tous</FilterChip>
              {MATURITES.map((m) => (
                <FilterChip key={m} active={filterMaturite === m} onClick={() => setFilterMaturite(filterMaturite === m ? "Tous" : m)} color={maturiteColor[m]}>{m} · {maturiteLabel[m]}</FilterChip>
              ))}
              {hasUnratedIndicators && (
                <FilterChip
                  active={filterMaturite === "Non renseignée"}
                  onClick={() => setFilterMaturite(filterMaturite === "Non renseignée" ? "Tous" : "Non renseignée")}
                  color="var(--color-text-muted)"
                >
                  Non renseignée
                </FilterChip>
              )}
              </div>
            </fieldset>
          )}
          </div>
        </div>

        {hasActiveFilters && <div className="catalog-filter-summary" role="status">
          <span>{baseFiltered.length} indicateurs uniques · {filterPole === "Tous" ? "Tous les pôles" : filterPole} · {filterListes.length ? filterListes.join(" + ") : "Aucune liste"} · {filterMaturite === "Tous" ? "Toutes maturités" : typeof filterMaturite === "number" ? maturiteLabel[filterMaturite] : filterMaturite}{search && ` · « ${search} »`}</span>
          <button onClick={resetFilters}>Réinitialiser les filtres (L1/L2)</button>
        </div>}

        {/* Matrix active cell pill */}
        {viewMode === "matrice" && activeMatrixCell && (
          <div className="max-w-6xl mx-auto px-6 pb-2">
            {(() => {
              const vs = vttSections.find((s) => s.key === activeMatrixCell.vtt)!;
              const m = activeMatrixCell.m as 1|2|3|4;
              return (
                <div className="inline-flex items-center gap-2 text-xs rounded-full px-3 py-1" style={{ background: vs.bg }}>
                  <span style={{ color: vs.accent, fontWeight: 600 }}>{vs.label}</span>
                  <span style={{ color: "var(--color-text)", opacity: 0.35 }}>×</span>
                  <span style={{ color: maturiteColor[m], fontWeight: 600 }}>Maturité {m} · {maturiteLabel[m]}</span>
                  <button
                    onClick={() => setActiveMatrixCell(null)}
                    aria-label="Effacer la sélection de la matrice"
                    className="ml-1 flex h-6 w-6 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
                    style={{ color: vs.accent }}
                  >
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      ) : (
        <div className="catalog-toolbar sticky top-0 z-40" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">
            <div className="relative min-w-0 max-w-xl flex-1">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2" size={14} strokeWidth={1.8} style={{ color: "var(--color-text-muted)" }} />
              <input
                type="search"
                placeholder={catalogueSection === "donnees" ? "Rechercher une donnée, un fournisseur ou un indicateur…" : "Rechercher un objectif, un document ou un indicateur…"}
                aria-label="Rechercher dans le registre"
                value={registerSearch}
                onChange={(event) => setRegisterSearch(event.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-full outline-none"
                style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", color: "var(--color-primary-strong)" }}
              />
            </div>
            <span className="text-xs shrink-0" style={{ color: "var(--color-text-muted)" }}>
              {catalogueSection === "donnees" ? filteredDonnees.length : filteredPolitiques.length} résultat{(catalogueSection === "donnees" ? filteredDonnees.length : filteredPolitiques.length) !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="catalog-content max-w-6xl mx-auto">
        {catalogueSection === "indicateurs" && <h2 className="sr-only">Catalogue des indicateurs</h2>}
        {/* Grille */}
        {catalogueSection === "indicateurs" && viewMode === "grille" && (
          baseFiltered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
              <p style={{ fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 700 }}>Aucun résultat</p>
              <p className="text-sm mt-1">Essayez d'élargir les filtres.</p>
            </div>
          ) : cardDensity === "mini" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {baseFiltered.map((ind) => (
                <MiniCard key={ind.id} ind={ind} onClick={() => setSelected(ind)} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {baseFiltered.map((ind) => (
                <EtendueCard key={ind.id} ind={ind} onClick={() => setSelected(ind)} />
              ))}
            </div>
          )
        )}

        {/* Colonnes */}
        {catalogueSection === "indicateurs" && viewMode === "colonnes" && (
          <ColumnsView items={baseFiltered} onSelect={setSelected} />
        )}

        {catalogueSection === "indicateurs" && viewMode === "vtt" && <VTTView items={baseFiltered} density={cardDensity} filterMaturite={filterMaturite} onMaturiteClick={setFilterMaturite} onSelect={setSelected} />}

        {/* Matrice */}
        {catalogueSection === "indicateurs" && viewMode === "matrice" && (
          <div className="flex flex-col gap-8">
            <MatriceView
              items={baseFiltered}
              onCellClick={(vtt, m) => setActiveMatrixCell((p) => p?.vtt === vtt && p?.m === m ? null : { vtt, m })}
              activeCell={activeMatrixCell}
              onSelect={setSelected}
            />

            {activeMatrixCell && matrixFiltered.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: "1.5px solid var(--color-border-subtle)" }}>
                  <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 18, color: "var(--color-primary-strong)" }}>
                    Sélection
                  </span>
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    · {matrixFiltered.length} indicateur{matrixFiltered.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matrixFiltered.map((ind) => (
                    <MiniCard key={ind.id} ind={ind} onClick={() => setSelected(ind)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {catalogueSection === "donnees" && (
          filteredDonnees.length > 0 ? (
            <DonneesView items={filteredDonnees} focusId={focusRecord} onNavigate={navigate} />
          ) : (
            <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
              <p style={{ fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 700 }}>Aucune donnée trouvée</p>
              <p className="text-sm mt-1">Modifiez les termes de recherche.</p>
            </div>
          )
        )}

        {catalogueSection === "politiques" && (
          filteredPolitiques.length > 0 ? (
            <PolitiquesView items={filteredPolitiques} focusId={focusRecord} onNavigate={navigate} />
          ) : (
            <div className="text-center py-20" style={{ color: "var(--color-text-muted)" }}>
              <p style={{ fontFamily: "'Newsreader', serif", fontSize: 22, fontWeight: 700 }}>Aucune politique publique trouvée</p>
              <p className="text-sm mt-1">Modifiez les termes de recherche.</p>
            </div>
          )
        )}
      </div>

      <div className="catalog-footer max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Source : {catalogueMetadata.sourceFile} · mise à jour du {catalogueMetadata.sourceDate}
        </span>
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--color-primary)" }}>
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour à l'accueil
        </button>
      </div>
    </main>
  );
}
