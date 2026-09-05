import { useState, useMemo, useEffect } from "react";
import { Grid2X2, List, Network } from "lucide-react";
import IndicatorGraphView from "@/IndicatorGraphView";
import {
  indicateurs,
  poleColors,
  maturiteLabel,
  maturiteColor,
  vttSections,
  type Pole,
  type Liste,
  type Indicateur,
} from "@/data/indicators";

const POLES: Pole[] = ["Environnement", "Mobilité", "Urbanisation", "Gouvernance"];
const LISTES: Liste[] = ["L1", "L2"];
const MATURITES = [1, 2, 3, 4] as const;

const typologieShort: Record<string, string> = {
  "Résultat": "Résultat",
  "Indicateur stratégique": "Stratégique",
  "Moyen": "Moyen",
  "Contexte": "Contexte",
  "Indicateur opérationnel": "Opérationnel",
  "Indicateur d'efficience": "Efficience",
};

type ViewMode = "grille" | "vtt" | "matrice";
type CardDensity = "mini" | "etendue";
type Presentation = CardDensity | "graphe";

// ─── Atoms ───────────────────────────────────────────────────────────────────

function MaturiteDots({ value, size = 9 }: { value: 1 | 2 | 3 | 4; size?: number }) {
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
      onClick={onClick}
      aria-pressed={active}
      className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
      style={{
        background: active ? (color ?? "var(--color-primary)") : "var(--color-surface)",
        color: active ? "var(--color-surface)" : "var(--color-text)",
        border: `1px solid ${active ? (color ?? "var(--color-primary)") : "var(--color-border)"}`,
      }}
    >
      {children}
    </button>
  );
}

// ─── Mini card ────────────────────────────────────────────────────────────────

