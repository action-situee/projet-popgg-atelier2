import { vttKeys, maturityCounts } from "@/data/catalogueRelations";
import { useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
import {
  Building2,
  BusFront,
  Calculator,
  ClipboardCheck,
  Database,
  Leaf,
  Landmark,
  Link2,
  MessageSquareCheck,
  Radio,
  Recycle,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Waypoints,
} from "lucide-react";
import homeIllustration from "@/imports/home.481ab0667bd5.svg";
import vttLevers from "@/imports/vtt-levers.webp";
import IndicateursPage from "@/IndicateursPage";
import { indicateurs, poleColors, maturiteColor, maturiteLabel } from "@/data/indicators";
import { catalogueMetadata } from "@/data/workbookCatalogue";
import "@/indicatorOverview.css";

// ─── Shared style tokens ─────────────────────────────────────────────────────
// Palette sourced from Grand Genève: lake, alpine greens, institutional blues,
// terracotta accents · kept editable and vectorial throughout.

// ─── Character SVGs ──────────────────────────────────────────────────────────
// Style: flat vector, dark-ink outlines via fill, skin var(--color-illustration-skin), limited palette.
// Figures are territory users, drawn in a clear institutional illustration style.

const Observatrice = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Hair · straight bob */}
    <path d="M29 22 Q31 7 45 6 Q59 7 61 22 L61 36 Q53 42 45 42 Q37 42 29 36Z" fill="var(--color-text)"/>
    <path d="M29 22 Q29 10 45 9 Q61 10 61 22 Q55 13 45 14 Q35 13 29 22Z" fill="var(--color-text-strong)"/>
    {/* Ears */}
    <ellipse cx="29" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    <ellipse cx="61" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Eyes */}
    <ellipse cx="38" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <ellipse cx="52" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <circle cx="39" cy="24" r="0.9" fill="var(--color-surface)"/>
    <circle cx="53" cy="24" r="0.9" fill="var(--color-surface)"/>
    {/* Eyebrows */}
    <path d="M34 19 Q38 17 42 19" fill="none" stroke="var(--color-text)" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M48 19 Q52 17 56 19" fill="none" stroke="var(--color-text)" strokeWidth="1.8" strokeLinecap="round"/>
    {/* Smile */}
    <path d="M38 33 Q45 38 52 33" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Neck */}
    <rect x="38" y="42" width="14" height="9" fill="var(--color-illustration-skin)"/>
    {/* Shirt / blazer */}
    <path d="M20 54 L30 50 L60 50 L70 54 L72 108 L18 108Z" fill="var(--color-primary)"/>
    <path d="M30 50 L38 60 L45 50" fill="var(--color-primary-soft)" opacity="0.25"/>
    <path d="M60 50 L52 60 L45 50" fill="var(--color-primary-soft)" opacity="0.25"/>
    {/* White shirt under */}
    <rect x="38" y="50" width="14" height="22" fill="var(--color-canvas)"/>
    {/* Left arm · holding tablet */}
    <path d="M20 54 L6 70 L10 80 L24 64" fill="var(--color-illustration-skin)"/>
    {/* Tablet */}
    <rect x="0" y="65" width="18" height="24" rx="2" fill="var(--color-primary-soft)" stroke="var(--color-text)" strokeWidth="1.2"/>
    <rect x="2" y="67" width="14" height="18" rx="1" fill="var(--color-primary)" opacity="0.3"/>
    {/* Mini map on tablet */}
    <circle cx="9" cy="74" r="3" fill="var(--color-primary)" opacity="0.7"/>
    <line x1="6" y1="79" x2="12" y2="79" stroke="var(--color-text)" strokeWidth="0.6"/>
    <line x1="5" y1="82" x2="13" y2="82" stroke="var(--color-text)" strokeWidth="0.6"/>
    {/* Right arm */}
    <path d="M70 54 L82 66 L78 74 L66 62" fill="var(--color-illustration-skin)"/>
    <ellipse cx="80" cy="75" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Pants */}
    <rect x="22" y="106" width="19" height="46" rx="4" fill="var(--color-text)"/>
    <rect x="49" y="106" width="19" height="46" rx="4" fill="var(--color-text)"/>
    {/* Shoes */}
    <ellipse cx="31" cy="154" rx="11" ry="6" fill="var(--color-text-strong)"/>
    <ellipse cx="58" cy="154" rx="11" ry="6" fill="var(--color-text-strong)"/>
  </svg>
);

const poleOverviewIcons = {
  Environnement: Leaf,
  Mobilité: BusFront,
  Urbanisation: Building2,
  Gouvernance: Landmark,
} as const;

const Urbaniste = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Hair */}
    <path d="M29 22 Q31 7 45 6 Q59 7 61 22 Q55 12 45 13 Q35 12 29 22Z" fill="var(--color-illustration-taupe)"/>
    {/* Hard hat */}
    <ellipse cx="45" cy="12" rx="21" ry="9" fill="var(--color-ochre-soft)"/>
    <rect x="23" y="13" width="44" height="6" rx="3" fill="var(--color-ochre-soft)"/>
    <rect x="30" y="10" width="30" height="5" rx="2" fill="var(--color-ochre)" opacity="0.55"/>
    {/* Ears */}
    <ellipse cx="29" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    <ellipse cx="61" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Eyes */}
    <ellipse cx="38" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <ellipse cx="52" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <circle cx="39" cy="24" r="0.9" fill="var(--color-surface)"/>
    <circle cx="53" cy="24" r="0.9" fill="var(--color-surface)"/>
    {/* Eyebrows */}
    <path d="M34 19 Q38 17 42 19" fill="none" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M48 19 Q52 17 56 19" fill="none" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round"/>
    {/* Smile */}
    <path d="M38 33 Q45 38 52 33" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Neck */}
    <rect x="38" y="42" width="14" height="9" fill="var(--color-illustration-skin)"/>
    {/* Jacket */}
    <path d="M20 54 L30 50 L60 50 L70 54 L72 108 L18 108Z" fill="var(--color-violet-soft)"/>
    {/* Left arm · blueprint */}
    <path d="M20 54 L5 70 L9 80 L24 64" fill="var(--color-violet-soft)"/>
    <ellipse cx="7" cy="81" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Blueprint sheet */}
    <rect x="-2" y="66" width="16" height="20" rx="1.5" fill="var(--color-primary-soft)" stroke="var(--color-text)" strokeWidth="1"/>
    <line x1="1" y1="71" x2="11" y2="71" stroke="var(--color-primary)" strokeWidth="0.7"/>
    <line x1="1" y1="74" x2="11" y2="74" stroke="var(--color-primary)" strokeWidth="0.7"/>
    <path d="M1 78 L5 82 L11 78" fill="none" stroke="var(--color-accent)" strokeWidth="0.8"/>
    {/* Right arm */}
    <path d="M70 54 L84 66 L80 74 L66 62" fill="var(--color-violet-soft)"/>
    <ellipse cx="82" cy="75" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Pants */}
    <rect x="22" y="106" width="19" height="46" rx="4" fill="var(--color-text)"/>
    <rect x="49" y="106" width="19" height="46" rx="4" fill="var(--color-text)"/>
    {/* Shoes */}
    <ellipse cx="31" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
    <ellipse cx="58" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
  </svg>
);

const Architecte = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="28" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Hair bun */}
    <path d="M29 24 Q31 9 45 8 Q59 9 61 24 Q55 14 45 15 Q35 14 29 24Z" fill="var(--color-illustration-clay)"/>
    <circle cx="45" cy="9" r="8" fill="var(--color-illustration-clay)"/>
    {/* Glasses frames */}
    <rect x="32" y="22" width="11" height="8" rx="3.5" fill="none" stroke="var(--color-text)" strokeWidth="1.6"/>
    <rect x="47" y="22" width="11" height="8" rx="3.5" fill="none" stroke="var(--color-text)" strokeWidth="1.6"/>
    <line x1="43" y1="26" x2="47" y2="26" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="29" y1="26" x2="32" y2="26" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="58" y1="26" x2="61" y2="26" stroke="var(--color-text)" strokeWidth="1.2"/>
    {/* Eyes */}
    <circle cx="37.5" cy="26" r="2" fill="var(--color-text)"/>
    <circle cx="52.5" cy="26" r="2" fill="var(--color-text)"/>
    {/* Ears */}
    <ellipse cx="29" cy="29" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    <ellipse cx="61" cy="29" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Smile */}
    <path d="M38 36 Q45 41 52 36" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Neck / turtleneck */}
    <rect x="37" y="43" width="16" height="14" rx="6" fill="var(--color-violet)"/>
    {/* Sweater body */}
    <path d="M20 56 L30 52 L60 52 L70 56 L72 108 L18 108Z" fill="var(--color-violet)"/>
    {/* Left arm */}
    <path d="M20 56 L5 72 L9 82 L24 66" fill="var(--color-violet)"/>
    <ellipse cx="7" cy="83" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Right arm · rolled plans */}
    <path d="M70 56 L85 70 L81 80 L66 66" fill="var(--color-violet)"/>
    <ellipse cx="83" cy="81" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Rolled plan tube */}
    <rect x="79" y="64" width="7" height="24" rx="3.5" fill="var(--color-primary-soft)" stroke="var(--color-text)" strokeWidth="1.2"/>
    <ellipse cx="82.5" cy="64" rx="3.5" ry="2.2" fill="var(--color-primary-soft)" stroke="var(--color-text)" strokeWidth="1.2"/>
    <ellipse cx="82.5" cy="88" rx="3.5" ry="2.2" fill="var(--color-primary-soft)" stroke="var(--color-text)" strokeWidth="1.2"/>
    {/* Pants */}
    <rect x="22" y="106" width="19" height="46" rx="4" fill="var(--color-primary)"/>
    <rect x="49" y="106" width="19" height="46" rx="4" fill="var(--color-primary)"/>
    {/* Shoes */}
    <ellipse cx="31" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
    <ellipse cx="58" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
  </svg>
);

