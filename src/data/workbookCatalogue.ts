// Généré depuis 20260909_Classeurs_indicateur_POPGG.xlsx.
// Relancer scripts/sync_catalogue.py pour actualiser les contenus.

import catalogue from "@/data/catalogue.generated.json";
import type { FicheIndicateur } from "@/data/indicators";

export interface SourceTerritoriale {
  territoire: string;
  donnee: string;
  attribut: string;
  fournisseur: string;
  lien: string;
  frequence: string;
  granularite: string;
}

export interface DonneeCatalogue {
  id: string;
  pole: string;
  titre: string;
  homogeneite: string;
  fournisseurs: string;
  indicateurs: string;
  couverture: string;
  territoires: SourceTerritoriale[];
  fournisseurConfirme: string;
  droits: string;
  procedureAcces: string;
  calendrierCollecte: string;
  controleQualite: string;
  statutRaci: string;
}

export interface PolitiquePublique {
  id: string;
  document: string;
  theme: string;
  sousTheme: string;
  details: string;
  indicateurs: string;
  listePriorisation: string;
  lienVTT: string;
  lienCharteTransition: string;
}

export const catalogueMetadata = catalogue.metadata;
export const indicateursComplementaires = catalogue.indicateursComplementaires as unknown as FicheIndicateur[];
export const donneesCatalogue = catalogue.donneesCatalogue as DonneeCatalogue[];
export const politiquesPubliques = catalogue.politiquesPubliques as PolitiquePublique[];
