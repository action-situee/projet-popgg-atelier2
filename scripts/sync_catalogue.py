#!/usr/bin/env python3
"""Synchronise les données de l'application depuis le classeur POPGG consolidé."""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
GENERATED_PATH = ROOT / "src/data/catalogue.generated.json"
INDICATORS_PATH = ROOT / "src/data/indicators.ts"
WORKBOOK_CATALOGUE_PATH = ROOT / "src/data/workbookCatalogue.ts"

POLE_MAP = {
    "Transition écologique / Environnement": "Environnement",
    "Urbanisation / Aménagement": "Urbanisation",
    "Mobilité": "Mobilité",
    "Gouvernance": "Gouvernance",
    "Social": "Social",
}

VTT_KEYS = {
    "1.1 Préservation": "1.1 Préservation",
    "1.2 Reconnexion": "1.2 Reconnexion",
    "1.3 Revitalisation": "1.3 Revitalisation",
    "2.1 Régénération": "2.1 Régénération",
    "2.1 Regénération": "2.1 Régénération",
    "2.2 Mise en réseau": "2.2 Mise en réseau",
    "2.3 Circularité": "2.3 Circularité",
}

VTT_LABELS = {key: key.split(" ", 1)[1] for key in VTT_KEYS.values()}


def clean(value: Any) -> str:
    if value is None or pd.isna(value):
        return ""
    if isinstance(value, float) and value.is_integer():
        value = int(value)
    if isinstance(value, pd.Timestamp):
        value = value.strftime("%Y-%m-%d")
    return str(value).strip().replace("\u2014", "·")


def bool_from_yes(value: Any) -> bool | None:
    text = clean(value).lower()
    if text in {"oui", "yes", "true", "1"}:
        return True
    if text in {"non", "no", "false", "0"}:
        return False
    return None


def canonical_vtt(value: Any) -> str:
    text = re.sub(r"\s+", " ", clean(value))
    if text == "0":
        return ""
    return VTT_KEYS.get(text, text)


def clean_placeholder(value: Any) -> str:
    text = clean(value)
    return "" if text == "0" else text


def vtt_links(principal: str, values: Any) -> list[str]:
    """Conserver tous les rattachements, y compris les libellés à qualifier."""
    entries: list[str] = []
    for raw in [principal, *re.split(r"[,;\n]", clean(values))]:
        item = canonical_vtt(raw)
        if item and item != "0" and item not in entries:
            entries.append(item)
    return entries


def secondary_vtt(principal: str, values: Any) -> str:
    # Champ historique conservé pour compatibilité ; la liste complète fait foi.
    secondary = [item for item in vtt_links(principal, values) if item != principal]
    return VTT_LABELS.get(secondary[0], secondary[0]) if secondary else ""


def reference_ids(row: pd.Series, prefix: str) -> list[str]:
    return list(dict.fromkeys(value for index in range(1, 4)
                             for value in re.findall(r"[A-Z]+(?:-[A-Z]+)*-\d+(?:\.\d+)*", clean(row_value(row, f"{prefix}{index}")))))


def parse_sections(value: Any) -> dict[str, str]:
    text = clean(value)
    if not text:
        return {}
    sections: dict[str, str] = {}
    for block in re.split(r"\n\s*\n", text):
        if " : " in block:
            label, content = block.split(" : ", 1)
            sections[label.strip()] = content.strip()
        elif block.strip():
            sections.setdefault("Autre", block.strip())
    return sections


def join_nonempty(values: list[Any], separator: str = ", ") -> str:
    output: list[str] = []
    for value in values:
        text = clean(value)
        if text and text != "0" and text not in output:
            output.append(text)
    return separator.join(output)


def row_value(row: pd.Series, column: str) -> Any:
    return row[column] if column in row.index else ""


def valid_indicator_rows(frame: pd.DataFrame) -> pd.DataFrame:
    ids = frame["ID"].astype(str)
    return frame[ids.str.contains("-", regex=False) & (ids != "AA-POLE-XX")].copy()