// Mathieu · cyclist, rider properly seated on bicycle, leaning forward
const Cycliste = () => (
  <svg viewBox="0 0 130 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* === BICYCLE === */}
    {/* Rear wheel */}
    <circle cx="30" cy="120" r="22" fill="none" stroke="var(--color-text)" strokeWidth="2.8"/>
    <circle cx="30" cy="120" r="5" fill="var(--color-text)"/>
    {/* Front wheel */}
    <circle cx="100" cy="120" r="22" fill="none" stroke="var(--color-text)" strokeWidth="2.8"/>
    <circle cx="100" cy="120" r="5" fill="var(--color-text)"/>
    {/* Spokes rear */}
    <line x1="30" y1="98" x2="30" y2="120" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="30" y1="120" x2="47" y2="111" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="30" y1="120" x2="47" y2="129" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="30" y1="120" x2="13" y2="111" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="30" y1="120" x2="13" y2="129" stroke="var(--color-text)" strokeWidth="1.2"/>
    {/* Spokes front */}
    <line x1="100" y1="98" x2="100" y2="120" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="100" y1="120" x2="117" y2="111" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="100" y1="120" x2="83" y2="111" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="100" y1="120" x2="117" y2="129" stroke="var(--color-text)" strokeWidth="1.2"/>
    <line x1="100" y1="120" x2="83" y2="129" stroke="var(--color-text)" strokeWidth="1.2"/>
    {/* === FRAME === */}
    {/* Chain stay: BB → rear axle */}
    <line x1="60" y1="108" x2="30" y2="120" stroke="var(--color-accent)" strokeWidth="3"/>
    {/* Seat tube: BB → seat post top */}
    <line x1="60" y1="108" x2="53" y2="82" stroke="var(--color-accent)" strokeWidth="3"/>
    {/* Seat stay: seat post top → rear axle */}
    <line x1="53" y1="82" x2="30" y2="120" stroke="var(--color-accent)" strokeWidth="2.5"/>
    {/* Top tube: seat → head tube */}
    <line x1="53" y1="82" x2="92" y2="78" stroke="var(--color-accent)" strokeWidth="3"/>
    {/* Down tube: BB → head tube bottom */}
    <line x1="60" y1="108" x2="95" y2="88" stroke="var(--color-accent)" strokeWidth="3"/>
    {/* Head tube */}
    <line x1="92" y1="78" x2="95" y2="88" stroke="var(--color-text)" strokeWidth="4" strokeLinecap="round"/>
    {/* Fork: head tube bottom → front axle */}
    <line x1="95" y1="88" x2="100" y2="120" stroke="var(--color-accent)" strokeWidth="2.5"/>
    {/* === COCKPIT === */}
    {/* Stem + handlebar */}
    <line x1="92" y1="78" x2="96" y2="66" stroke="var(--color-text)" strokeWidth="2.5"/>
    <line x1="89" y1="65" x2="103" y2="65" stroke="var(--color-text)" strokeWidth="3.5" strokeLinecap="round"/>
    {/* Drops (drop-bar ends) */}
    <path d="M89 65 Q87 70 89 75" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M103 65 Q105 70 103 75" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Saddle */}
    <line x1="53" y1="82" x2="50" y2="72" stroke="var(--color-text)" strokeWidth="2.5"/>
    <rect x="41" y="67" width="20" height="5" rx="2.5" fill="var(--color-text)"/>
    {/* Crank arms */}
    <circle cx="60" cy="108" r="6" fill="var(--color-text)"/>
    <line x1="52" y1="114" x2="68" y2="102" stroke="var(--color-text)" strokeWidth="3" strokeLinecap="round"/>
    <rect x="48" y="113" width="9" height="3.5" rx="1.5" fill="var(--color-text)"/>
    <rect x="63" y="99" width="9" height="3.5" rx="1.5" fill="var(--color-text)"/>
    {/* === RIDER === */}
    {/* Head · centered above handlebar area, leaning forward */}
    <ellipse cx="80" cy="42" rx="15" ry="15" fill="var(--color-illustration-skin)"/>
    {/* Helmet */}
    <path d="M65 38 Q67 24 80 23 Q93 24 95 38 Q89 28 80 29 Q71 28 65 38Z" fill="var(--color-accent)"/>
    <rect x="64" y="38" width="32" height="5" rx="2.5" fill="var(--color-accent)"/>
    {/* Vents */}
    <rect x="70" y="26" width="4" height="10" rx="2" fill="var(--color-ochre-soft)" opacity="0.7"/>
    <rect x="78" y="25" width="4" height="12" rx="2" fill="var(--color-ochre-soft)" opacity="0.7"/>
    <rect x="86" y="26" width="4" height="10" rx="2" fill="var(--color-ochre-soft)" opacity="0.7"/>
    {/* Eyes */}
    <circle cx="74" cy="42" r="2.2" fill="var(--color-text)"/>
    <circle cx="86" cy="42" r="2.2" fill="var(--color-text)"/>
    <circle cx="74.8" cy="41.2" r="0.8" fill="var(--color-surface)"/>
    <circle cx="86.8" cy="41.2" r="0.8" fill="var(--color-surface)"/>
    {/* Smile */}
    <path d="M74 49 Q80 54 86 49" fill="none" stroke="var(--color-text)" strokeWidth="1.4" strokeLinecap="round"/>
    {/* Ears */}
    <ellipse cx="65" cy="42" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Neck */}
    <path d="M76 56 L84 56 L82 66 L78 66Z" fill="var(--color-illustration-skin)"/>
    {/* Torso · cycling jersey, leaning forward (~45°) */}
    {/* Hips at saddle (50,70), shoulders at (72,58), head at (80,42) */}
    <path d="M48 70 L52 74 L76 66 L80 58 L68 56 L44 64Z" fill="var(--color-violet-soft)"/>
    {/* Jersey pockets on back */}
    <rect x="44" y="64" width="10" height="7" rx="2" fill="var(--color-violet)"/>
    {/* Left arm · reaching down to handlebar drops */}
    <path d="M68 58 Q76 62 88 72" fill="none" stroke="var(--color-illustration-skin)" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="89" cy="73" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Right arm */}
    <path d="M76 58 Q82 62 93 70" fill="none" stroke="var(--color-illustration-skin)" strokeWidth="7" strokeLinecap="round"/>
    <ellipse cx="94" cy="71" rx="4.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Left leg · pedal down */}
    <path d="M50 72 Q46 90 52 112" fill="none" stroke="var(--color-text)" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="52" cy="114" rx="9" ry="5" fill="var(--color-text)"/>
    {/* Right leg · pedal up */}
    <path d="M54 72 Q62 84 68 100" fill="none" stroke="var(--color-text)" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="69" cy="101" rx="9" ry="5" fill="var(--color-text)"/>
    {/* Cycling shoes */}
    <rect x="43" y="111" width="18" height="7" rx="3" fill="var(--color-text-strong)"/>
    <rect x="60" y="99" width="18" height="7" rx="3" fill="var(--color-text-strong)"/>
  </svg>
);

const Ecologue = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Hair */}
    <path d="M29 22 Q31 7 45 6 Q59 7 61 22 Q55 12 45 13 Q35 12 29 22Z" fill="var(--color-illustration-clay)"/>
    {/* Field cap */}
    <ellipse cx="45" cy="14" rx="20" ry="8" fill="var(--color-sage)"/>
    <rect x="26" y="12" width="38" height="7" rx="2" fill="var(--color-sage)"/>
    <ellipse cx="45" cy="12" rx="15" ry="4" fill="var(--color-sage-medium)"/>
    <rect x="24" y="17" width="12" height="4" rx="2" fill="var(--color-sage)"/>
    {/* Ears */}
    <ellipse cx="29" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    <ellipse cx="61" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Eyes */}
    <ellipse cx="38" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <ellipse cx="52" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <circle cx="39" cy="24" r="0.9" fill="var(--color-surface)"/>
    <circle cx="53" cy="24" r="0.9" fill="var(--color-surface)"/>
    {/* Smile */}
    <path d="M38 33 Q45 38 52 33" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Freckles */}
    <circle cx="37" cy="31" r="1.1" fill="var(--color-coral)" opacity="0.5"/>
    <circle cx="41" cy="33" r="1.1" fill="var(--color-coral)" opacity="0.5"/>
    <circle cx="49" cy="33" r="1.1" fill="var(--color-coral)" opacity="0.5"/>
    <circle cx="53" cy="31" r="1.1" fill="var(--color-coral)" opacity="0.5"/>
    {/* Neck */}
    <rect x="38" y="42" width="14" height="9" fill="var(--color-illustration-skin)"/>
    {/* Field shirt */}
    <path d="M20 54 L30 50 L60 50 L70 54 L72 108 L18 108Z" fill="var(--color-sage)"/>
    {/* Left arm · binoculars */}
    <path d="M20 54 L5 70 L9 80 L24 64" fill="var(--color-illustration-skin)"/>
    {/* Binoculars */}
    <rect x="-4" y="70" width="14" height="9" rx="3" fill="var(--color-text)"/>
    <circle cx="1" cy="74.5" r="4" fill="var(--color-primary-strong)"/>
    <circle cx="9" cy="74.5" r="4" fill="var(--color-primary-strong)"/>
    <circle cx="1" cy="74.5" r="2" fill="var(--color-primary)" opacity="0.6"/>
    <circle cx="9" cy="74.5" r="2" fill="var(--color-primary)" opacity="0.6"/>
    {/* Right arm · notebook */}
    <path d="M70 54 L84 66 L80 76 L66 64" fill="var(--color-illustration-skin)"/>
    <ellipse cx="82" cy="77" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    <rect x="76" y="62" width="14" height="18" rx="2" fill="var(--color-surface)" stroke="var(--color-text)" strokeWidth="1"/>
    <rect x="76" y="62" width="3" height="18" rx="1" fill="var(--color-sage)"/>
    <line x1="81" y1="66" x2="88" y2="66" stroke="var(--color-text)" strokeWidth="0.7"/>
    <line x1="81" y1="70" x2="88" y2="70" stroke="var(--color-text)" strokeWidth="0.7"/>
    <line x1="81" y1="74" x2="88" y2="74" stroke="var(--color-text)" strokeWidth="0.7"/>
    {/* Pants */}
    <rect x="22" y="106" width="19" height="46" rx="4" fill="var(--color-primary-strong)"/>
    <rect x="49" y="106" width="19" height="46" rx="4" fill="var(--color-primary-strong)"/>
    {/* Boots */}
    <ellipse cx="31" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
    <ellipse cx="58" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
  </svg>
);

