import type { FicheIndicateur } from "@/data/indicators";
import type { DonneeCatalogue, PolitiquePublique } from "@/data/workbookCatalogue";

export type CatalogueTarget = { kind: "indicateurs" | "donnees" | "politiques"; id: string };

// Only explicit identifiers form links. Similar titles never imply a relationship.
export function hasReference(text: string, id: string): boolean {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Z0-9.-])${escaped}($|[^A-Z0-9.-]|\\.(?![0-9]))`, "i").test(text);
}

export function linkedData(ind: FicheIndicateur, records: DonneeCatalogue[]) {
  return records.filter((record) => ind.donneeIds.includes(record.id) || hasReference(record.indicateurs, ind.id));
}

export function linkedPolicies(ind: FicheIndicateur, records: PolitiquePublique[]) {
  return records.filter((record) => ind.politiqueIds.includes(record.id) || hasReference(record.indicateurs, ind.id));
}

export function vttKeys(ind: Pick<FicheIndicateur, "liensVTT" | "lienVTT">): string[] {
  return [...new Set([ind.lienVTT, ...ind.liensVTT].filter(Boolean))];
}

export function maturityCounts(items: Pick<FicheIndicateur, "maturite">[]) {
  return [1, 2, 3, 4].map((level) => ({ level, count: items.filter((i) => i.maturite === level).length }));
}