def build_data_catalogue(frame: pd.DataFrame) -> list[dict[str, Any]]:
    territories = [
        ("Grand Genève", "Donnée de base GG", "Attribut ", "Fournisseur donnée GG", "Lien vers la donnée GG", "Fréquence de mise à jour GG", "Granularité GG"),
        ("Genève", "Donnée de base GNV", "Attribut GNV", "Fournisseur GNV", "Lien vers la donnée GNV", "Fréquence de mise à jour GNV", "Granularité GNV"),
        ("Vaud", "Donnée de base VD", "Attribut VD", "Fournisseur VD", "Lien vers la donnée VD", "Fréquence de mise à jour VD", "Granularité VD"),
        ("Haute-Savoie", "Donnée de base Haute-Savoie", "Attribut HS", "Fournisseur HS", "Lien vers la donnée HS", "Fréquence de mise à jour HS", "Granularité HS"),
        ("Ain", "Donnée de base Ain", "Attribut Ain", "Fournisseur Ain", "Lien vers la donnée Ain", "Fréquence de mise à jour Ain", "Granularité Ain"),
    ]
    items: list[dict[str, Any]] = []
    for _, row in frame.iterrows():
        territorial_sources: list[dict[str, str]] = []
        for territoire, donnee, attribut, fournisseur, lien, frequence, granularite in territories:
            source = {
                "territoire": territoire,
                "donnee": clean(row_value(row, donnee)),
                "attribut": clean(row_value(row, attribut)),
                "fournisseur": clean(row_value(row, fournisseur)),
                "lien": clean(row_value(row, lien)),
                "frequence": clean(row_value(row, frequence)),
                "granularite": clean(row_value(row, granularite)),
            }
            if any(source[key] for key in source if key != "territoire"):
                territorial_sources.append(source)
        if not territorial_sources and clean(row_value(row, "Fournisseurs")):
            territorial_sources.append(
                {
                    "territoire": "Grand Genève",
                    "donnee": "",
                    "attribut": "",
                    "fournisseur": clean(row_value(row, "Fournisseurs")),
                    "lien": "",
                    "frequence": "",
                    "granularite": "",
                }
            )
        items.append(
            {
                "id": clean(row_value(row, "ID Donnée")),
                "pole": clean(row_value(row, "Pôle donnée")),
                "titre": clean(row_value(row, "Titre donnée socle")),
                "homogeneite": clean(row_value(row, "Homogénéité")),
                "fournisseurs": clean(row_value(row, "Fournisseurs")),
                "indicateurs": clean(row_value(row, "POPGG indicateur")),
                "couverture": clean(row_value(row, "Couverture territoriale")),
                "territoires": territorial_sources,
                "fournisseurConfirme": clean(row_value(row, "Fournisseur confirmé")),
                "droits": clean(row_value(row, "Droits / niveau de diffusion")),
                "procedureAcces": clean(row_value(row, "Procédure d'accès")),
                "calendrierCollecte": clean(row_value(row, "Calendrier de collecte")),
                "controleQualite": clean(row_value(row, "Contrôle qualité attendu")),
                "statutRaci": clean(row_value(row, "Statut RACI donnée")),
            }
        )
    return items


def data_pointer(data_ids: list[str], data_by_id: dict[str, dict[str, Any]]) -> str:
    entries: list[str] = []
    for data_id in data_ids:
        if not data_id:
            continue
        record = data_by_id.get(data_id)
        links = [] if not record else [source["lien"] for source in record["territoires"] if source["lien"]]
        entries.append(f"{data_id} · {' · '.join(dict.fromkeys(links))}" if links else data_id)
    return " ; ".join(entries)