const Elu = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Grey hair */}
    <path d="M29 22 Q31 8 45 7 Q59 8 61 22 Q57 11 45 12 Q33 11 29 22Z" fill="var(--color-illustration-neutral)"/>
    {/* Ears */}
    <ellipse cx="29" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    <ellipse cx="61" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Eyes */}
    <ellipse cx="38" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <ellipse cx="52" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <circle cx="39" cy="24" r="0.9" fill="var(--color-surface)"/>
    <circle cx="53" cy="24" r="0.9" fill="var(--color-surface)"/>
    {/* Eyebrows · expressive */}
    <path d="M33 19 Q38 16 43 19" fill="none" stroke="var(--color-illustration-neutral)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M47 19 Q52 16 57 19" fill="none" stroke="var(--color-illustration-neutral)" strokeWidth="2" strokeLinecap="round"/>
    {/* Smile */}
    <path d="M37 34 Q45 40 53 34" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Neck */}
    <rect x="38" y="42" width="14" height="9" fill="var(--color-illustration-skin)"/>
    {/* White shirt */}
    <rect x="36" y="48" width="18" height="18" fill="var(--color-canvas)"/>
    {/* Tie · swiss cross red */}
    <path d="M43 52 L45 72 L47 52Z" fill="var(--color-accent)"/>
    <rect x="43" y="58" width="4" height="3" fill="var(--color-accent)"/>
    {/* Suit jacket */}
    <path d="M18 58 L28 50 L62 50 L72 58 L74 110 L16 110Z" fill="var(--color-primary)"/>
    <path d="M28 50 L38 62 L45 50" fill="var(--color-primary-strong)"/>
    <path d="M62 50 L52 62 L45 50" fill="var(--color-primary-strong)"/>
    {/* Pin / badge */}
    <circle cx="34" cy="70" r="5.5" fill="var(--color-ochre-soft)"/>
    <circle cx="34" cy="70" r="3" fill="var(--color-accent)"/>
    {/* Left arm · papers */}
    <path d="M18 58 L4 74 L8 84 L22 68" fill="var(--color-primary)"/>
    <rect x="-2" y="68" width="16" height="20" rx="1.5" fill="var(--color-canvas)" stroke="var(--color-text)" strokeWidth="0.8"/>
    <line x1="1" y1="73" x2="11" y2="73" stroke="var(--color-text)" strokeWidth="0.6"/>
    <line x1="1" y1="77" x2="11" y2="77" stroke="var(--color-text)" strokeWidth="0.6"/>
    <line x1="1" y1="81" x2="8" y2="81" stroke="var(--color-text)" strokeWidth="0.6"/>
    {/* Right arm */}
    <path d="M72 58 L84 70 L80 80 L68 68" fill="var(--color-primary)"/>
    <ellipse cx="82" cy="81" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Pants */}
    <rect x="20" y="108" width="19" height="44" rx="4" fill="var(--color-primary-strong)"/>
    <rect x="51" y="108" width="19" height="44" rx="4" fill="var(--color-primary-strong)"/>
    {/* Shoes */}
    <ellipse cx="29" cy="154" rx="11" ry="6" fill="var(--color-text-strong)"/>
    <ellipse cx="60" cy="154" rx="11" ry="6" fill="var(--color-text-strong)"/>
  </svg>
);

const Batisseur = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="28" rx="16" ry="17" fill="var(--color-illustration-clay)"/>
    {/* Hard hat */}
    <ellipse cx="45" cy="14" rx="21" ry="9" fill="var(--color-ochre)"/>
    <rect x="22" y="15" width="46" height="6" rx="3" fill="var(--color-ochre)"/>
    <rect x="28" y="13" width="34" height="5" rx="2" fill="var(--color-ochre-soft)" opacity="0.5"/>
    {/* Ears */}
    <ellipse cx="29" cy="29" rx="3.5" ry="4.5" fill="var(--color-illustration-clay)"/>
    <ellipse cx="61" cy="29" rx="3.5" ry="4.5" fill="var(--color-illustration-clay)"/>
    {/* Eyes */}
    <ellipse cx="38" cy="27" rx="2.8" ry="2.6" fill="var(--color-text)"/>
    <ellipse cx="52" cy="27" rx="2.8" ry="2.6" fill="var(--color-text)"/>
    <circle cx="39" cy="26" r="0.9" fill="var(--color-surface)"/>
    <circle cx="53" cy="26" r="0.9" fill="var(--color-surface)"/>
    {/* Light stubble */}
    <path d="M34 36 Q45 42 56 36 Q52 40 45 41 Q38 40 34 36Z" fill="var(--color-accent)" opacity="0.3"/>
    {/* Smile */}
    <path d="M37 35 Q45 40 53 35" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Neck */}
    <rect x="38" y="43" width="14" height="9" fill="var(--color-illustration-clay)"/>
    {/* Work vest */}
    <path d="M18 55 L28 50 L62 50 L72 55 L74 112 L16 112Z" fill="var(--color-ochre)"/>
    {/* Reflective stripes */}
    <rect x="20" y="74" width="50" height="5" rx="2" fill="var(--color-ochre-soft)" opacity="0.9"/>
    <rect x="20" y="87" width="50" height="5" rx="2" fill="var(--color-ochre-soft)" opacity="0.9"/>
    {/* Left arm */}
    <path d="M18 55 L3 71 L7 81 L22 65" fill="var(--color-illustration-clay)"/>
    <ellipse cx="5" cy="82" rx="5" ry="5" fill="var(--color-illustration-clay)"/>
    {/* Right arm · wrench */}
    <path d="M72 55 L86 69 L82 79 L68 65" fill="var(--color-illustration-clay)"/>
    {/* Wrench */}
    <path d="M82 62 L92 80" stroke="var(--color-illustration-neutral)" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="82" cy="60" r="7" fill="none" stroke="var(--color-illustration-neutral)" strokeWidth="3.5"/>
    <circle cx="93" cy="81" r="5" fill="none" stroke="var(--color-illustration-neutral)" strokeWidth="3.5"/>
    {/* Pants */}
    <rect x="20" y="110" width="20" height="42" rx="4" fill="var(--color-text)"/>
    <rect x="50" y="110" width="20" height="42" rx="4" fill="var(--color-text)"/>
    {/* Boots */}
    <ellipse cx="30" cy="154" rx="12" ry="6" fill="var(--color-text)"/>
    <ellipse cx="60" cy="154" rx="12" ry="6" fill="var(--color-text)"/>
  </svg>
);

const Coordinatrice = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-clay)"/>
    {/* Headscarf */}
    <path d="M29 22 Q31 7 45 6 Q59 7 61 22 Q55 10 45 11 Q35 10 29 22Z" fill="var(--color-violet)"/>
    <path d="M29 22 Q25 32 27 40" fill="none" stroke="var(--color-violet)" strokeWidth="7" strokeLinecap="round"/>
    <path d="M61 22 Q65 30 63 38" fill="none" stroke="var(--color-violet)" strokeWidth="6" strokeLinecap="round"/>
    {/* Ears */}
    <ellipse cx="29" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-clay)"/>
    <ellipse cx="61" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-clay)"/>
    {/* Eyes */}
    <ellipse cx="38" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <ellipse cx="52" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <circle cx="39" cy="24" r="0.9" fill="var(--color-surface)"/>
    <circle cx="53" cy="24" r="0.9" fill="var(--color-surface)"/>
    {/* Smile */}
    <path d="M37 34 Q45 40 53 34" fill="none" stroke="var(--color-text)" strokeWidth="1.6" strokeLinecap="round"/>
    {/* Neck */}
    <rect x="38" y="42" width="14" height="9" fill="var(--color-illustration-clay)"/>
    {/* Shirt */}
    <path d="M20 54 L30 50 L60 50 L70 54 L72 110 L18 110Z" fill="var(--color-accent-soft)"/>
    {/* Left arm · raised, holding sign pole */}
    <path d="M20 54 Q10 40 12 28" fill="none" stroke="var(--color-illustration-clay)" strokeWidth="9" strokeLinecap="round"/>
    <ellipse cx="12" cy="26" rx="5.5" ry="5.5" fill="var(--color-illustration-clay)"/>
    {/* Sign pole */}
    <rect x="9" y="4" width="3" height="28" rx="1.5" fill="var(--color-text)"/>
    {/* Sign */}
    <rect x="-6" y="0" width="30" height="16" rx="2.5" fill="var(--color-ochre-soft)"/>
    <rect x="-6" y="0" width="30" height="16" rx="2.5" fill="none" stroke="var(--color-text)" strokeWidth="1"/>
    <text x="9" y="11" textAnchor="middle" fill="var(--color-primary-strong)" fontSize="5.5" fontFamily="Public Sans, sans-serif" fontWeight="700">POPGG</text>
    {/* Right arm */}
    <path d="M70 54 L82 66 L78 76 L66 64" fill="var(--color-illustration-clay)"/>
    <ellipse cx="80" cy="77" rx="5" ry="5" fill="var(--color-illustration-clay)"/>
    {/* Pants */}
    <rect x="22" y="108" width="19" height="44" rx="4" fill="var(--color-violet)"/>
    <rect x="49" y="108" width="19" height="44" rx="4" fill="var(--color-violet)"/>
    {/* Shoes */}
    <ellipse cx="31" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
    <ellipse cx="58" cy="154" rx="11" ry="6" fill="var(--color-text)"/>
  </svg>
);

