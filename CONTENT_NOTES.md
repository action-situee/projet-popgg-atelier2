# Traçabilité éditoriale

## Périmètre intégré

Le contenu courant est importé depuis `20260909_Classeurs_indicateur_POPGG.xlsx`. Il comprend 30 indicateurs L1/L2 (13 L1 et 17 L2), 68 indicateurs complémentaires L3/L4, 44 entrées de données et 152 politiques publiques. Ces nombres décrivent des fiches, pas des données déjà acquises ou des résultats calculés. L’import conserve les identifiants et les contenus métier destinés à la consultation publique.

La mise en récit suit la Vision Territoriale Transfrontalière 2050 :

- axe 1, « Primauté du socle du vivant » : Préservation, Reconnexion, Revitalisation ;
- axe 2, « Rééquilibrage multipolaire de l’agglomération » : Régénération, Mise en réseau, Circularité.

Les questions évaluatives proviennent du document de travail `POP_GG_narratif_VTT_systeme_indicateurs.md`. Les rattachements courants proviennent du classeur consolidé.

## Rattachements et comptages

Les rattachements VTT restent des propositions à confirmer. L’import conserve tous les rattachements renseignés, sans plafond d’un seul secondaire. Les doublons sont retirés et les libellés inconnus restent visibles, sans rattachement forcé à l’un des six modes.

Sur les 30 fiches L1/L2, les rattachements principaux sont : Préservation 5, Reconnexion 2, Revitalisation 3, Régénération 7, Mise en réseau 8, Circularité 4, non renseigné 1. La vue Par VTT prend en compte les associations principales et secondaires. Un indicateur peut apparaître dans plusieurs groupes ; le total de résultats compte les identifiants uniques. La matrice VTT × maturité utilise le principal, comme annoncé dans l’interface.

La maturité reprend les quatre libellés de l’étude : 1 Émergent, 2 En construction, 3 Avancé, 4 Consolidé. Les niveaux numériques de la source ne sont pas modifiés. Sur L1/L2, les effectifs sont respectivement 5, 5, 15 et 5. Les moyennes de niveaux ordinaux ont été remplacées par des effectifs. Les statuts opérationnels proposés dans le compte rendu du 31 août ne sont pas automatiquement assimilés à cette échelle.

Dans la synthèse d’accueil, la répartition par thème est séparée de la préparation globale des 30 indicateurs. Chaque maturité est nommée, expliquée en une phrase et associée à un nombre d’indicateurs ; les codes ambigus « niveau · effectif » sont retirés de cette section. Les explications résument les définitions de l’étude, sans requalifier les fiches ni assimiler maturité et atteinte des objectifs politiques.

## Liens entre registres

Les associations cliquables utilisent les identifiants explicites présents dans les fiches indicateurs ou dans les champs inverses des registres Données et Politiques publiques. Une ressemblance de titre ou de thème ne crée aucun lien. L’import préserve les identifiants hiérarchiques, par exemple `OB-PACTE-1.1.1`.

Ces liens rendent la source navigable sans valider sa cohérence métier. Certaines associations du classeur restent à examiner ; elles ne sont pas corrigées silencieusement. Les formules, unités, cibles et commentaires source sont conservés.

## Responsabilités

La section « acteurs » distingue fourniture, collecte, documentation, production, contrôle, validations de méthode et d’usage, publication et maintenance. Les lectures « Responsabilités » et « Chaîne de valeur » combinent le narratif et le RACI adapté du rapport et de la note stratégique. La note repliable expose le statut inféré du « Référent POPGG ». Il ne s’agit pas d’une attribution institutionnelle ou nominative validée.

## Points à confirmer

1. Qualifications de maturité, rattachements VTT et associations entre registres à valider avec les pôles.
2. GOUV-04 : principal non renseigné dans le classeur courant ; secondaire « 3. Coopération », hors des six modes, conservé comme valeur à confirmer.
3. MOB-04 : cohérence à vérifier entre unité en déplacements et formule en distances. Aucun arbitrage métier n’a été appliqué dans l’interface.
4. Attribution des rôles, droits de publication et responsabilités de maintenance : [À COMPLÉTER].
5. Les notes d’atelier nominatives, commentaires internes et coordonnées de production sont exclus du fichier JSON public.

## Sources de cadrage

- Classeur consolidé du 9 septembre 2026 : contenu courant des registres.
- Note stratégique et rapport final du 9 septembre 2026 : objets, maturité, responsabilités et narration VTT.
- `VTT_01_synthese-vision-territoriale-transfrontaliere.pdf` et `VTT_02_rapport-vision-territoriale-transfrontaliere_20240620.pdf` : axes et modes d’action.
- `260805_Avenant_POPGG_systeme_indicateurs_EUR.docx`, `260831_CR_avenant_popgg_v3.docx` et `POP_GG_narratif_VTT_systeme_indicateurs.md` : cadrage de la narration et des usages.

Les informations contractuelles et financières de l’avenant ne sont pas reprises dans l’interface.
