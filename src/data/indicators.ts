import catalogue from "@/data/catalogue.generated.json";

export type Liste = "L1" | "L2" | "L3" | "L4";
export type Pole = "Environnement" | "Mobilité" | "Urbanisation" | "Gouvernance" | "Social";
export type Maturite = 1 | 2 | 3 | 4;

export interface Indicateur {
  id: string;
  pole: Pole;
  liste: Liste;
  horizon: string;
  nom: string;
  typologie: string;
  definition: string;
  unite: string;
  rafraichissement: string;
  granularite: string;
  maturite: Maturite;
  valeurCible: string;
  lienVTT: string;
  lienVTTSecondaire: string;
  liensVTT: string[];
  donneeIds: string[];
  politiqueIds: string[];
  spatialisation: boolean | null;
  methodologie: string;
  formule: string;
  donnee: string;
  pointeurDonnees: string;
  anneesDisponibilite: string;
  idPolitique1: string;
  documentPolitique1: string;
  descriptionPolitique1: string;
  debattu: boolean;
}

export type FicheIndicateur = Omit<Indicateur, "maturite"> & {
  maturite: Maturite | null;
  sousTheme?: string;
  documentsReference?: string;
  droitsDiffusion?: string;
  statutRaci?: string;
};

export const indicateurs = catalogue.indicateurs as unknown as Indicateur[];

export interface VTTSection {
  key: string;
  label: string;
  bg: string;
  accent: string;
  light: string;
  axe: string;
  question: string;
}

export const vttSections: VTTSection[] = [
  { key: "1.1 Préservation", label: "Préservation", bg: "var(--color-sage-soft)", accent: "var(--color-sage-strong)", light: "var(--color-sage-medium)", axe: "Primauté du socle du vivant", question: "Les ressources et espaces structurants du Grand Genève sont-ils ménagés et sécurisés ?" },
  { key: "1.2 Reconnexion", label: "Reconnexion", bg: "var(--color-primary-soft)", accent: "var(--color-primary)", light: "var(--color-primary)", axe: "Primauté du socle du vivant", question: "Les continuités écologiques, paysagères, sociales et actives sont-elles restaurées ou renforcées ?" },
  { key: "1.3 Revitalisation", label: "Revitalisation", bg: "var(--color-accent-soft)", accent: "var(--color-accent-strong)", light: "var(--color-coral)", axe: "Primauté du socle du vivant", question: "Les milieux bâtis, agricoles, forestiers et hydrographiques gagnent-ils en qualité, résilience et habitabilité ?" },
  { key: "2.1 Régénération", label: "Régénération", bg: "var(--color-violet-soft)", accent: "var(--color-violet-strong)", light: "var(--color-violet)", axe: "Rééquilibrage multipolaire de l’agglomération", question: "Les tissus et polarités existants accueillent-ils mieux habitants, emplois, logements, services et équipements ?" },
  { key: "2.2 Mise en réseau", label: "Mise en réseau", bg: "var(--color-primary-soft)", accent: "var(--color-primary-strong)", light: "var(--color-primary)", axe: "Rééquilibrage multipolaire de l’agglomération", question: "Les polarités et bassins de vie sont-ils reliés par des mobilités décarbonées et adaptées aux contextes territoriaux ?" },
  { key: "2.3 Circularité", label: "Circularité", bg: "var(--color-ochre-soft)", accent: "var(--color-ochre-strong)", light: "var(--color-ochre)", axe: "Rééquilibrage multipolaire de l’agglomération", question: "Les ressources, flux et filières locales sont-ils mieux bouclés à l’échelle du bassin de vie ?" },
];

export const poleColors: Record<string, { bg: string; accent: string; light: string }> = {
  Environnement: { bg: "var(--color-pole-environment-soft)", accent: "var(--color-pole-environment-strong)", light: "var(--color-pole-environment)" },
  Mobilité: { bg: "var(--color-pole-mobility-soft)", accent: "var(--color-pole-mobility-strong)", light: "var(--color-pole-mobility)" },
  Urbanisation: { bg: "var(--color-pole-urbanisation-soft)", accent: "var(--color-pole-urbanisation-strong)", light: "var(--color-pole-urbanisation)" },
  Gouvernance: { bg: "var(--color-pole-governance-soft)", accent: "var(--color-pole-governance-strong)", light: "var(--color-pole-governance)" },
  Social: { bg: "var(--color-pole-social-soft)", accent: "var(--color-pole-social-strong)", light: "var(--color-pole-social)" },
};

export const maturiteLabel: Record<number, string> = {
  1: "Émergent",
  2: "En construction",
  3: "Avancé",
  4: "Consolidé",
};

export const maturiteColor: Record<number, string> = {
  1: "var(--color-status-1)",
  2: "var(--color-status-2)",
  3: "var(--color-status-3)",
  4: "var(--color-status-4)",
};