const Renovatrice = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Afro hair */}
    <ellipse cx="45" cy="17" rx="20" ry="18" fill="var(--color-text)"/>
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Ears */}
    <ellipse cx="29" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    <ellipse cx="61" cy="28" rx="3.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Eyes */}
    <ellipse cx="38" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <ellipse cx="52" cy="25" rx="2.5" ry="2.8" fill="var(--color-text)"/>
    <circle cx="39" cy="24" r="0.9" fill="var(--color-surface)"/>
    <circle cx="53" cy="24" r="0.9" fill="var(--color-surface)"/>
    {/* Smile */}
    <path d="M38 33 Q45 38 52 33" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Paint streak on cheek */}
    <path d="M50 33 Q55 34 56 31" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Neck */}
    <rect x="38" y="42" width="14" height="9" fill="var(--color-illustration-skin)"/>
    {/* Overalls */}
    <path d="M18 55 L28 50 L62 50 L72 55 L74 112 L16 112Z" fill="var(--color-primary-soft-strong)"/>
    <rect x="34" y="50" width="22" height="26" rx="2" fill="var(--color-illustration-neutral)"/>
    <rect x="37" y="56" width="16" height="12" rx="2" fill="var(--color-primary-soft-strong)"/>
    {/* Straps */}
    <rect x="36" y="46" width="5" height="16" rx="2.5" fill="var(--color-primary-soft-strong)"/>
    <rect x="49" y="46" width="5" height="16" rx="2.5" fill="var(--color-primary-soft-strong)"/>
    {/* Paint splats */}
    <ellipse cx="28" cy="80" rx="5" ry="4" fill="var(--color-accent)" opacity="0.65"/>
    <ellipse cx="62" cy="88" rx="4" ry="3" fill="var(--color-ochre-soft)" opacity="0.75"/>
    <ellipse cx="50" cy="72" rx="3" ry="2.5" fill="var(--color-violet)" opacity="0.7"/>
    {/* Left arm */}
    <path d="M18 55 L3 70 L7 80 L22 65" fill="var(--color-illustration-skin)"/>
    <ellipse cx="5" cy="81" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Right arm · paintbrush */}
    <path d="M72 55 L86 64 L82 74 L68 65" fill="var(--color-illustration-skin)"/>
    <ellipse cx="84" cy="75" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Paintbrush handle */}
    <rect x="84" y="60" width="5" height="22" rx="2.5" fill="var(--color-illustration-clay)" transform="rotate(20 86 70)"/>
    {/* Bristles */}
    <path d="M92 54 Q98 62 93 68" fill="var(--color-accent)" stroke="var(--color-text)" strokeWidth="0.6"/>
    {/* Pants */}
    <rect x="20" y="110" width="20" height="42" rx="4" fill="var(--color-primary-soft-strong)"/>
    <rect x="50" y="110" width="20" height="42" rx="4" fill="var(--color-primary-soft-strong)"/>
    {/* Shoes */}
    <ellipse cx="30" cy="154" rx="12" ry="6" fill="var(--color-text)"/>
    <ellipse cx="60" cy="154" rx="12" ry="6" fill="var(--color-text)"/>
  </svg>
);

// ─── Characters roster ───────────────────────────────────────────────────────

const roleIcons = {
  source: Database,
  collecte: ClipboardCheck,
  reference: Waypoints,
  calcul: Calculator,
  qualite: ShieldCheck,
  methode: SlidersHorizontal,
  metier: MessageSquareCheck,
  publication: Radio,
  maintenance: RefreshCw,
} as const;

type RoleIconName = keyof typeof roleIcons;
type HairStyle = "bob" | "short" | "bun" | "curly" | "waves" | "close" | "braids" | "grey";
type FaceShape = "oval" | "round" | "long";
type Expression = "smile" | "calm" | "focused";
type CollarStyle = "v" | "crew" | "shirt";

type RoleAvatarProps = {
  icon: RoleIconName;
  skin: string;
  hair: string;
  clothing: string;
  accent: string;
  hairStyle: HairStyle;
  faceShape?: FaceShape;
  expression?: Expression;
  collar?: CollarStyle;
  glasses?: boolean;
};

const RoleAvatar = ({
  icon,
  skin,
  hair,
  clothing,
  accent,
  hairStyle,
  faceShape = "oval",
  expression = "calm",
  collar = "v",
  glasses = false,
}: RoleAvatarProps) => {
  const RoleIcon = roleIcons[icon];
  const faceSizes: Record<FaceShape, { rx: number; ry: number }> = {
    oval: { rx: 28, ry: 32 },
    round: { rx: 30, ry: 29 },
    long: { rx: 26, ry: 34 },
  };
  const face = faceSizes[faceShape];
  const hairShape = (() => {
    switch (hairStyle) {
      case "bob":
        return <path d="M41 53c0-24 11-37 28-37s29 13 29 37v26H86V49H52v30H41z" fill={hair} />;
      case "bun":
        return (
          <>
            <circle cx="69" cy="15" r="10" fill={hair} />
            <path d="M43 48c2-22 12-32 26-32s25 10 28 32c-8-10-17-14-28-14S51 38 43 48z" fill={hair} />
          </>
        );
      case "curly":
        return (
          <g fill={hair}>
            <circle cx="47" cy="34" r="11" /><circle cx="58" cy="24" r="12" /><circle cx="72" cy="22" r="12" />
            <circle cx="86" cy="27" r="12" /><circle cx="94" cy="40" r="10" /><circle cx="43" cy="47" r="9" />
          </g>
        );
      case "waves":
        return <path d="M42 49c2-21 13-33 28-33 13 0 24 8 28 25-8-7-13-9-21-8-9 2-14-3-21 1-6 3-8 9-14 15z" fill={hair} />;
      case "close":
        return <path d="M44 43c3-18 12-27 26-27 14 0 23 9 27 27-8-8-17-12-27-12S52 35 44 43z" fill={hair} />;
      case "braids":
        return (
          <g fill={hair}>
            <path d="M43 47c2-21 12-31 27-31 14 0 24 10 27 31-8-9-17-13-27-13S51 38 43 47z" />
            <circle cx="44" cy="48" r="6" /><circle cx="42" cy="59" r="5" /><circle cx="41" cy="69" r="4" />
            <circle cx="96" cy="48" r="6" /><circle cx="98" cy="59" r="5" /><circle cx="99" cy="69" r="4" />
          </g>
        );
      case "grey":
        return <path d="M43 45c2-19 12-29 27-29s25 10 28 29c-7-5-12-8-18-9l-4 8-5-9-5 7-5-6c-7 1-12 4-18 9z" fill={hair} />;
      case "short":
      default:
        return <path d="M43 46c1-20 12-30 27-30 16 0 26 10 28 30-7-8-16-12-28-12-11 0-20 4-27 12z" fill={hair} />;
    }
  })();

  const mouth = {
    smile: "M64 63.5c3.5 4 8.5 4 12 0",
    calm: "M65 64.5c3 1.5 7 1.5 10 0",
    focused: "M65 65h10",
  }[expression];

  const collarShape = {
    v: <path d="m54 91 16 16 16-16" fill="none" stroke="var(--color-surface)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.94" />,
    crew: <path d="M55 92c2 10 8 15 15 15s13-5 15-15" fill="none" stroke="var(--color-surface)" strokeWidth="5" strokeLinecap="round" opacity="0.94" />,
    shirt: (
      <>
        <path d="m54 91 16 16-7 8-15-20M86 91l-16 16 7 8 15-20" fill="var(--color-surface)" opacity="0.94" />
        <path d="M70 107v25" stroke={accent} strokeWidth="1.5" opacity="0.35" />
      </>
    ),
  }[collar];

  return (
    <svg viewBox="0 0 180 132" xmlns="http://www.w3.org/2000/svg" className="role-avatar w-full h-full" aria-hidden="true" focusable="false">
      <path d="M14 132V66C14 31 37 8 70 8s56 23 56 58v66Z" fill="var(--color-surface-translucent)" />
      <path d="M14 132V66C14 31 37 8 70 8s56 23 56 58" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.18" />
      <path d="M12 132c4-33 23-50 58-50s54 17 58 50z" fill={clothing} />
      <rect x="58" y="71" width="24" height="24" rx="9" fill={skin} />
      <ellipse cx="43" cy="53" rx="6" ry="7" fill={skin} />
      <ellipse cx="97" cy="53" rx="6" ry="7" fill={skin} />
      <ellipse cx="70" cy="51" rx={face.rx} ry={face.ry} fill={skin} />
      {hairShape}
      <path d="M54 47c2.3-1.8 5.4-2 8.2-.4M77.8 46.6c2.8-1.6 5.9-1.4 8.2.4" fill="none" stroke={hair} strokeWidth="1.7" strokeLinecap="round" opacity="0.78" />
      <ellipse cx="59" cy="52.5" rx="2" ry="2.5" fill="var(--color-text-strong)" />
      <ellipse cx="81" cy="52.5" rx="2" ry="2.5" fill="var(--color-text-strong)" />
      <circle cx="58.4" cy="51.8" r="0.65" fill="var(--color-surface)" opacity="0.9" />
      <circle cx="80.4" cy="51.8" r="0.65" fill="var(--color-surface)" opacity="0.9" />
      <path d="M69.5 54.5v4.2l2.3 1" fill="none" stroke="var(--color-text-strong)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.48" />
      <circle cx="54" cy="60" r="3.2" fill={accent} opacity="0.11" />
      <circle cx="86" cy="60" r="3.2" fill={accent} opacity="0.11" />
      <path d={mouth} fill="none" stroke="var(--color-text-strong)" strokeWidth="1.7" strokeLinecap="round" />
      {glasses && (
        <g fill="var(--color-surface)" fillOpacity="0.08" stroke="var(--color-text-strong)" strokeWidth="1.7">
          <rect x="49" y="45" width="18" height="14" rx="5" />
          <rect x="73" y="45" width="18" height="14" rx="5" />
          <path d="M67 50h6" />
        </g>
      )}
      {collarShape}
      {collar !== "shirt" && <path d="M70 107v25" fill="none" stroke={accent} strokeWidth="1.2" opacity="0.28" />}
      <path d="M116 75h5" stroke={accent} strokeWidth="1.4" opacity="0.3" />
      <circle cx="141" cy="75" r="21" fill="var(--color-surface)" stroke={accent} strokeWidth="1.4" />
      <RoleIcon x={131} y={65} width={20} height={20} color={accent} strokeWidth={1.8} />
    </svg>
  );
};

