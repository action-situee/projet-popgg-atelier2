import { useLayoutEffect, useState } from "react";
import homeIllustration from "@/imports/home.481ab0667bd5.svg";
import IndicateursPage from "@/IndicateursPage";
import { indicateurs, poleColors, maturiteColor, maturiteLabel } from "@/data/indicators";

// ─── Shared style tokens ─────────────────────────────────────────────────────
// Palette sourced from Grand Genève: lake, alpine greens, institutional blues,
// terracotta accents — kept editable and vectorial throughout.

// ─── Character SVGs ──────────────────────────────────────────────────────────
// Style: flat vector, dark-ink outlines via fill, skin var(--color-illustration-skin), limited palette.
// Figures are territory users, drawn in a clear institutional illustration style.

const Observatrice = () => (
  <svg viewBox="0 0 90 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Head */}
    <ellipse cx="45" cy="27" rx="16" ry="17" fill="var(--color-illustration-skin)"/>
    {/* Hair — straight bob */}
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
    {/* Left arm — holding tablet */}
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
    {/* Left arm — blueprint */}
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
    {/* Right arm — rolled plans */}
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

// Mathieu — cyclist, rider properly seated on bicycle, leaning forward
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
    {/* Head — centered above handlebar area, leaning forward */}
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
    {/* Torso — cycling jersey, leaning forward (~45°) */}
    {/* Hips at saddle (50,70), shoulders at (72,58), head at (80,42) */}
    <path d="M48 70 L52 74 L76 66 L80 58 L68 56 L44 64Z" fill="var(--color-violet-soft)"/>
    {/* Jersey pockets on back */}
    <rect x="44" y="64" width="10" height="7" rx="2" fill="var(--color-violet)"/>
    {/* Left arm — reaching down to handlebar drops */}
    <path d="M68 58 Q76 62 88 72" fill="none" stroke="var(--color-illustration-skin)" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="89" cy="73" rx="5" ry="5" fill="var(--color-illustration-skin)"/>
    {/* Right arm */}
    <path d="M76 58 Q82 62 93 70" fill="none" stroke="var(--color-illustration-skin)" strokeWidth="7" strokeLinecap="round"/>
    <ellipse cx="94" cy="71" rx="4.5" ry="4.5" fill="var(--color-illustration-skin)"/>
    {/* Left leg — pedal down */}
    <path d="M50 72 Q46 90 52 112" fill="none" stroke="var(--color-text)" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="52" cy="114" rx="9" ry="5" fill="var(--color-text)"/>
    {/* Right leg — pedal up */}
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
    {/* Left arm — binoculars */}
    <path d="M20 54 L5 70 L9 80 L24 64" fill="var(--color-illustration-skin)"/>
    {/* Binoculars */}
    <rect x="-4" y="70" width="14" height="9" rx="3" fill="var(--color-text)"/>
    <circle cx="1" cy="74.5" r="4" fill="var(--color-primary-strong)"/>
    <circle cx="9" cy="74.5" r="4" fill="var(--color-primary-strong)"/>
    <circle cx="1" cy="74.5" r="2" fill="var(--color-primary)" opacity="0.6"/>
    <circle cx="9" cy="74.5" r="2" fill="var(--color-primary)" opacity="0.6"/>
    {/* Right arm — notebook */}
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
    {/* Eyebrows — expressive */}
    <path d="M33 19 Q38 16 43 19" fill="none" stroke="var(--color-illustration-neutral)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M47 19 Q52 16 57 19" fill="none" stroke="var(--color-illustration-neutral)" strokeWidth="2" strokeLinecap="round"/>
    {/* Smile */}
    <path d="M37 34 Q45 40 53 34" fill="none" stroke="var(--color-text)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Neck */}
    <rect x="38" y="42" width="14" height="9" fill="var(--color-illustration-skin)"/>
    {/* White shirt */}
    <rect x="36" y="48" width="18" height="18" fill="var(--color-canvas)"/>
    {/* Tie — swiss cross red */}
    <path d="M43 52 L45 72 L47 52Z" fill="var(--color-accent)"/>
    <rect x="43" y="58" width="4" height="3" fill="var(--color-accent)"/>
    {/* Suit jacket */}
    <path d="M18 58 L28 50 L62 50 L72 58 L74 110 L16 110Z" fill="var(--color-primary)"/>
    <path d="M28 50 L38 62 L45 50" fill="var(--color-primary-strong)"/>
    <path d="M62 50 L52 62 L45 50" fill="var(--color-primary-strong)"/>
    {/* Pin / badge */}
    <circle cx="34" cy="70" r="5.5" fill="var(--color-ochre-soft)"/>
    <circle cx="34" cy="70" r="3" fill="var(--color-accent)"/>
    {/* Left arm — papers */}
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
    {/* Right arm — wrench */}
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
    {/* Left arm — raised, holding sign pole */}
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
    {/* Right arm — paintbrush */}
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

const characters = [
  {
    name: "Fournisseur de la donnée",
    role: "Fournit",
    desc: "Met à disposition la source, documente son périmètre, ses droits d’usage et sa fréquence de disponibilité.",
    Component: Observatrice,
    bg: "var(--color-primary-soft)",
    badge: "Source",
  },
  {
    name: "Responsable de collecte",
    role: "Collecte",
    desc: "Organise l’acquisition des données et vérifie leur couverture territoriale et temporelle.",
    Component: Urbaniste,
    bg: "var(--color-primary-soft)",
    badge: "Collecte",
  },
  {
    name: "Référent POPGG",
    role: "Documente",
    desc: "Relie l’indicateur à un objectif politique, à un niveau L1–L4 et aux modes VTT proposés.",
    Component: Architecte,
    bg: "var(--color-violet-soft)",
    badge: "Référence",
  },
  {
    name: "Producteur du calcul",
    role: "Produit",
    desc: "Applique une méthode explicite et reproductible pour produire la valeur et ses déclinaisons territoriales.",
    Component: Cycliste,
    bg: "var(--color-accent-soft)",
    badge: "Calcul",
  },
  {
    name: "Validateur de la donnée",
    role: "Contrôle",
    desc: "Vérifie la complétude, la cohérence, les ruptures de série et la version de chaque donnée mobilisée.",
    Component: Ecologue,
    bg: "var(--color-sage-soft)",
    badge: "Qualité",
  },
  {
    name: "Validateur méthodologique",
    role: "Valide la méthode",
    desc: "Contrôle les définitions, l’agrégation et la comparabilité entre les territoires français, genevois et vaudois.",
    Component: Elu,
    bg: "var(--color-primary-soft)",
    badge: "Méthode",
  },
  {
    name: "Validateur métier",
    role: "Valide l’usage",
    desc: "Confirme l’utilité pour le pilotage, l’interprétation raisonnable et les limites à rendre visibles.",
    Component: Batisseur,
    bg: "var(--color-ochre-soft)",
    badge: "Métier",
  },
  {
    name: "Responsable de publication",
    role: "Publie",
    desc: "Prépare des vues adaptées aux usages publics, institutionnels et techniques sans masquer les incertitudes.",
    Component: Coordinatrice,
    bg: "var(--color-rose-soft)",
    badge: "Publication",
  },
  {
    name: "Responsable de maintenance",
    role: "Maintient",
    desc: "Planifie les mises à jour, conserve les métadonnées et clarifie qui répond de l’indicateur dans la durée.",
    Component: Renovatrice,
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
    desc: "Relier l’indicateur à un objectif, à un niveau L1–L4 et aux modes VTT proposés.",
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
    color: "var(--color-sage-soft)",
    accent: "var(--color-sage-strong)",
    num: "1.1",
    headline: "Primauté du socle du vivant",
    description:
      "Les ressources et espaces structurants du Grand Genève sont-ils ménagés et sécurisés ?",
    cards: [
      { title: "ENV-10 · Infrastructure écologique", body: "Rattachement principal proposé, avec Reconnexion comme mode secondaire.", tag: "L1" },
      { title: "ENV-19 · Artificialisation des sols", body: "Rattachement principal proposé, avec Régénération comme mode secondaire.", tag: "L1" },
      { title: "ENV-14 · État des masses d’eau", body: "Rattachement principal proposé, avec Revitalisation comme mode secondaire.", tag: "L2" },
    ],
  },
  {
    id: "reconnexion",
    key: "1.2 Reconnexion",
    label: "Reconnexion",
    color: "var(--color-primary-soft)",
    accent: "var(--color-primary)",
    num: "1.2",
    headline: "Primauté du socle du vivant",
    description:
      "Les continuités écologiques, paysagères, sociales et actives sont-elles restaurées ou renforcées ?",
    cards: [
      { title: "Aucun rattachement principal", body: "Le préclassement actuel ne place aucun indicateur L1 ou L2 dans ce mode principal.", tag: "À confirmer" },
      { title: "ENV-10 · Infrastructure écologique", body: "Reconnexion est proposée comme mode secondaire de cet indicateur L1.", tag: "Secondaire" },
      { title: "MOB-14 · Réseau cyclable", body: "Reconnexion est proposée comme mode secondaire de cet indicateur L1.", tag: "Secondaire" },
    ],
  },
  {
    id: "revitalisation",
    key: "1.3 Revitalisation",
    label: "Revitalisation",
    color: "var(--color-accent-soft)",
    accent: "var(--color-accent-strong)",
    num: "1.3",
    headline: "Primauté du socle du vivant",
    description:
      "Les milieux bâtis, agricoles, forestiers et hydrographiques gagnent-ils en qualité, résilience et habitabilité ?",
    cards: [
      { title: "ENV-03 · Qualité de l’air", body: "Rattachement principal proposé, avec Mise en réseau comme mode secondaire.", tag: "L1" },
      { title: "ENV-12 · Îlots de chaleur", body: "Rattachement principal proposé, avec Régénération comme mode secondaire.", tag: "L1" },
    ],
  },
  {
    id: "regeneration",
    key: "2.1 Régénération",
    label: "Régénération",
    color: "var(--color-violet-soft)",
    accent: "var(--color-violet-strong)",
    num: "2.1",
    headline: "Rééquilibrage multipolaire de l’agglomération",
    description:
      "Les tissus et polarités existants accueillent-ils mieux habitants, emplois, logements, services et équipements ?",
    cards: [
      { title: "URB-01 · Densité urbaine", body: "Rattachement principal proposé, avec Préservation comme mode secondaire.", tag: "L1" },
      { title: "URB-07 · Équilibre emplois-habitants", body: "Rattachement principal proposé, avec Mise en réseau comme mode secondaire.", tag: "L1" },
      { title: "URB-17 · Accessibilité du logement", body: "Le mode secondaire « Gouvernance territoriale » reste à confirmer hors des six modes VTT.", tag: "L1" },
    ],
  },
  {
    id: "reseau",
    key: "2.2 Mise en réseau",
    label: "Mise en réseau",
    color: "var(--color-primary-soft)",
    accent: "var(--color-primary-strong)",
    num: "2.2",
    headline: "Rééquilibrage multipolaire de l’agglomération",
    description:
      "Les polarités et bassins de vie sont-ils reliés par des mobilités décarbonées et adaptées aux contextes territoriaux ?",
    cards: [
      { title: "MOB-04 · Parts modales", body: "Rattachement principal proposé, avec Revitalisation comme mode secondaire.", tag: "L1" },
      { title: "MOB-13 · Desserte en transports publics", body: "Rattachement principal proposé, avec Régénération comme mode secondaire.", tag: "L1" },
      { title: "MOB-22 · Parts modales aux frontières", body: "Rattachement principal proposé, avec Régénération comme mode secondaire.", tag: "L2" },
    ],
  },
  {
    id: "circularite",
    key: "2.3 Circularité",
    label: "Circularité",
    color: "var(--color-ochre-soft)",
    accent: "var(--color-ochre-strong)",
    num: "2.3",
    headline: "Rééquilibrage multipolaire de l’agglomération",
    description:
      "Les ressources, flux et filières locales sont-ils mieux bouclés à l’échelle du bassin de vie ?",
    cards: [
      { title: "ENV-01 · Empreinte carbone", body: "Rattachement principal proposé, avec Mise en réseau comme mode secondaire.", tag: "L2" },
      { title: "ENV-18 · Consommation d’énergie", body: "Rattachement principal proposé, avec Régénération comme mode secondaire.", tag: "L2" },
      { title: "URB-06 · Surface productive", body: "Rattachement principal proposé, avec Régénération comme mode secondaire.", tag: "L2" },
    ],
  },
];

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeMode, setActiveMode] = useState("preservation");
  const [page, setPage] = useState<"home" | "indicateurs">("home");
  const [actorView, setActorView] = useState<"responsabilites" | "chaine">("responsabilites");
  const current = vttModes.find((m) => m.id === activeMode)!;
  const currentCount = indicateurs.filter((i) => i.lienVTT === current.key).length;

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  }, [page]);

  if (page === "indicateurs") {
    return <IndicateursPage onBack={() => setPage("home")} />;
  }

  const statsL1 = indicateurs.filter((i) => i.liste === "L1").length;
  const statsL2 = indicateurs.filter((i) => i.liste === "L2").length;
  const poles = ["Environnement", "Mobilité", "Urbanisation", "Gouvernance"] as const;

  return (
    <div className="min-h-full" style={{ fontFamily: "'Public Sans', sans-serif", background: "var(--color-canvas)" }}>

      {/* Nav */}
      <nav
        className="main-nav sticky top-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "var(--color-canvas)", borderBottom: "1.5px solid var(--color-border)" }}
      >
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 18, color: "var(--color-primary-strong)", letterSpacing: "-0.02em" }}>
            POPGG
          </span>
          <span className="text-xs hidden sm:inline" style={{ color: "var(--color-text)", opacity: 0.55 }}>
            Plateforme d'Observation et de Prospective du Grand Genève
          </span>
        </div>
        <div className="flex gap-5 text-sm font-medium" style={{ color: "var(--color-text)" }}>
          <a href="#acteurs" className="hover:text-[var(--color-primary)] transition-colors">Acteurs</a>
          <a href="#vtt" className="hover:text-[var(--color-primary)] transition-colors">Modes VTT</a>
          <button
            onClick={() => setPage("indicateurs")}
            className="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Indicateurs
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "var(--color-primary-soft-strong)", borderBottom: "1px solid var(--color-border)" }} className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-0">
          <div className="max-w-3xl mb-8">
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
              Organiser un système d’indicateurs pour observer les transformations territoriales et éclairer la décision publique.
            </p>
            <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)", maxWidth: 440 }}>
              Prototype de travail préparatoire à l’atelier du 8 septembre 2026.
            </p>
            <div className="flex gap-3 mt-6 flex-wrap">
              {["Préservation", "Reconnexion", "Revitalisation", "Régénération", "Mise en réseau", "Circularité"].map((m) => (
                <span key={m} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "var(--color-surface-translucent)", color: "var(--color-primary-strong)", border: "1px solid var(--color-border)" }}>{m}</span>
              ))}
            </div>
          </div>
          <img
            src={homeIllustration}
            alt="Scène territoriale illustrée du Grand Genève : bâti, espaces verts, mobilités et acteurs"
            className="w-full max-w-3xl block"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          />
        </div>
      </section>

      {/* Accent bar */}
      <div style={{ height: 5, background: "var(--color-accent-soft)" }}/>

      {/* Indicators summary strip */}
      <section style={{ background: "var(--color-canvas)", borderBottom: "1.5px solid var(--color-border-subtle)" }} className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8">
            <div>
              <h2 style={{
                fontFamily: "'Newsreader', serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                color: "var(--color-primary-strong)",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}>
                {indicateurs.length} indicateurs territorialisés
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)", maxWidth: 420 }}>
                13 indicateurs L1 pour le démarrage 2026–27 et 17 indicateurs L2 pour la consolidation 2028. Le classement reste versionné et révisable.
              </p>
            </div>
            <button
              onClick={() => setPage("indicateurs")}
              className="primary-cta flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-85 shrink-0"
              style={{ background: "var(--color-primary)", color: "var(--color-surface)", border: "1px solid var(--color-primary)" }}
            >
              Explorer les fiches
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* L1 / L2 */}
            {[
              { label: "L1 · Horizon 2026-27", value: statsL1, bg: "var(--color-primary-soft)", accent: "var(--color-primary)" },
              { label: "L2 · Horizon 2028", value: statsL2, bg: "var(--color-primary-soft)", accent: "var(--color-primary)" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 flex flex-col gap-1"
                style={{ background: s.bg, border: "1.5px solid var(--color-border-subtle)" }}
              >
                <span style={{ fontFamily: "'Newsreader', serif", fontSize: 32, fontWeight: 700, color: s.accent, lineHeight: 1 }}>
                  {s.value}
                </span>
                <span className="text-xs font-semibold" style={{ color: s.accent, opacity: 0.8 }}>{s.label}</span>
              </div>
            ))}

            {/* By pole */}
            {poles.map((p) => {
              const count = indicateurs.filter((i) => i.pole === p).length;
              const c = poleColors[p];
              const maturiteAvg = Math.round(
                indicateurs.filter((i) => i.pole === p).reduce((s, i) => s + i.maturite, 0) / count
              ) as 1 | 2 | 3 | 4;
              return (
                <div
                  key={p}
                  className="rounded-xl p-4 flex flex-col gap-1"
                  style={{ background: c.bg, border: "1.5px solid var(--color-border-subtle)" }}
                >
                  <span style={{ fontFamily: "'Newsreader', serif", fontSize: 32, fontWeight: 700, color: c.accent, lineHeight: 1 }}>
                    {count}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: c.accent, opacity: 0.85 }}>{p}</span>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4].map((n) => (
                      <span key={n} style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: n <= maturiteAvg ? maturiteColor[maturiteAvg] : "var(--color-border)",
                        display: "inline-block",
                      }}/>
                    ))}
                    <span className="text-[11px] ml-1" style={{ color: c.accent }}>{maturiteLabel[maturiteAvg]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Maturite legend */}
          <div className="flex gap-4 mt-5 flex-wrap items-center">
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Maturité moyenne · échelle provisoire :</span>
            {([1,2,3,4] as const).map((m) => (
              <span key={m} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text)", opacity: 0.7 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: maturiteColor[m], display: "inline-block" }}/>
                {m} — {maturiteLabel[m]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Characters */}
      <section id="acteurs" className="max-w-6xl mx-auto px-6 py-20">
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
              Deux lectures complémentaires : les responsabilités à attribuer et la chaîne qui transforme une source en information utile à la décision.
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
          <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
            <div>
              <p>
                Cette représentation ne reproduit pas un schéma unique. Elle synthétise trois éléments du corpus de l’étude.
              </p>
              <ul className="mt-3 pl-5 list-disc space-y-2">
                <li>
                  Le narratif fournit l’ossature générale : objectifs politiques, modes VTT, portefeuille d’indicateurs, données et métadonnées, calculs et contrôles, tableau de bord, décision et réorientation.
                </li>
                <li>
                  Le rapport final et la note stratégique précisent les fonctions nécessaires, de la source à la maintenance, et proposent une adaptation du RACI : Fournit, Collecte, Produit, Valide, Consulte, Publie, Maintient.
                </li>
              </ul>
            </div>
            <div>
              <p>
                Dans l’interface, les validations sont séparées selon leur objet : qualité de la donnée, robustesse de la méthode et pertinence de l’usage métier.
              </p>
              <p className="mt-3">
                Le « Référent POPGG » est une fonction de synthèse inférée pour porter la documentation transversale : objectif politique, niveau L1–L4 et rattachements VTT. Cette fonction reste à confirmer.
              </p>
              <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                Sources de travail : narratif VTT et système d’indicateurs, rapport final indicateurs POPGG et note stratégique indicateurs POPGG.
              </p>
            </div>
          </div>
        </details>

        {actorView === "responsabilites" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {characters.map((c) => (
              <div
                key={c.name}
                className="rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
                style={{ border: "1px solid var(--color-border)", background: c.bg, boxShadow: "var(--shadow-sm)" }}
              >
                <div className="flex items-end justify-center pt-5 px-3" style={{ height: 172 }}>
                  <div style={{ height: 158, width: c.badge === "Calcul" ? "90%" : "68%" }}>
                    <c.Component />
                  </div>
                </div>
                <div className="p-3 pt-2.5" style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
                  <div className="flex items-start justify-between gap-1 mb-0.5">
                    <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 15, color: "var(--color-primary-strong)", lineHeight: 1.2 }}>
                      {c.name}
                    </span>
                    <span
                      className="text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: badgeColors[c.badge] ?? "var(--color-primary-soft)", color: "var(--color-primary-strong)" }}
                    >
                      {c.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-accent-strong)" }}>{c.role}</p>
                  <p className="text-xs leading-snug" style={{ color: "var(--color-text)" }}>{c.desc}</p>
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
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="flex items-center justify-center rounded-full text-xs font-bold"
                      style={{ width: 28, height: 28, background: "var(--color-surface-translucent)", color: step.accent }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: step.accent }}>
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

            <p className="mt-6 mx-auto text-sm leading-relaxed text-center" style={{ color: "var(--color-text-muted)", maxWidth: 620 }}>
              Des indicateurs comparables, actualisables et interprétables pour le pilotage territorial.
            </p>
          </div>
        )}
      </section>

      {/* VTT Modes */}
      <section id="vtt" style={{ background: "var(--color-canvas-cool)", borderTop: "1px solid var(--color-border)" }} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <h2 style={{
              fontFamily: "'Newsreader', serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "var(--color-text-strong)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}>
              Six modes d'action
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)", maxWidth: 500 }}>
              La VTT 2050 articule deux axes et six modes d’action. Le rattachement des 30 indicateurs L1 et L2 présenté ici est un préclassement de travail à confirmer dans le tableur consolidé.
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2 flex-wrap mb-10">
            {vttModes.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                aria-pressed={activeMode === m.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: activeMode === m.id ? m.color : "var(--color-surface)",
                  color: activeMode === m.id ? m.accent : "var(--color-text)",
                  border: `1px solid ${activeMode === m.id ? m.accent : "var(--color-border)"}`,
                  fontFamily: "'Public Sans', sans-serif",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.6 }}>{m.num}</span>
                {m.label}
                <span className="text-[11px]" style={{ opacity: 0.65 }}>{indicateurs.filter((i) => i.lienVTT === m.key).length}</span>
              </button>
            ))}
          </div>

          {/* Active mode panel */}
          <div
            className="rounded-2xl p-7 mb-6"
            style={{ background: current.color, border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span style={{ fontSize: 12, fontWeight: 800, color: current.accent, opacity: 0.5 }}>{current.num}</span>
              <h3 style={{
                fontFamily: "'Newsreader', serif",
                fontWeight: 700,
                fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
                color: current.accent,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
              }}>
                {current.headline}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--color-surface-translucent)", color: current.accent }}>
                {currentCount} {currentCount === 1 ? "rattachement principal" : "rattachements principaux"}
              </span>
            </div>
            <p style={{ color: current.accent, fontSize: 14, lineHeight: 1.7, maxWidth: 620, opacity: 0.85 }}>
              {current.description}
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {current.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-sm)" }}
              >
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
                  style={{ background: current.color, color: current.accent }}
                >
                  {card.tag}
                </span>
                <h4 style={{
                  fontFamily: "'Newsreader', serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--color-primary-strong)",
                  lineHeight: 1.25,
                }}>
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)", opacity: 0.85 }}>{card.body}</p>
              </div>
            ))}
          </div>

          {/* Horizon chips */}
          <div className="flex flex-wrap gap-3 mt-8 items-center">
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Feuille de route :</span>
            {["L1 · démarrage 2026–27", "L2 · consolidation 2028", "L3 · réserve stratégique"].map((h) => (
              <span key={h} className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "var(--color-surface)", color: "var(--color-primary)", border: "1px solid var(--color-border)" }}>
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5"
        style={{ background: "var(--color-primary-soft)", borderTop: "1px solid var(--color-border)" }}
      >
        <div>
          <span style={{ fontFamily: "'Newsreader', serif", fontWeight: 700, fontSize: 16, color: "var(--color-primary-strong)" }}>
            POPGG
          </span>
          <span className="text-xs ml-2" style={{ color: "var(--color-primary)" }}>Grand Genève</span>
        </div>
        <p className="text-xs text-center" style={{ color: "var(--color-primary-strong)", opacity: 0.65 }}>
          Plateforme d'Observation et de Prospective — Vision Territoriale Transfrontalière 2050
        </p>
        <div className="flex gap-3 text-xs font-medium" style={{ color: "var(--color-primary-strong)" }}>
          <span>Franco-Suisse</span>
          <span>·</span>
          <span>Données documentées</span>
          <span>·</span>
          <span>Aide à la décision</span>
        </div>
      </footer>
    </div>
  );
}