def build_priority_indicators(frame: pd.DataFrame, data_by_id: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for _, row in valid_indicator_rows(frame).iterrows():
        sections = parse_sections(row_value(row, "Commentaire"))
        principal = canonical_vtt(row_value(row, "Mode d'action VTT"))
        layers = [row_value(row, f"Couche {index}") for index in range(1, 4)]
        data_ids = [clean(row_value(row, f"ID Donnée {index}")) for index in range(1, 4)]
        item = {
            "id": clean(row_value(row, "ID")),
            "pole": POLE_MAP.get(clean(row_value(row, "Pôle")), clean(row_value(row, "Pôle"))),
            "liste": clean(row_value(row, "Hiérarchie")),
            "horizon": "2026-27" if clean(row_value(row, "Horizon")) == "26-27" else "2028",
            "nom": clean(row_value(row, "Nom de l'indicateur")),
            "typologie": clean(row_value(row, "Typologie")),
            "definition": clean(row_value(row, "Définition")),
            "unite": clean(row_value(row, "Unité")),
            "rafraichissement": clean(row_value(row, "Taux de rafraîchissement")),
            "granularite": clean(row_value(row, "Granularité de l'indicateur")),
            "maturite": int(row_value(row, "Maturité")),
            "valeurCible": clean(row_value(row, "Valeur cible")),
            "lienVTT": principal,
            "liensVTT": vtt_links(principal, row_value(row, "Liste modes d'action VTT")),
            "donneeIds": reference_ids(row, "ID Donnée "),
            "politiqueIds": reference_ids(row, "ID-Politique"),
            "lienVTTSecondaire": secondary_vtt(principal, row_value(row, "Liste modes d'action VTT")),
            "spatialisation": bool_from_yes(row_value(row, "Spatialisation")),
            "methodologie": clean(row_value(row, "Méthode de calcul (formule textuelle)")),
            "formule": clean(row_value(row, "Formule")),
            "donnee": join_nonempty(layers),
            "pointeurDonnees": data_pointer(data_ids, data_by_id),
            "anneesDisponibilite": clean(row_value(row, "Années de disponibilité")),
            "idPolitique1": clean_placeholder(row_value(row, "ID-Politique1")),
            "documentPolitique1": clean_placeholder(row_value(row, "Document-Politique1")),
            "descriptionPolitique1": clean_placeholder(row_value(row, "Description-Politique1")),
            "debattu": sections.get("Débattu", "").lower() == "oui",
            "sousTheme": clean(row_value(row, "Sous-thème")),
            "documentsReference": join_nonempty([row_value(row, f"Document-Politique{index}") for index in range(1, 4)]),
            "droitsDiffusion": clean(row_value(row, "Droits / niveau de diffusion indicateur")),
            "statutRaci": clean(row_value(row, "Statut RACI indicateur")),
        }
        items.append(item)
    return items


def build_complementary_indicators(frame: pd.DataFrame, list_name: str) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for _, row in valid_indicator_rows(frame).iterrows():
        principal = canonical_vtt(row_value(row, "Mode d'action VTT"))
        items.append(
            {
                "id": clean(row_value(row, "ID")),
                "pole": POLE_MAP.get(clean(row_value(row, "Pôle")), clean(row_value(row, "Pôle"))),
                "liste": list_name,
                "horizon": "Long terme" if list_name == "L3" else "Écarté",
                "nom": clean(row_value(row, "Nom de l'indicateur")),
                "typologie": clean(row_value(row, "Typologie")),
                "definition": "",
                "unite": "",
                "rafraichissement": "",
                "granularite": "",
                "maturite": None,
                "valeurCible": "",
                "lienVTT": principal,
            "liensVTT": vtt_links(principal, row_value(row, "Liste modes d'action VTT")),
            "donneeIds": reference_ids(row, "ID Donnée "),
            "politiqueIds": reference_ids(row, "ID-Politique"),
                "lienVTTSecondaire": "",
                "spatialisation": None,
                "methodologie": "",
                "formule": "",
                "donnee": "",
                "pointeurDonnees": "",
                "anneesDisponibilite": "",
                "idPolitique1": clean_placeholder(row_value(row, "ID-Politique1")),
                "documentPolitique1": clean_placeholder(row_value(row, "Document-Politique1")),
                "descriptionPolitique1": clean_placeholder(row_value(row, "Description-Politique1")),
                "debattu": clean(row_value(row, "Débattu")).lower() == "oui",
                "sousTheme": clean(row_value(row, "Sous-thème")),
                "documentsReference": clean(row_value(row, "Documents de référence")),
                "droitsDiffusion": clean(row_value(row, "Droits / niveau de diffusion indicateur")),
                "statutRaci": clean(row_value(row, "Statut RACI indicateur")),
            }
        )
    return items


def build_policies(frame: pd.DataFrame) -> list[dict[str, str]]:
    return [
        {
            "id": clean(row_value(row, "ID_politiquepub")),
            "document": clean(row_value(row, "Document")),
            "theme": clean(row_value(row, "Theme")),
            "sousTheme": clean(row_value(row, "Sous_themes")),
            "details": clean(row_value(row, "Details")),
            "indicateurs": clean(row_value(row, "Indicateurs")),
            "listePriorisation": clean(row_value(row, "Liste priorisation indicateur")),
            "lienVTT": canonical_vtt(row_value(row, "Lien VTT")),
            "lienCharteTransition": clean(row_value(row, "Lien charte de transition")),
        }
        for _, row in frame.iterrows()
    ]


def french_date_from_filename(path: Path) -> str:
    match = re.match(r"(\d{8})", path.name)
    if not match:
        return "[À COMPLÉTER]"
    date = datetime.strptime(match.group(1), "%Y%m%d")
    months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    return f"{date.day} {months[date.month - 1]} {date.year}"


def write_typescript_adapters(source_name: str) -> None:
    indicators_text = INDICATORS_PATH.read_text(encoding="utf-8")
    import_line = 'import catalogue from "@/data/catalogue.generated.json";\n\n'
    if import_line.strip() not in indicators_text:
        indicators_text = import_line + indicators_text
    generated_export = "export const indicateurs = catalogue.indicateurs as unknown as Indicateur[];"
    if generated_export not in indicators_text:
        start = indicators_text.index("export const indicateurs: Indicateur[] = [")
        end = indicators_text.index("\n\nexport interface VTTSection", start)
        indicators_text = indicators_text[:start] + generated_export + indicators_text[end:]
    INDICATORS_PATH.write_text(indicators_text, encoding="utf-8")

    adapter = f'''// Généré depuis {source_name}.
// Relancer scripts/sync_catalogue.py pour actualiser les contenus.

import catalogue from "@/data/catalogue.generated.json";
import type {{ FicheIndicateur }} from "@/data/indicators";

export interface SourceTerritoriale {{
  territoire: string;
  donnee: string;
  attribut: string;
  fournisseur: string;
  lien: string;
  frequence: string;
  granularite: string;
}}

export interface DonneeCatalogue {{
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
}}

export interface PolitiquePublique {{
  id: string;
  document: string;
  theme: string;
  sousTheme: string;
  details: string;
  indicateurs: string;
  listePriorisation: string;
  lienVTT: string;
  lienCharteTransition: string;
}}

export const catalogueMetadata = catalogue.metadata;
export const indicateursComplementaires = catalogue.indicateursComplementaires as unknown as FicheIndicateur[];
export const donneesCatalogue = catalogue.donneesCatalogue as DonneeCatalogue[];
export const politiquesPubliques = catalogue.politiquesPubliques as PolitiquePublique[];
'''
    WORKBOOK_CATALOGUE_PATH.write_text(adapter, encoding="utf-8")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: sync_catalogue.py <classeur.xlsx>")
    workbook_path = Path(sys.argv[1]).expanduser().resolve()
    if not workbook_path.exists():
        raise SystemExit(f"Classeur introuvable : {workbook_path}")

    data_frame = pd.read_excel(workbook_path, sheet_name="Catalogue de Données", header=1)
    data_catalogue = build_data_catalogue(data_frame)
    data_by_id = {item["id"]: item for item in data_catalogue}
    priority = build_priority_indicators(
        pd.read_excel(workbook_path, sheet_name="L1 et L2 - Prioritaires", header=2),
        data_by_id,
    )
    complementary = build_complementary_indicators(
        pd.read_excel(workbook_path, sheet_name="L3 - Long terme", header=2), "L3"
    ) + build_complementary_indicators(
        pd.read_excel(workbook_path, sheet_name="L4 - Ecartés", header=2), "L4"
    )
    policies = build_policies(
        pd.read_excel(workbook_path, sheet_name="Registre des Politiques Publiqu", header=0)
    )
    payload = {
        "metadata": {
            "sourceFile": workbook_path.name,
            "sourceDate": french_date_from_filename(workbook_path),
            "counts": {
                "indicateursPrioritaires": len(priority),
                "indicateursComplementaires": len(complementary),
                "donnees": len(data_catalogue),
                "politiquesPubliques": len(policies),
            },
        },
        "indicateurs": priority,
        "indicateursComplementaires": complementary,
        "donneesCatalogue": data_catalogue,
        "politiquesPubliques": policies,
    }
    GENERATED_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_typescript_adapters(workbook_path.name)
    print(json.dumps(payload["metadata"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