type Character = {
  name: string;
  role: string;
  desc: string;
  avatar: RoleAvatarProps;
  bg: string;
  badge: string;
};

const characters: Character[] = [
  {
    name: "Fournisseur de la donnée",
    role: "Fournit",
    desc: "Met à disposition la source, documente son périmètre, ses droits d’usage et sa fréquence de disponibilité.",
    avatar: { icon: "source", skin: "var(--color-illustration-skin-deep)", hair: "var(--color-text-strong)", clothing: "var(--color-primary)", accent: "var(--color-primary)", hairStyle: "bob", faceShape: "oval", expression: "calm", collar: "v" },
    bg: "var(--color-primary-soft)",
    badge: "Source",
  },
  {
    name: "Responsable de collecte",
    role: "Collecte",
    desc: "Organise l’acquisition des données et vérifie leur couverture territoriale et temporelle.",
    avatar: { icon: "collecte", skin: "var(--color-illustration-skin-light)", hair: "var(--color-illustration-hair-light)", clothing: "var(--color-primary)", accent: "var(--color-primary)", hairStyle: "short", faceShape: "round", expression: "smile", collar: "crew" },
    bg: "var(--color-primary-soft)",
    badge: "Collecte",
  },
  {
    name: "Référent POPGG",
    role: "Documente",
    desc: "Relie l’indicateur à un objectif politique, à un niveau L1–L4 et aux modes d’action VTT proposés.",
    avatar: { icon: "reference", skin: "var(--color-illustration-skin-medium)", hair: "var(--color-illustration-hair-warm)", clothing: "var(--color-violet)", accent: "var(--color-violet-strong)", hairStyle: "bun", faceShape: "long", expression: "calm", collar: "shirt", glasses: true },
    bg: "var(--color-violet-soft)",
    badge: "Référence",
  },
  {
    name: "Producteur du calcul",
    role: "Produit",
    desc: "Applique une méthode explicite et reproductible pour produire la valeur et ses déclinaisons territoriales.",
    avatar: { icon: "calcul", skin: "var(--color-illustration-skin-light)", hair: "var(--color-text-strong)", clothing: "var(--color-accent)", accent: "var(--color-accent-strong)", hairStyle: "waves", faceShape: "round", expression: "smile", collar: "shirt", glasses: true },
    bg: "var(--color-accent-soft)",
    badge: "Calcul",
  },
  {
    name: "Validateur de la donnée",
    role: "Contrôle",
    desc: "Vérifie la complétude, la cohérence, les ruptures de série et la version de chaque donnée mobilisée.",
    avatar: { icon: "qualite", skin: "var(--color-illustration-skin-deep)", hair: "var(--color-text-strong)", clothing: "var(--color-sage)", accent: "var(--color-sage-strong)", hairStyle: "curly", faceShape: "oval", expression: "focused", collar: "crew" },
    bg: "var(--color-sage-soft)",
    badge: "Qualité",
  },
  {
    name: "Validateur méthodologique",
    role: "Valide la méthode",
    desc: "Contrôle les définitions, l’agrégation et la comparabilité entre les territoires français, genevois et vaudois.",
    avatar: { icon: "methode", skin: "var(--color-illustration-skin-light)", hair: "var(--color-illustration-neutral)", clothing: "var(--color-primary)", accent: "var(--color-primary-strong)", hairStyle: "grey", faceShape: "long", expression: "calm", collar: "shirt", glasses: true },
    bg: "var(--color-primary-soft)",
    badge: "Méthode",
  },
  {
    name: "Validateur métier",
    role: "Valide l’usage",
    desc: "Confirme l’utilité pour le pilotage, l’interprétation raisonnable et les limites à rendre visibles.",
    avatar: { icon: "metier", skin: "var(--color-illustration-skin-medium)", hair: "var(--color-text-strong)", clothing: "var(--color-ochre)", accent: "var(--color-ochre-strong)", hairStyle: "close", faceShape: "round", expression: "smile", collar: "v" },
    bg: "var(--color-ochre-soft)",
    badge: "Métier",
  },
  {
    name: "Responsable de publication",
    role: "Publie",
    desc: "Prépare des vues adaptées aux usages publics, institutionnels et techniques sans masquer les incertitudes.",
    avatar: { icon: "publication", skin: "var(--color-illustration-skin-deep)", hair: "var(--color-text-strong)", clothing: "var(--color-violet)", accent: "var(--color-accent-strong)", hairStyle: "braids", faceShape: "oval", expression: "focused", collar: "crew" },
    bg: "var(--color-rose-soft)",
    badge: "Publication",
  },
  {
    name: "Responsable de maintenance",
    role: "Maintient",
    desc: "Planifie les mises à jour, conserve les métadonnées et clarifie qui répond de l’indicateur dans la durée.",
    avatar: { icon: "maintenance", skin: "var(--color-illustration-skin-light)", hair: "var(--color-illustration-hair-warm)", clothing: "var(--color-primary)", accent: "var(--color-primary-strong)", hairStyle: "short", faceShape: "round", expression: "calm", collar: "v" },
    bg: "var(--color-primary-soft)",
    badge: "Maintenance",
  },
];

const badgeColors: Record<string, string> = {
  Source: "var(--color-primary-soft-strong)",
  Collecte: "var(--color-primary-soft)",
  Référence: "var(--color-violet-soft)",
  Calcul: "var(--color-accent-soft)",
  Qualité: "var(--color-sage-soft)",
  Méthode: "var(--color-primary-soft)",
  Métier: "var(--color-ochre-soft)",
  Publication: "var(--color-rose-soft)",
  Maintenance: "var(--color-primary-soft-strong)",
};

const valueChain = [
  {
    title: "Source",
    action: "Fournir",
    desc: "Mettre à disposition la donnée, son périmètre, ses droits d’usage et sa fréquence.",
    owner: "Fournisseur de la donnée",
    color: "var(--color-primary-soft)",
    accent: "var(--color-primary-strong)",
  },
  {
    title: "Collecte",
    action: "Acquérir",
    desc: "Organiser l’acquisition et vérifier les couvertures territoriale et temporelle.",
    owner: "Responsable de collecte",
    color: "var(--color-primary-soft-strong)",
    accent: "var(--color-primary-strong)",
  },
  {
    title: "Référentiel",
    action: "Documenter",
    desc: "Relier l’indicateur à un objectif, à un niveau L1–L4 et aux modes d’action VTT proposés.",
    owner: "Référent POPGG",
    color: "var(--color-violet-soft)",
    accent: "var(--color-violet-strong)",
  },
  {
    title: "Calcul",
    action: "Produire",
    desc: "Appliquer une méthode explicite et reproductible aux différentes échelles territoriales.",
    owner: "Producteur du calcul",
    color: "var(--color-accent-soft)",
    accent: "var(--color-accent-strong)",
  },
  {
    title: "Contrôles",
    action: "Valider",
    desc: "Contrôler la donnée, la méthode, la comparabilité et les limites d’interprétation.",
    owner: "Validateurs donnée, méthode et métier",
    color: "var(--color-sage-soft)",
    accent: "var(--color-sage-strong)",
  },
  {
    title: "Publication",
    action: "Diffuser",
    desc: "Adapter les vues aux usages publics, institutionnels et techniques sans masquer l’incertitude.",
    owner: "Responsable de publication",
    color: "var(--color-rose-soft)",
    accent: "var(--color-accent-strong)",
  },
  {
    title: "Maintenance",
    action: "Actualiser",
    desc: "Planifier les mises à jour, conserver les métadonnées et attribuer la responsabilité dans la durée.",
    owner: "Responsable de maintenance",
    color: "var(--color-ochre-soft)",
    accent: "var(--color-ochre-strong)",
  },
];

// ─── VTT modes ───────────────────────────────────────────────────────────────