function MiniCard({ ind, onClick }: { ind: Indicateur; onClick: () => void }) {
  const c = poleColors[ind.pole];
  const vtt = vttSections.find((s) => s.key === ind.lienVTT);
  return (
    <button
      onClick={onClick}
      className="data-card w-full text-left rounded-2xl overflow-hidden flex flex-col transition-all group"
      style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
    >
      {/* Header — same as EtendueCard */}
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

      {/* Footer — maturité + VTT only */}
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

function EtendueCard({ ind, onClick }: { ind: Indicateur; onClick: () => void }) {
  const c = poleColors[ind.pole];
  const vtt = vttSections.find((s) => s.key === ind.lienVTT);
  return (
    <button
      onClick={onClick}
      className="data-card w-full text-left rounded-2xl overflow-hidden flex flex-col transition-all group"
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
              <span className="text-sm font-semibold" style={{ color: "var(--color-primary-strong)" }}>{v || "—"}</span>
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
      <span className="text-xs font-semibold" style={{ color: "var(--color-primary-strong)" }}>{value || "—"}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ ind, onClose }: { ind: Indicateur; onClose: () => void }) {
  const c = poleColors[ind.pole];
  const vtt = vttSections.find((s) => s.key === ind.lienVTT);
  const vttSecondaire = vttSections.find((s) => s.label === ind.lienVTTSecondaire);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "var(--color-overlay)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden"
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
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-primary-strong)" }}>{ind.definition || "—"}</p>
          </SidebarSection>

          {/* Maturité */}
          <SidebarSection label="Maturité · échelle provisoire">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {MATURITES.map((n) => (
                  <span key={n} style={{ width: 13, height: 13, borderRadius: "50%", background: n <= ind.maturite ? maturiteColor[ind.maturite] : "var(--color-border)", display: "inline-block" }} />
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: maturiteColor[ind.maturite] }}>
                {ind.maturite} — {maturiteLabel[ind.maturite]}
              </span>
            </div>
          </SidebarSection>

          {/* Caractéristiques mesure */}
          <SidebarSection label="Mesure">
            <div className="grid grid-cols-2 gap-2">
              {([
                ["Unité", ind.unite],
                ["Rafraîchissement", ind.rafraichissement],
                ["Granularité", ind.granularite],
                ["Années de disponibilité", ind.anneesDisponibilite],
                ["Valeur cible", ind.valeurCible],
                ["Spatialisation", ind.spatialisation === true ? "Oui" : ind.spatialisation === false ? "Non" : "—"],
              ] as [string, string][]).map(([k, v]) => (
                <MetaCell key={k} label={k} value={v} />
              ))}
            </div>
          </SidebarSection>

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
          <SidebarSection label="Sources de données">
            <div className="flex flex-col gap-2">
              {ind.donnee && <MetaCell label="Donnée" value={ind.donnee} full />}
              {ind.pointeurDonnees && (
                <div>
                  <span className="block text-[11px] uppercase tracking-wide mb-0.5" style={{ color: "var(--color-text-muted)" }}>Pointeur / Lien</span>
                  <p className="text-xs leading-relaxed break-words" style={{ color: "var(--color-primary-strong)", wordBreak: "break-word" }}>{ind.pointeurDonnees}</p>
                </div>
              )}
              {ind.commentaireDonnees && <MetaCell label="Commentaire données" value={ind.commentaireDonnees} full />}
            </div>
          </SidebarSection>

          {/* Modes d’action VTT proposés */}
          {vtt && (
            <SidebarSection label="Rattachement VTT proposé">
              <div className="flex flex-col gap-2">
                <div className="rounded-xl px-4 py-3" style={{ background: vtt.bg, border: "1px solid var(--color-border-subtle)" }}>
                  <div>
                    <span className="block text-[11px] uppercase tracking-wide" style={{ color: vtt.accent, opacity: 0.65 }}>Mode d’action principal</span>
                    <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 17, color: vtt.accent }}>{vtt.label}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: vtt.accent }}>{vtt.question}</p>
                </div>
                <div className="rounded-xl px-4 py-3" style={{ background: vttSecondaire?.bg ?? "var(--color-border-faint)", border: "1px solid var(--color-border-subtle)" }}>
                  <span className="block text-[11px] uppercase tracking-wide" style={{ color: vttSecondaire?.accent ?? "var(--color-text-muted)" }}>Mode d’action secondaire</span>
                  <span className="text-sm font-semibold" style={{ color: vttSecondaire?.accent ?? "var(--color-primary-strong)" }}>{ind.lienVTTSecondaire}</span>
                  {!vttSecondaire && (
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      À confirmer : ce libellé ne correspond pas à l’un des six modes d’action VTT.
                    </p>
                  )}
                </div>
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
              {ind.justificationListe && <MetaCell label="Justification liste" value={ind.justificationListe} full />}
            </div>
          </SidebarSection>

          {/* Commentaires */}
          {ind.commentaire && (
            <SidebarSection label="Commentaire interne">
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text)" }}>{ind.commentaire}</p>
            </SidebarSection>
          )}
          {ind.notesEquipes && (
            <SidebarSection label="Notes des équipes">
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text)" }}>{ind.notesEquipes}</p>
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

function VTTView({
  items,
  density,
  filterMaturite,
  onMaturiteClick,
  onSelect,
}: {
  items: Indicateur[];
  density: CardDensity;
  filterMaturite: number | "Tous";
  onMaturiteClick: (m: number | "Tous") => void;
  onSelect: (ind: Indicateur) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {vttSections.map((section) => {
        const sectionItems = items.filter((i) => i.lienVTT === section.key);

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
                  {section.axe} · {sectionItems.length} {sectionItems.length === 1 ? "rattachement principal" : "rattachements principaux"}
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
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all"
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

            {/* Section body — flat list, no maturité sub-groups */}
            <div className="px-6 py-5" style={{ background: "var(--color-surface-soft)" }}>
              {sectionItems.length === 0 ? (
                <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "var(--color-surface)", color: "var(--color-text-muted)", border: "1px solid var(--color-border-subtle)" }}>
                  Aucun rattachement principal dans le préclassement actuel. Ce mode apparaît comme rattachement secondaire pour certains indicateurs.
                </div>
              ) : density === "mini" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionItems.map((ind) => <MiniCard key={ind.id} ind={ind} onClick={() => onSelect(ind)} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionItems.map((ind) => <EtendueCard key={ind.id} ind={ind} onClick={() => onSelect(ind)} />)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Matrice view ─────────────────────────────────────────────────────────────

function MatriceView({
  items,
  onCellClick,
  activeCell,
}: {
  items: Indicateur[];
  onCellClick: (vtt: string, m: number) => void;
  activeCell: { vtt: string; m: number } | null;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 640 }}>
        <thead>
          <tr>
            <th className="text-left py-3 pr-4 text-xs font-semibold" style={{ color: "var(--color-text)", opacity: 0.5, width: 180 }}>
              Mode d’action VTT principal proposé
            </th>
            {MATURITES.map((m) => (
              <th key={m} className="py-3 px-2 text-center" style={{ width: "20%" }}>
                <div className="flex flex-col items-center gap-1">
                  <span style={{ width: 13, height: 13, borderRadius: "50%", background: maturiteColor[m], display: "inline-block" }} />
                  <span className="text-xs font-bold" style={{ color: "var(--color-primary-strong)" }}>Maturité {m}</span>
                  <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{maturiteLabel[m]}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vttSections.map((section, si) => {
            const rowItems = items.filter((i) => i.lienVTT === section.key);
            return (
              <tr
                key={section.key}
                style={{
                  borderTop: `1px solid ${
                    si === 0 ? "var(--color-border)" : "var(--color-border-subtle)"
                  }`,
                }}
              >
                <td className="py-4 pr-4 align-top">
                  <div>
                    <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 14, color: section.accent, display: "block" }}>
                      {section.label}
                    </span>
                    <span className="text-[11px]" style={{ color: section.accent }}>
                      {rowItems.length} indicateur{rowItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </td>
                {MATURITES.map((m) => {
                  const cellItems = rowItems.filter((i) => i.maturite === m);
                  const isActive = activeCell?.vtt === section.key && activeCell?.m === m;
                  const isEmpty = cellItems.length === 0;
                  return (
                    <td key={m} className="py-4 px-2 align-top">
                      <button
                        onClick={() => !isEmpty && onCellClick(section.key, m)}
                        disabled={isEmpty}
                        className="w-full rounded-xl p-3 text-left transition-all"
                        style={{
                          background: isEmpty ? "var(--color-border-faint)" : isActive ? section.bg : "var(--color-surface-translucent)",
                          border: `1.5px solid ${isEmpty ? "var(--color-border-faint)" : isActive ? section.accent : "var(--color-border)"}`,
                          cursor: isEmpty ? "default" : "pointer",
                          minHeight: 64,
                        }}
                      >
                        {isEmpty ? (
                          <span className="text-xs" style={{ color: "var(--color-text)", opacity: 0.2 }}>—</span>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 22, color: isActive ? section.accent : "var(--color-primary-strong)", lineHeight: 1 }}>
                                {cellItems.length}
                              </span>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: maturiteColor[m], display: "inline-block" }} />
                            </div>
                            <div className="flex flex-col gap-1">
                              {cellItems.map((ind) => (
                                <span key={ind.id} className="text-[11px] leading-snug font-medium" style={{ color: isActive ? section.accent : "var(--color-text)" }}>
                                  {ind.id} · {ind.nom}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals row */}
      <div className="flex mt-4 rounded-xl overflow-hidden" style={{ border: "1.5px solid var(--color-border-subtle)" }}>
        <div className="py-3 pr-4 pl-4 flex items-center shrink-0" style={{ width: 180, background: "var(--color-canvas)", borderRight: "1px solid var(--color-border-subtle)" }}>
          <span className="text-xs font-semibold" style={{ color: "var(--color-text)", opacity: 0.5 }}>Total</span>
        </div>
        {MATURITES.map((m) => {
          const count = items.filter((i) => i.maturite === m).length;
          return (
            <div key={m} className="flex-1 py-3 px-2 text-center" style={{ background: "var(--color-canvas)", borderLeft: "1px solid var(--color-border-subtle)" }}>
              <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 18, color: count > 0 ? maturiteColor[m] : "var(--color-text)", opacity: count > 0 ? 1 : 0.2 }}>
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Density toggle ───────────────────────────────────────────────────────────

function PresentationToggle({ value, onChange }: { value: Presentation; onChange: (presentation: Presentation) => void }) {
  const options = [
    { id: "mini", label: "Mini", icon: List },
    { id: "etendue", label: "Étendue", icon: Grid2X2 },
    { id: "graphe", label: "Graphe", icon: Network },
  ] as const;

  return (
    <div
      className="flex rounded-full p-0.5"
      style={{ background: "var(--color-border-subtle)", border: "1px solid var(--color-border-subtle)" }}
    >
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: value === id ? "var(--color-primary)" : "transparent",
            color: value === id ? "var(--color-surface)" : "var(--color-text)",
          }}
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
  const [viewMode, setViewMode] = useState<ViewMode>("grille");
  const [presentation, setPresentation] = useState<Presentation>("mini");
  const [filterPole, setFilterPole] = useState<Pole | "Tous">("Tous");
  const [filterListe, setFilterListe] = useState<Liste | "Tous">("Tous");
  const [filterMaturite, setFilterMaturite] = useState<number | "Tous">("Tous");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Indicateur | null>(null);
  const [activeMatrixCell, setActiveMatrixCell] = useState<{ vtt: string; m: number } | null>(null);

  const baseFiltered = useMemo(() => {
    return indicateurs.filter((ind) => {
      if (filterPole !== "Tous" && ind.pole !== filterPole) return false;
      if (filterListe !== "Tous" && ind.liste !== filterListe) return false;
      if (filterMaturite !== "Tous" && ind.maturite !== filterMaturite) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!ind.nom.toLowerCase().includes(q) && !ind.id.toLowerCase().includes(q) && !ind.definition.toLowerCase().includes(q) && !ind.lienVTTSecondaire.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filterPole, filterListe, filterMaturite, search]);

  const matrixFiltered = useMemo(() => {
    if (!activeMatrixCell) return [];
    return baseFiltered.filter(
      (i) => i.lienVTT === activeMatrixCell.vtt && i.maturite === activeMatrixCell.m
    );
  }, [baseFiltered, activeMatrixCell]);

  const statsL1 = indicateurs.filter((i) => i.liste === "L1").length;
  const statsL2 = indicateurs.filter((i) => i.liste === "L2").length;
  const cardDensity: CardDensity = presentation === "graphe" ? "mini" : presentation;

  const viewButtons: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "grille",
      label: "Grille",
      icon: <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><rect x="0.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="7.5" y="0.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="0.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="7.5" y="7.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>,
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
    <div className="min-h-full" style={{ background: "var(--color-canvas)", fontFamily: "'Public Sans', sans-serif" }}>

      {/* Sidebar */}
      {selected && <Sidebar ind={selected} onClose={() => setSelected(null)} />}

      {/* Page header */}
      <div style={{ background: "var(--color-primary-soft-strong)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <button
            onClick={onBack}
            className="page-back flex items-center gap-2 text-xs font-semibold mb-6 transition-opacity hover:opacity-70"
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
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--color-text-strong)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Fiches indicateurs
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text)", maxWidth: 520 }}>
            Portefeuille de travail L1 + L2 : {indicateurs.length} indicateurs explorables par grille, regroupement par mode d’action, graphe de relations ou matrice VTT × maturité.
          </p>
          <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)", maxWidth: 720 }}>
            Les rattachements VTT sont un préclassement à synchroniser avec le tableur consolidé. Les 21 indicateurs L3 et les 47 indicateurs L4 restent dans la feuille de route et la traçabilité de l’étude.
          </p>

          {/* Three orientation figures only; VTT detail belongs in the dedicated views. */}
          <div className="flex gap-8 mt-7 flex-wrap items-end" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 20 }}>
            {[
              { label: "indicateurs L1 + L2", value: indicateurs.length },
              { label: "L1 · démarrage 2026–27", value: statsL1 },
              { label: "L2 · consolidation 2028", value: statsL2 },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 28, color: "var(--color-primary-strong)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)", maxWidth: 150 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="catalog-toolbar sticky top-0 z-40" style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap gap-3 items-center">

          {/* View toggle */}
          <div className="flex rounded-full p-0.5 shrink-0" style={{ background: "var(--color-border-subtle)", border: "1px solid var(--color-border-subtle)" }}>
            {viewButtons.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setViewMode(v.id);
                  setActiveMatrixCell(null);
                  if (v.id === "grille" && presentation === "graphe") setPresentation("mini");
                }}
                aria-pressed={viewMode === v.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: viewMode === v.id ? "var(--color-primary)" : "transparent",
                  color: viewMode === v.id ? "var(--color-surface)" : "var(--color-text)",
                }}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </div>

          {/* Card density and graph presentation — only in grille and vtt modes */}
          {viewMode !== "matrice" && (
            <PresentationToggle
              value={presentation}
              onChange={(next) => {
                setPresentation(next);
                if (next === "graphe") {
                  setViewMode("vtt");
                  setActiveMatrixCell(null);
                }
              }}
            />
          )}

          {/* Search */}
          <div className="relative min-w-40 max-w-56 flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="5.5" cy="5.5" r="4" stroke="var(--color-text)" strokeWidth="1.3" opacity="0.4"/>
              <path d="M9 9l2.5 2.5" stroke="var(--color-text)" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full outline-none"
              style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)", color: "var(--color-primary-strong)", fontFamily: "'Public Sans', sans-serif" }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Pôle</span>
            <FilterChip active={filterPole === "Tous"} onClick={() => setFilterPole("Tous")}>Tous</FilterChip>
            {POLES.map((p) => (
              <FilterChip key={p} active={filterPole === p} onClick={() => setFilterPole(p)} color={poleColors[p].accent}>{p}</FilterChip>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Liste</span>
            <FilterChip active={filterListe === "Tous"} onClick={() => setFilterListe("Tous")}>Tous</FilterChip>
            {LISTES.map((l) => (
              <FilterChip key={l} active={filterListe === l} onClick={() => setFilterListe(l)} color={l === "L1" ? "var(--color-primary)" : "var(--color-violet)"}>{l}</FilterChip>
            ))}
          </div>

          {viewMode !== "matrice" && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Maturité provisoire</span>
              <FilterChip active={filterMaturite === "Tous"} onClick={() => setFilterMaturite("Tous")}>Tous</FilterChip>
              {MATURITES.map((m) => (
                <FilterChip key={m} active={filterMaturite === m} onClick={() => setFilterMaturite(filterMaturite === m ? "Tous" : m)} color={maturiteColor[m]}>{m}</FilterChip>
              ))}
            </div>
          )}

          <span className="text-xs ml-auto shrink-0" style={{ color: "var(--color-text-muted)" }}>
            {baseFiltered.length} résultat{baseFiltered.length !== 1 ? "s" : ""}
          </span>
        </div>

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
                  <span style={{ color: maturiteColor[m], fontWeight: 600 }}>Maturité {m} — {maturiteLabel[m]}</span>
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Grille */}
        {viewMode === "grille" && (
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

        {/* VTT */}
        {viewMode === "vtt" && (
          presentation === "graphe" ? (
            <IndicatorGraphView items={baseFiltered} onSelect={setSelected} />
          ) : (
            <VTTView
              items={baseFiltered}
              density={cardDensity}
              filterMaturite={filterMaturite}
              onMaturiteClick={(m) => setFilterMaturite(m)}
              onSelect={setSelected}
            />
          )
        )}

        {/* Matrice */}
        {viewMode === "matrice" && (
          <div className="flex flex-col gap-8">
            <MatriceView
              items={baseFiltered}
              onCellClick={(vtt, m) => setActiveMatrixCell((p) => p?.vtt === vtt && p?.m === m ? null : { vtt, m })}
              activeCell={activeMatrixCell}
            />

            {activeMatrixCell && matrixFiltered.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2" style={{ borderBottom: "1.5px solid var(--color-border-subtle)" }}>
                  <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 18, color: "var(--color-primary-strong)" }}>
                    Sélection
                  </span>
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    — {matrixFiltered.length} indicateur{matrixFiltered.length !== 1 ? "s" : ""}
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
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Source : Fiches indicateurs POPGG — 20260728</span>
        <button onClick={onBack} className="flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--color-primary)" }}>
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