const vttModes = [
  {
    id: "preservation",
    key: "1.1 Préservation",
    label: "Préservation",
    territoryTitle: "Un territoire préservé",
    color: "var(--color-sage-soft)",
    accent: "var(--color-sage-strong)",
    axis: "Primauté du socle du vivant",
    vision:
      "Préserver le socle du vivant en garantissant la qualité des milieux naturels, agricoles, forestiers et urbains.",
    contributions: {
      environnement: "Infrastructure écologique, sols, eau, biodiversité.",
      urbanisation: "Emprise bâtie, pression foncière, espaces ouverts.",
      mobilite: "Emprises, infrastructures fragmentantes, pression des flux.",
    },
    levers: [
      { title: "Réseau hydrographique", body: "Préserver les cours d’eau et leurs espaces de fonctionnement, y compris dans les tissus bâtis, pour protéger l’eau, limiter les risques et maintenir des espaces ouverts.", illustration: { col: 0, row: 5 } },
      { title: "Infrastructure écologique", body: "Relier les milieux naturels, agricoles et urbains par un réseau d’espaces structurants, intégré aux projets d’urbanisation et de mobilité.", illustration: { col: 1, row: 5 } },
      { title: "Connexions et corridors biologiques", body: "Maintenir les corridors biologiques et rétablir les passages au droit des routes, voies ferrées et autres coupures du territoire.", illustration: { col: 2, row: 5 } },
    ],
  },
  {
    id: "reconnexion",
    key: "1.2 Reconnexion",
    label: "Reconnexion",
    territoryTitle: "Un territoire reconnecté",
    color: "var(--color-primary-soft)",
    accent: "var(--color-primary)",
    axis: "Primauté du socle du vivant",
    vision:
      "Réduire les ruptures produites par les infrastructures et les tissus bâtis afin de rétablir les continuités écologiques et les parcours humains.",
    contributions: {
      environnement: "Corridors biologiques, trames vertes et bleues.",
      urbanisation:
        "Accès aux espaces ouverts, lisières, continuités entre polarités.",
      mobilite: "Continuités cyclables, marchabilité, rabattement TP.",
    },
    levers: [
      { title: "À travers les infrastructures", body: "Créer ou réaménager des écoponts, passages et continuités cyclables ou piétonnes là où les infrastructures fragmentent les milieux et les parcours.", illustration: { col: 0, row: 3 } },
      { title: "En limite et à travers les tissus urbains", body: "Retisser les interfaces entre quartiers, espaces agricoles et milieux naturels par des pénétrantes de verdure et des cheminements continus.", illustration: { col: 1, row: 3 } },
      { title: "Par un réseau socioécologique", body: "Relier les polarités et les lieux naturels, paysagers ou culturels par un réseau de proximité végétalisé, accessible à pied et à vélo.", illustration: { col: 2, row: 3 } },
    ],
  },
  {
    id: "revitalisation",
    key: "1.3 Revitalisation",
    label: "Revitalisation",
    territoryTitle: "Un territoire revitalisé",
    color: "var(--color-accent-soft)",
    accent: "var(--color-accent-strong)",
    axis: "Primauté du socle du vivant",
    vision:
      "Adapter le territoire au dérèglement climatique et renforcer la biodiversité par une gestion renouvelée des sols, de la nature et de l’eau.",
    contributions: {
      environnement:
        "Canopée, îlots de chaleur, qualité de l’air, désimperméabilisation.",
      urbanisation: "Qualité des tissus bâtis, espaces publics, proximité.",
      mobilite:
        "Réduction des nuisances, sécurité, confort climatique des espaces de mobilité.",
    },
    levers: [
      { title: "Dans les espaces bâtis", body: "Désimperméabiliser, renforcer la canopée et gérer les eaux pluviales pour améliorer le confort des quartiers, des rues et des espaces de mobilité.", illustration: { col: 0, row: 2 } },
      { title: "Dans les terres agricoles et forestières", body: "Améliorer la rétention des sols, développer les pratiques agroécologiques et diversifier les lisières pour soutenir la biodiversité et la production locale.", illustration: { col: 1, row: 2 } },
      { title: "Dans le réseau hydrographique", body: "Remettre certains cours d’eau à ciel ouvert et restaurer les continuités hydrologiques, piscicoles et sédimentaires au contact des espaces habités.", illustration: { col: 2, row: 2 } },
    ],
  },
  {
    id: "regeneration",
    key: "2.1 Régénération",
    label: "Régénération",
    territoryTitle: "Un territoire régénéré",
    color: "var(--color-violet-soft)",
    accent: "var(--color-violet-strong)",
    axis: "Rééquilibrage multipolaire de l’agglomération",
    vision:
      "Améliorer le cadre de vie et accueillir le développement attendu en renouvelant les polarités et les tissus déjà urbanisés.",
    contributions: {
      environnement: "Intégration du vivant dans les tissus existants.",
      urbanisation: "Densification, mixité fonctionnelle, logement, services.",
      mobilite:
        "Réduction des distances contraintes, accessibilité aux centralités.",
    },
    levers: [
      { title: "Polarités urbaines régénérées", body: "Renforcer un réseau de polarités accessibles offrant logements, emplois, services, équipements et espaces publics à l’échelle des bassins de vie.", illustration: { col: 0, row: 1 } },
      { title: "Tissus bâtis régénérés", body: "Renouveler et densifier l’existant en intégrant logement, activités, nature en ville, patrimoine et qualité des espaces publics.", illustration: { col: 1, row: 1 } },
    ],
  },
  {
    id: "reseau",
    key: "2.2 Mise en réseau",
    label: "Mise en réseau",
    territoryTitle: "Un territoire mis en réseau",
    color: "var(--color-primary-soft)",
    accent: "var(--color-primary-strong)",
    axis: "Rééquilibrage multipolaire de l’agglomération",
    vision:
      "Organiser un maillage multimodal qui privilégie les mobilités actives et les transports publics tout en requalifiant les espaces publics.",
    contributions: {
      environnement: "Accès aux espaces de nature et continuités paysagères.",
      urbanisation: "Polarités, équipements structurants, centralités.",
      mobilite:
        "Desserte TP, accessibilité multimodale, flux transfrontaliers, réseaux cyclables.",
    },
    levers: [
      { title: "À travers un maillage multimodal décarboné", body: "Relier les polarités par la marche, le vélo et les transports publics, en coordonnant gares, correspondances et services partagés selon les situations territoriales.", illustration: { col: 0, row: 0 } },
      { title: "À travers la requalification des espaces publics", body: "Adapter rues, places, routes et voies vertes aux usages, au paysage, au climat et à la végétalisation.", illustration: { col: 2, row: 0 } },
    ],
  },
  {
    id: "circularite",
    key: "2.3 Circularité",
    label: "Circularité",
    territoryTitle: "Un territoire circularisé",
    color: "var(--color-ochre-soft)",
    accent: "var(--color-ochre-strong)",
    axis: "Rééquilibrage multipolaire de l’agglomération",
    vision:
      "Réduire l’usage des ressources et rapprocher production, transformation, distribution et consommation à l’échelle des bassins de vie.",
    contributions: {
      environnement: "Eau, énergie, sols, ressources, filières.",
      urbanisation:
        "Réemploi, foncier, densification de l’existant, surfaces productives.",
      mobilite: "Logistique, flux de marchandises, sobriété des déplacements.",
    },
    levers: [
      { title: "Ressources", body: "Relier production, transformation, réemploi et consommation à l’échelle locale pour réduire l’usage de ressources et les transports évitables.", illustration: { col: 0, row: 4 } },
      { title: "Réseaux de distribution", body: "Articuler plateformes régionales, centres urbains et micro-hubs pour organiser des flux de marchandises sobres et adaptés aux tissus urbains.", illustration: { col: 1, row: 4 } },
      { title: "Ressources en énergie", body: "Mobiliser les potentiels solaire, géothermique, lacustre et éolien, et les intégrer aux bâtiments et réseaux de chaleur.", illustration: { col: 2, row: 4 } },
    ],
  },
];

const modeIcons = {
  preservation: Leaf,
  reconnexion: Link2,
  revitalisation: Sprout,
  regeneration: Building2,
  reseau: Waypoints,
  circularite: Recycle,
} as const;

const ModeIcon = ({ mode, color, size = 24 }: { mode: string; color: string; size?: number }) => {
  const Icon = modeIcons[mode as keyof typeof modeIcons] ?? Recycle;

  return <Icon aria-hidden="true" focusable="false" color={color} size={size} strokeWidth={1.8} />;
};

const VTT_EXAMPLE_LIMIT = 4

function VTTConceptDiagram({
  modes,
  activeMode,
  onSelect,
}: {
  modes: typeof vttModes
  activeMode: string
  onSelect: (modeId: string) => void
}) {
  const nodes = [
    { id: "preservation", x: 360, y: 75 },
    { id: "revitalisation", x: 120, y: 210 },
    { id: "reconnexion", x: 600, y: 210 },
    { id: "circularite", x: 130, y: 500 },
    { id: "reseau", x: 590, y: 500 },
    { id: "regeneration", x: 360, y: 615 },
  ] as const

  return (
    <figure className="vtt-concept" aria-labelledby="vtt-section-title">
      <svg
        className="vtt-concept-svg"
        viewBox="0 0 720 720"
        aria-hidden="true"
        focusable="false"
      >
        <g fill="none" stroke="var(--color-primary)" strokeDasharray="2 5" strokeLinecap="round" strokeWidth="2">
          {nodes.map((node) => (
            <line key={node.id} x1="360" y1="340" x2={node.x} y2={node.y} />
          ))}
        </g>

        {nodes.map((node) => {
          const mode = modes.find((item) => item.id === node.id)
          const Icon = modeIcons[node.id]
          if (!mode) return null

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r="50"
                fill={activeMode === node.id ? mode.color : "var(--color-canvas)"}
                stroke="var(--color-accent)"
                strokeWidth="3"
              />
              <Icon
                x={node.x - 22}
                y={node.y - 22}
                width="44"
                height="44"
                color={mode.accent}
                strokeWidth="1.8"
              />
              <text
                x={node.x}
                y={node.y + 75}
                fill="var(--color-primary)"
                fontFamily="Public Sans, sans-serif"
                fontSize="18"
                fontWeight={activeMode === node.id ? 700 : 500}
                textAnchor="middle"
              >
                {mode.label.toUpperCase()}
              </text>
            </g>
          )
        })}

        <circle cx="360" cy="340" r="145" fill="var(--color-accent)" />
        <text
          x="360"
          y="300"
          fill="var(--color-surface)"
          fontFamily="Public Sans, sans-serif"
          fontSize="20"
          fontWeight="700"
          textAnchor="middle"
        >
          <tspan x="360" dy="0">LES TRANSFORMATIONS</tspan>
          <tspan x="360" dy="30">TERRITORIALES DU</tspan>
          <tspan x="360" dy="30">GRAND GENÈVE</tspan>
        </text>
        <text
          x="360"
          y="410"
          fill="var(--color-surface)"
          fontFamily="Public Sans, sans-serif"
          fontSize="21"
          fontWeight="400"
          textAnchor="middle"
        >
          À HORIZON 2050
        </text>
      </svg>

      {nodes.map((point) => {
        const mode = modes.find((item) => item.id === point.id)
        if (!mode) return null
        return (
          <button
            key={mode.id}
            type="button"
            className="vtt-concept-hotspot"
            style={
              {
                left: `${(point.x / 720) * 100}%`,
                top: `${(point.y / 720) * 100}%`,
                "--concept-mode-accent": mode.accent,
              } as CSSProperties
            }
            aria-label={`${mode.label} · ${activeMode === mode.id ? "mode sélectionné" : "afficher ce mode"}`}
            aria-pressed={activeMode === mode.id}
            onClick={() => onSelect(mode.id)}
          />
        )
      })}
    </figure>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeMode, setActiveMode] = useState("preservation");
  const [page, setPage] = useState<"home" | "indicateurs">(() =>
    window.location.hash === "#indicateurs" ? "indicateurs" : "home",
  );
  const [actorView, setActorView] = useState<"responsabilites" | "chaine">("chaine");
  const current = vttModes.find((m) => m.id === activeMode)!;

  useEffect(() => {
    const syncPageWithHash = () => {
      setPage(window.location.hash === "#indicateurs" ? "indicateurs" : "home");
    };

    window.addEventListener("hashchange", syncPageWithHash);
    return () => window.removeEventListener("hashchange", syncPageWithHash);
  }, []);

  const openIndicators = () => {
    window.location.hash = "indicateurs";
  };

  const returnHome = () => {
    window.location.hash = "vtt";
  };

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  }, [page]);

  if (page === "indicateurs") {
    return <IndicateursPage onBack={returnHome} />;
  }

  const statsL1 = indicateurs.filter((i) => i.liste === "L1").length;
  const statsL2 = indicateurs.filter((i) => i.liste === "L2").length;
  // Definitions follow the study's four maturity levels; source ratings stay unchanged.
  const preparationDescriptions: Record<number, string> = {
    1: "Méthode ou données encore à construire.",
    2: "Données à retraiter ou à harmoniser.",
    3: "Données disponibles, calcul à formaliser.",
    4: "Valeur déjà calculée et réutilisable.",
  };
  const poles = ["Environnement", "Mobilité", "Urbanisation", "Gouvernance"] as const;
  const currentPrimaryIndicators = indicateurs.filter((i) => i.lienVTT === current.key);
  const currentSecondaryIndicators = indicateurs.filter((i) => vttKeys(i).includes(current.key) && i.lienVTT !== current.key);
  const relatedIndicators = [
    ...currentPrimaryIndicators.map((ind) => ({ ind, relation: "Principal" as const })),
    ...currentSecondaryIndicators
      .filter((ind) => !currentPrimaryIndicators.some((primary) => primary.id === ind.id))
      .map((ind) => ({ ind, relation: "Secondaire" as const })),
  ];
  const currentExamples = relatedIndicators.reduce<typeof relatedIndicators>((examples, item) => {
    if (examples.length < VTT_EXAMPLE_LIMIT && !examples.some((example) => example.ind.pole === item.ind.pole)) {
      examples.push(item);
    }
    return examples;
  }, []);
  relatedIndicators.forEach((item) => {
    if (currentExamples.length < VTT_EXAMPLE_LIMIT && !currentExamples.some((example) => example.ind.id === item.ind.id)) {
      currentExamples.push(item);
    }
  });
  const implementationRows = vttModes.map((mode) => {
    const linkedIndicators = indicateurs.filter(
      (ind) => vttKeys(ind).includes(mode.key),
    );

    return {
      ...mode,
      linkedPoles: new Set(linkedIndicators.map((ind) => ind.pole)),
      hasL1: linkedIndicators.some((ind) => ind.liste === "L1"),
      hasL2: linkedIndicators.some((ind) => ind.liste === "L2"),
    };
  });

  return (
    <div className="min-h-full" style={{ fontFamily: "'Public Sans', sans-serif", background: "var(--color-canvas)" }}>

      {/* Nav */}
      <nav
        className="main-nav sticky top-0 z-50 flex items-center justify-between"
        style={{ background: "var(--color-canvas)", borderBottom: "1.5px solid var(--color-border)" }}
      >
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 18, color: "var(--color-primary-strong)", letterSpacing: "-0.02em" }}>
            POPGG
          </span>
          <span className="text-xs hidden sm:inline" style={{ color: "var(--color-text)", opacity: 0.55 }}>
            Observatoire territorial du Grand Genève
          </span>
        </div>
        <div className="flex gap-5 text-sm font-medium" style={{ color: "var(--color-text)" }}>
          <a href="#acteurs" className="hover:text-[var(--color-primary)] transition-colors">Acteurs</a>
          <a href="#vtt" className="hover:text-[var(--color-primary)] transition-colors">
            <span className="nav-label-full">Modes d’action</span>
            <span className="nav-label-short" aria-hidden="true">Modes</span>
          </a>
          <a
            href="#indicateurs"
            className="nav-indicators-cta flex items-center gap-2 font-semibold"
            aria-label="Consulter les fiches indicateurs"
          >
            Indicateurs
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "var(--color-primary-soft-strong)", borderBottom: "1px solid var(--color-border)" }} className="home-hero relative overflow-hidden">
        <div className="home-hero-content site-frame pt-12 pb-0">
          <div className="relative z-10 max-w-3xl mb-8">
            <h1 style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              lineHeight: 1.1,
              color: "var(--color-primary-strong)",
              letterSpacing: "-0.02em",
              textWrap: "balance",
            }}>
              POPGG, le tableau de bord territorial du Grand Genève
            </h1>
            <p
              className="mt-3"
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 17,
                fontStyle: "italic",
                fontWeight: 600,
                color: "var(--color-accent-strong)",
              }}
            >
              Ménager, hybrider et renouveler le territoire
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text)", maxWidth: 600 }}>
              Suivre les transformations du Grand Genève pour éclairer la décision publique.
            </p>
            <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)", maxWidth: 440 }}>
              Catalogue mis à jour le {catalogueMetadata.sourceDate}.
            </p>
          </div>
          <img
            src={homeIllustration}
            alt="Scène territoriale illustrée du Grand Genève : bâti, espaces verts, mobilités et acteurs"
            className="home-hero-illustration relative z-10 w-full max-w-3xl block"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
        </div>
      </section>

      {/* Accent bar */}
      <div style={{ height: 5, background: "var(--color-accent-soft)" }}/>

      {/* Indicator counts and readiness answer two separate questions. */}
      <section className="indicator-overview" aria-labelledby="indicator-overview-title">
        <div className="site-frame">
          <div className="indicator-overview-heading">
            <div>
              <h2 id="indicator-overview-title">
                {indicateurs.length} indicateurs pour suivre le territoire
              </h2>
              <p>
                Les fiches documentent la définition, les données et la méthode de chaque indicateur.
              </p>
            </div>
            <button
              onClick={openIndicators}
              className="primary-cta indicator-overview-cta"
            >
              Consulter les fiches
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <h3>Quatre pôles thématiques</h3>
          <dl className="indicator-overview-themes">
            {poles.map((pole) => {
              const count = indicateurs.filter((i) => i.pole === pole).length;
              const colors = poleColors[pole];
              const PoleIcon = poleOverviewIcons[pole as keyof typeof poleOverviewIcons] ?? Building2;
              return (
                <div key={pole} style={{ background: colors.bg, color: colors.accent }}>
                  <dt><PoleIcon aria-hidden="true" size={18} strokeWidth={1.8} />{pole}</dt>
                  <dd><span>{count}</span> {count === 1 ? "indicateur" : "indicateurs"}</dd>
                </div>
              );
            })}
          </dl>

          <div className="indicator-overview-readiness">
            <h3>Quatre niveaux de maturité</h3>
            <p>
              La maturité porte sur les données et la méthode, pas sur les résultats des politiques.
            </p>
            <dl className="indicator-readiness-list" aria-label={`État de préparation des ${indicateurs.length} indicateurs`}>
              {maturityCounts(indicateurs).map(({ level, count }) => (
                <div key={level}>
                  <dt>
                    <span className="indicator-readiness-label">
                      <span className="indicator-readiness-dot" style={{ background: maturiteColor[level] }} aria-hidden="true" />
                      {maturiteLabel[level]}
                    </span>
                    <span className="indicator-readiness-description">{preparationDescriptions[level]}</span>
                  </dt>
                  <dd><span>{count}</span> {count === 1 ? "indicateur" : "indicateurs"}</dd>
                </div>
              ))}
            </dl>
            <p className="indicator-overview-note">Classement à confirmer avec les producteurs.</p>
          </div>

          <details className="indicator-overview-source">
            <summary>Périmètre et source</summary>
            <p>
              Classeur du {catalogueMetadata.sourceDate} · {statsL1} indicateurs L1 · {statsL2} indicateurs L2.
              Les listes complémentaires L3 et L4 restent accessibles dans le catalogue.
            </p>
          </details>
        </div>
      </section>

      {/* Characters */}
      <section id="acteurs" className="site-frame page-section page-section-actors">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "var(--color-primary-strong)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}>
              Qui fait vivre un indicateur POPGG ?
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text)", maxWidth: 600, opacity: 0.8 }}>
              Deux vues présentent les responsabilités et la chaîne de production d’un indicateur.
            </p>
          </div>

          <div
            className="actor-view-switch inline-flex self-start md:self-auto rounded-full p-1 shrink-0"
            style={{ background: "var(--color-surface-soft)", border: "1px solid var(--color-border)" }}
            role="group"
            aria-label="Choisir la représentation des acteurs"
          >
            {([
              ["responsabilites", "Responsabilités"],
              ["chaine", "Chaîne de valeur"],
            ] as const).map(([view, label]) => {
              const selected = actorView === view;
              return (
                <button
                  key={view}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActorView(view)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                  style={{
                    background: selected ? "var(--color-primary)" : "transparent",
                    color: selected ? "var(--color-surface)" : "var(--color-text)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <details className="actor-method-note mb-10 max-w-4xl">
          <summary className="py-3 text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
            D’où vient cette chaîne ?
          </summary>
          <div className="pb-5" style={{ color: "var(--color-text)" }}>
            <p className="text-sm leading-relaxed">
              Cette représentation croise trois apports du corpus de l’Étude indicateurs.
            </p>
            <dl className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <dt className="text-xs font-semibold" style={{ color: "var(--color-primary-strong)" }}>Chaîne de valeur</dt>
                <dd className="mt-1 text-sm leading-relaxed">Le parcours de l’objectif politique à la décision et à la réorientation.</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold" style={{ color: "var(--color-primary-strong)" }}>Responsabilités</dt>
                <dd className="mt-1 text-sm leading-relaxed">Les fonctions nécessaires, de la fourniture des données à leur maintenance.</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold" style={{ color: "var(--color-primary-strong)" }}>Hypothèses de travail</dt>
                <dd className="mt-1 text-sm leading-relaxed">La séparation des validations et le rôle transversal du référent POPGG, à confirmer.</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Sources : narratif VTT, rapport final et note stratégique de l’Étude indicateurs.
            </p>
          </div>
        </details>

        {actorView === "responsabilites" ? (
          <div className="actor-card-grid grid grid-cols-1 sm:grid-cols-3">
            {characters.map((c) => (
              <div
                key={c.name}
                className="actor-card rounded-xl overflow-hidden flex flex-col"
                style={{ border: "1px solid var(--color-border)", background: c.bg, boxShadow: "var(--shadow-sm)" }}
              >
                <div className="actor-card-visual flex items-center justify-center px-5 pt-3" style={{ height: 160 }}>
                  <div style={{ height: 144, width: "100%", maxWidth: 250 }}>
                    <RoleAvatar {...c.avatar} />
                  </div>
                </div>
                <div className="p-4 pt-3.5 flex-1" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 17, color: "var(--color-primary-strong)", lineHeight: 1.2 }}>
                      {c.name}
                    </span>
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: badgeColors[c.badge] ?? "var(--color-primary-soft)", color: "var(--color-primary-strong)" }}
                    >
                      {c.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--color-accent-strong)" }}>{c.role}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="value-chain-view" aria-label="Chaîne de valeur d’un indicateur POPGG">
            <ol className="value-chain">
              {valueChain.map((step, index) => (
                <li
                  key={step.title}
                  className="value-chain-step rounded-xl p-4"
                  style={{ background: step.color, border: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center justify-start gap-2 mb-3">
                    <span
                      className="flex items-center justify-center rounded-full text-xs font-bold"
                      style={{ width: 28, height: 28, background: "var(--color-surface-translucent)", color: step.accent }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="value-chain-action text-xs font-semibold" style={{ color: step.accent }}>
                      {step.action}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 18, lineHeight: 1.15, color: step.accent }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {step.desc}
                  </p>
                  <p className="value-chain-owner mt-4 pt-3 text-[11px] font-semibold leading-snug" style={{ color: step.accent }}>
                    {step.owner}
                  </p>
                </li>
              ))}
            </ol>

          </div>
        )}
      </section>

      {/* VTT Modes */}
      <section id="vtt" style={{ background: "var(--color-canvas-cool)" }} className="page-section page-section-vtt">
        <div className="site-frame">
          <div className="mb-8">
            <h2 id="vtt-section-title" style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "var(--color-text-strong)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}>
              Un territoire commun, six modes d’action
            </h2>
            <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--color-text)", maxWidth: 690 }}>
              La VTT relie transformations territoriales, leviers et indicateurs.
            </p>
          </div>

          <VTTConceptDiagram modes={vttModes} activeMode={activeMode} onSelect={setActiveMode} />

          <header className="vtt-mode-intro mb-6" aria-live="polite" aria-atomic="true">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h3 style={{
                  fontFamily: "'Newsreader', serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.65rem, 3vw, 2.2rem)",
                  color: current.accent,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}>
                  {current.territoryTitle}
                </h3>
                <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--color-text)", maxWidth: 720 }}>
                  {current.vision}
                </p>
              </div>
              <p className="text-xs leading-relaxed lg:text-right" style={{ color: "var(--color-text-muted)", maxWidth: 330 }}>
                <span className="font-semibold">Axe VTT :</span> {current.axis}
              </p>
            </div>
          </header>

          {/* Active mode panel */}
          <article
            id={`vtt-mode-${current.id}`}
            className="vtt-mode-panel rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
            aria-live="polite"
          >
            <div className="vtt-mode-levers p-7 sm:p-8" style={{ background: current.color }}>
              <h4 style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 19, color: current.accent }}>
                Leviers territoriaux
              </h4>
              <ul
                className="vtt-lever-list"
                style={{ "--vtt-lever-count": current.levers.length } as CSSProperties}
              >
                {current.levers.map((lever) => (
                  <li key={lever.title} className="vtt-lever">
                    <div
                      className="vtt-lever-illustration"
                      role="img"
                      aria-label={`Illustration du levier ${lever.title}`}
                      style={{
                        backgroundImage: `url(${vttLevers})`,
                        backgroundPosition: `calc(${lever.illustration.col * 50}% + ${lever.illustration.col === 0 ? 28 : 0}px) ${lever.illustration.row * 20}%`,
                      }}
                    />
                    <h5 className="text-sm font-semibold" style={{ color: current.accent }}>{lever.title}</h5>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: current.accent, opacity: 0.82 }}>{lever.body}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="vtt-indicator-strip px-6 py-5 sm:px-8 sm:py-6" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
              <div className="vtt-indicator-strip-heading">
                <h4 style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 19, color: "var(--color-primary-strong)" }}>
                  Exemples d’indicateurs associés
                </h4>
              </div>

              {currentExamples.length > 0 ? (
                <ul className="vtt-indicator-examples">
                  {currentExamples.map(({ ind, relation }) => {
                    const pole = poleColors[ind.pole];
                    return (
                      <li key={`${ind.id}-${relation}`} className="vtt-indicator-example">
                        <div className="vtt-indicator-example-meta">
                          <span className="text-[11px] font-bold tracking-wide" style={{ color: pole.accent }}>{ind.id}</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: pole.bg, color: pole.accent }}>{ind.pole}</span>
                          <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>{relation}</span>
                        </div>
                        <p className="vtt-indicator-example-name" style={{ color: "var(--color-primary-strong)" }}>{ind.nom}</p>
                        <div className="vtt-indicator-example-maturity">
                          <span
                            aria-hidden="true"
                            className="shrink-0 rounded-full"
                            style={{ width: 8, height: 8, background: maturiteColor[ind.maturite] }}
                          />
                          <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                            Maturité {ind.maturite} · {maturiteLabel[ind.maturite]}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Aucun indicateur associé dans la liste de travail actuelle.</p>
              )}
            </div>
          </article>

          <div className="flex justify-end mt-4">
            <button
              onClick={openIndicators}
              className="vtt-explore-button inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 text-sm font-semibold rounded-full px-5 py-2 transition-colors"
              style={{ color: "var(--color-primary)", border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
            >
              Explorer les fiches
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className="mt-5 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)", maxWidth: 720 }}>
            Source : Vision territoriale transfrontalière 2050 · catalogue du {catalogueMetadata.sourceDate}.
          </p>
        </div>
      </section>

      <section
        id="mise-en-oeuvre"
        className="page-section page-section-implementation"
        style={{ background: "var(--color-canvas)" }}
      >
        <div className="site-frame">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
            <div>
              <h2
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  color: "var(--color-text-strong)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                Mise en œuvre par horizon
              </h2>
              <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--color-text)", maxWidth: 700 }}>
                La matrice relie les modes d’action aux pôles d’observation et aux horizons L1/L2.
              </p>
            </div>
            <span className="self-start lg:self-auto text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "var(--color-primary-soft)", color: "var(--color-primary-strong)" }}>
              Lecture provisoire
            </span>
          </div>

          <p
            className="matrix-scroll-hint mb-3 text-xs sm:hidden"
            style={{ color: "var(--color-text-muted)" }}
          >
            Faites défiler la matrice horizontalement pour voir les pôles et les horizons.
          </p>

          <div
            className="implementation-matrix-scroll rounded-2xl overflow-x-auto"
            role="region"
            aria-label="Matrice de mise en œuvre des modes d’action VTT"
            tabIndex={0}
            style={{ border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
          >
            <table className="implementation-matrix w-full border-collapse">
              <caption className="sr-only">
                Liens proposés entre les six modes d’action VTT, les pôles d’observation et les horizons L1 et L2 du portefeuille d’indicateurs.
              </caption>
              <thead>
                <tr>
                  <th scope="col" rowSpan={2} className="matrix-mode-heading text-left">Mode d’action</th>
                  <th scope="colgroup" colSpan={4}>Pôles d’observation</th>
                  <th scope="colgroup" colSpan={2}>Horizon du portefeuille</th>
                </tr>
                <tr>
                  {poles.map((pole) => (
                    <th key={pole} scope="col" className="matrix-pole-heading">{pole}</th>
                  ))}
                  <th scope="col">2026–27</th>
                  <th scope="col">2028</th>
                </tr>
              </thead>
              <tbody>
                {implementationRows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" className="matrix-mode-cell text-left">
                      <span className="matrix-mode-icon" style={{ background: row.color, color: row.accent }}>
                        <ModeIcon mode={row.id} color={row.accent} />
                      </span>
                      <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 17, color: "var(--color-primary-strong)" }}>
                        {row.label}
                      </span>
                    </th>
                    {poles.map((pole) => {
                      const linked = row.linkedPoles.has(pole);
                      return (
                        <td key={pole} className="matrix-pole-cell" title={linked ? `${pole} : lien proposé` : `${pole} : aucun lien proposé`}>
                          <span className="sr-only">{linked ? `Lien proposé avec le pôle ${pole}` : `Aucun lien proposé avec le pôle ${pole}`}</span>
                          <span
                            aria-hidden="true"
                            className={`matrix-dot ${linked ? "is-linked" : ""}`}
                            style={linked ? { background: poleColors[pole].light } : undefined}
                          />
                        </td>
                      );
                    })}
                    <td className="matrix-horizon-cell">
                      <span className={`matrix-status ${row.hasL1 ? "is-l1" : "is-unset"}`}>
                        {row.hasL1 ? "Démarrage L1" : "À cadrer"}
                      </span>
                    </td>
                    <td className="matrix-horizon-cell">
                      <span className={`matrix-status ${row.hasL2 ? "is-l2" : "is-unset"}`}>
                        {row.hasL2 ? "Consolidation L2" : "À cadrer"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="implementation-legend flex flex-wrap gap-x-7 gap-y-3 mt-5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="matrix-dot is-linked" style={{ background: "var(--color-primary)" }} />
              Lien principal ou secondaire proposé
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="matrix-dot" />
              Aucun lien dans la liste de travail actuelle
            </span>
            <span>Un horizon est indiqué lorsqu’au moins un indicateur L1 ou L2 est présent.</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="main-footer flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5"
        style={{ background: "var(--color-primary-soft)", borderTop: "1px solid var(--color-border)" }}
      >
        <div>
          <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 16, color: "var(--color-primary-strong)" }}>
            POPGG
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--color-primary)" }}>Grand Genève</span>
        </div>
        <p className="text-xs text-center" style={{ color: "var(--color-primary-strong)", opacity: 0.65 }}>
          Observatoire territorial du Grand Genève
        </p>
      </footer>
    </div>
  );
}
