---
name: POPGG atelier2
description: Observatoire territorial clair pour consulter les indicateurs du Grand Genève.
colors:
  canvas: "#f7f3eb"
  canvas-cool: "#eaf3f7"
  surface: "#ffffff"
  surface-soft: "#f1f4f5"
  surface-translucent: "rgba(255, 255, 255, 0.76)"
  text: "#2e3e4b"
  text-strong: "#213544"
  text-muted: "#62717c"
  border: "#cdd7dc"
  border-strong: "#9fadb5"
  border-subtle: "rgba(46, 62, 75, 0.1)"
  border-faint: "rgba(46, 62, 75, 0.06)"
  overlay: "rgba(33, 53, 68, 0.32)"
  primary: "#315f7b"
  primary-strong: "#24495f"
  primary-soft: "#dcecf3"
  primary-soft-strong: "#c9dfeb"
  accent: "#ee5b43"
  accent-strong: "#b33f2d"
  accent-soft: "#f8ddd6"
  sage: "#557569"
  sage-strong: "#3f5d53"
  sage-medium: "#89a69b"
  sage-soft: "#e3ece7"
  violet: "#6c5e8e"
  violet-strong: "#524570"
  violet-soft: "#e9e4f1"
  ochre: "#a8792a"
  ochre-strong: "#775117"
  ochre-soft: "#f3e6c6"
  coral: "#ef6a52"
  rose-soft: "#f1e2e7"
  pole-environment: "#4dbe7a"
  pole-environment-strong: "#276641"
  pole-environment-soft: "#eaf7f0"
  pole-urbanisation: "#ef4979"
  pole-urbanisation-strong: "#99183f"
  pole-urbanisation-soft: "#fdeff2"
  pole-mobility: "#3c95fa"
  pole-mobility-strong: "#155d9d"
  pole-mobility-soft: "#eaf4ff"
  pole-social: "#ec7d2d"
  pole-social-strong: "#934211"
  pole-social-soft: "#fdf0e6"
  pole-governance: "#fad93a"
  pole-governance-strong: "#665000"
  pole-governance-soft: "#fff9dd"
  status-1: "#b8563f"
  status-2: "#8b5d1c"
  status-3: "#3e7393"
  status-4: "#665b89"
  illustration-skin: "#efb7a8"
  illustration-clay: "#ba7048"
  illustration-taupe: "#776c6c"
  illustration-neutral: "#8a969d"
typography:
  display:
    fontFamily: "Newsreader, serif"
    fontSize: "clamp(2rem, 5vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, serif"
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.025em"
rounded:
  sm: "8px"
  md: "12px"
  panel: "16px"
  pill: "999px"
spacing:
  "1": "4px"
  "1.5": "6px"
  "2": "8px"
  "2.5": "10px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "20": "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip-filter-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-strong}"
    rounded: "{rounded.pill}"
    padding: "6px 12px 6px 32px"
  data-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "0"
  content-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "20px"
  navigation-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    padding: "12px 24px"
  side-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    width: "min(460px, 92vw)"
---

# Design System: POPGG atelier2

## Overview

**Creative North Star: "Observatoire territorial clair"**

POPGG adopte une présence éditoriale, analytique et calme. La matière territoriale est structurée pour être parcourue et comparée sans donner à l'interface l'apparence d'un tableau de bord technique fermé. Le contraste entre les titres en Newsreader et l'interface en Public Sans installe une hiérarchie lisible, tandis que les fonds ivoire et bleu brume maintiennent une atmosphère légère.

La couleur reste située. Le bleu lac porte les actions et la navigation, le corail, l'ocre, le violet et le vert sauge distinguent les modes d'action. Une palette plus franche identifie les cinq pôles thématiques. Les surfaces sont claires, les composants précis et les effets de profondeur discrets. L’univers présenté dans les diapositives finales est repris par des anneaux corail, des filets fins et l’alternance entre bleu brume, ivoire et blanc, sans transformer l’interface en composition de présentation.

**Key Characteristics:**

- Hiérarchie éditoriale nette, adaptée à la lecture d'informations territoriales denses.
- Surfaces ivoire, bleu brume et blanches, sans masse sombre dominante.
- Accents chromatiques sémantiques, toujours accompagnés d'un libellé, d'un niveau ou d'une forme.
- Composants compacts, tactiles et réversibles, avec états actifs explicites.
- Profondeur ambiante, mouvements courts et aucune animation décorative.

## Colors

La palette lémanique et minérale combine des neutres lumineux, un bleu fonctionnel et quelques accents territoriaux réservés à des rôles stables.

### Primary

- **Bleu lac** (`colors.primary`): actions principales, navigation active, liens fonctionnels et contrôles sélectionnés.
- **Bleu lac profond** (`colors.primary-strong`): titres, chiffres forts et texte d'interface nécessitant davantage d'assise.
- **Brumes bleues** (`colors.primary-soft`, `colors.primary-soft-strong`): en-têtes, repères de gouvernance, fonds sélectionnés et grandes zones de respiration.

### Secondary

- **Terre cuite** (`colors.accent`): accent éditorial, emphase dans les titres et détails illustrés.
- **Terre cuite profonde** (`colors.accent-strong`): texte ou repère accentué sur un fond terre cuite pâle.
- **Argile pâle** (`colors.accent-soft`): fond de catégorie, sélection de texte et respiration secondaire.

### Tertiary

- **Sauge** (`colors.sage`, `colors.sage-strong`, `colors.sage-medium`, `colors.sage-soft`): vivant et mode d'action Préservation uniquement.
- **Violet transformation** (`colors.violet`, `colors.violet-strong`, `colors.violet-soft`): régénération, urbanisation et transformation.
- **Ocre circularité** (`colors.ochre`, `colors.ochre-strong`, `colors.ochre-soft`): circularité, ressources et repères secondaires.
- **Corail et rose brume** (`colors.coral`, `colors.rose-soft`): illustrations et coopération, sans devenir des couleurs d'action génériques.
- **Pôles thématiques** : vert franc pour l'environnement, rose pour l'urbanisation, bleu vif pour la mobilité, orange pour le social et jaune pour la gouvernance. Chaque couleur de référence possède une variante foncée accessible pour le texte et une surface pâle pour les cartes.
- **Échelle de maturité** (`colors.status-1` à `colors.status-4`): quatre niveaux de l’étude, « Émergent », « En construction », « Avancé », « Consolidé ». La couleur complète le chiffre et le libellé, elle ne les remplace pas. La qualification des fiches reste provisoire ; les statuts opérationnels du compte rendu du 31 août ne sont pas assimilés automatiquement à cette échelle.
- **Palette d'illustration** (`colors.illustration-skin-light`, `colors.illustration-skin-medium`, `colors.illustration-skin-deep`, `colors.illustration-hair-warm`, `colors.illustration-hair-light`, `colors.illustration-neutral`): carnations et chevelures diversifiées, aux tons atténués, associées à l'ardoise et aux accents sémantiques.

### Avatars de responsabilité

Les cartes d'acteurs utilisent une même grammaire de portrait vectoriel : cadrage en buste, formes simples, fond pâle, détails du visage discrets et médaillon fonctionnel. Le portrait varie sans attribuer un métier à un genre ou à une apparence. Le médaillon porte l'information distinctive avec un pictogramme Lucide propre à chaque responsabilité : source, collecte, référentiel, calcul, qualité, méthode, usage métier, publication ou maintenance. Comme le rôle est déjà écrit dans la carte, l'avatar et son pictogramme restent décoratifs pour les technologies d'assistance.

La provenance de la chaîne reste accessible dans un volet discret. Son contenu distingue trois apports courts : chaîne de valeur, responsabilités et hypothèses de travail. Les sources du corpus sont regroupées sur une ligne séparée afin de conserver la traçabilité sans alourdir la lecture principale.

### Neutral

- **Ivoire** (`colors.canvas`): fond principal de l'application.
- **Bleu brume très clair** (`colors.canvas-cool`): alternance de sections et respiration entre ensembles de contenus.
- **Blanc de surface** (`colors.surface`) et **gris bleuté pâle** (`colors.surface-soft`): cartes, panneaux et zones analytiques.
- **Ardoise** (`colors.text`, `colors.text-strong`, `colors.text-muted`): texte courant, titres et métadonnées, avec une hiérarchie fondée sur des valeurs distinctes plutôt que sur une faible opacité.
- **Bleu-gris structurel** (`colors.border`, `colors.border-strong`, `colors.border-subtle`, `colors.border-faint`): séparations, contours et états désactivés.
- **Voile de panneau** (`colors.overlay`) et **blanc translucide** (`colors.surface-translucent`): modalité latérale et pastilles superposées à des fonds colorés.

**The Situated Color Rule.** Le vert sauge n'est jamais une couleur générique de succès, d'action ou de navigation. Il reste strictement réservé au mode d'action Préservation et aux contenus liés au vivant. Le vert franc identifie le pôle Environnement.

**The Double Encoding Rule.** Une couleur catégorielle ou de maturité est toujours doublée par un texte, un nombre ou une forme identifiable.

## Typography

**Display Font:** Newsreader (avec `serif` en repli)

**Body Font:** Public Sans (avec `sans-serif` en repli)

**Character:** Newsreader apporte une voix éditoriale et territoriale aux titres et aux chiffres clés. Public Sans conserve aux données, libellés et commandes une diction neutre, compacte et immédiatement lisible.

### Hierarchy

- **Display** (`typography.display`): proposition principale et grands titres de page, en casse naturelle.
- **Headline** (`typography.headline`): titres de section et principaux changements de niveau dans la lecture.
- **Title** (`typography.title`): titres de cartes et d'ensembles analytiques.
- **Body** (`typography.body`): texte explicatif et descriptif. Les lignes restent volontairement courtes, souvent limitées entre 440 et 620 px selon le contexte.
- **Label** (`typography.label`): identifiants, métadonnées et intitulés de filtres. Les capitales sont réservées aux micro-libellés et aux niveaux.

**The Editorial Pairing Rule.** Newsreader porte le récit, les titres et les valeurs saillantes. Public Sans porte l'action, la lecture courante et la structure des données.

**The Legible Metadata Rule.** Le texte courant reste à 14 px ou plus. Les métadonnées peuvent descendre à 11 ou 12 px uniquement avec une couleur pleinement contrastée et sans atténuation qui compromette la lecture.

**The Construction Metadata Rule.** Les niveaux L1 et L2 sont des repères de gestion et de mise en œuvre qui servent à prioriser le travail. Ils ne sont pas traités comme des chiffres clés ou des niveaux de décision sur la page d’accueil ; ils restent accessibles comme métadonnée secondaire et dans le catalogue des indicateurs.

## Layout

La mise en page repose sur des conteneurs centrés de 1024 px pour le récit principal et de 1152 px pour les ensembles analytiques, avec une gouttière latérale récurrente de 24 px. Les sections éditoriales disposent de respirations verticales généreuses, tandis que les cartes et barres d'outils utilisent un rythme compact issu de `spacing.1` à `spacing.6`.

Les grilles analytiques passent d'une colonne à deux colonnes au palier de 640 px, puis à trois colonnes au palier de 1024 px. La navigation principale et la barre d'outils du catalogue restent visibles en position collante. Les filtres se replient sur plusieurs lignes; la matrice, seule exception dense, défile horizontalement dans son propre conteneur.

Sur petit écran, les commandes de navigation, l'appel principal et la recherche utilisent une taille de texte d'au moins 16 px. Sur périphérique tactile, les cibles principales atteignent au moins 44 px. Le contrôle responsive couvre notamment 375, 390, 768, 1024, 1138 et 1440 px sans débordement horizontal global.

**The Layered Density Rule.** La densité se concentre dans les cartes, filtres et matrices. Les marges de page et les transitions entre sections restent généreuses afin de préserver la lisibilité d'ensemble.

## Elevation & Depth

La profondeur est ambiante et retenue. Les cartes au repos utilisent une ombre basse (`0 1px 2px rgba(33, 53, 68, 0.05)`); les cartes survolées et le panneau latéral utilisent une ombre moyenne (`0 10px 26px rgba(33, 53, 68, 0.09)`). Les alternances ivoire, bleu brume et blanc, complétées par des bordures fines, assurent l'essentiel de la séparation des plans.

Les cartes interactives se soulèvent de 2 px au survol puis reviennent à leur position au clic, sans déplacement de mise en page. Les transitions durent 160 ms pour les cartes et jusqu'à 220 ms pour les changements d'état usuels. Elles sont ramenées à un effet imperceptible lorsque `prefers-reduced-motion: reduce` est actif.

Le focus visible associe un contour bleu lac de 2 px, un décalage de 3 px et un halo de 3 px. Ce traitement s'applique aux boutons, liens et champs sans dépendre de la seule couleur de fond.

**The Ambient Depth Rule.** Les surfaces sont séparées d'abord par le ton et la bordure. L'ombre confirme une élévation ou une interaction, elle ne devient jamais un effet décoratif lourd.

## Shapes

Les formes sont doucement arrondies et régulières. Les petits contrôles utilisent `rounded.sm`, les cartes courantes `rounded.md`, et les cartes analytiques ou grands panneaux `rounded.panel`. Les filtres, bascules, badges, champs de recherche et appels principaux sont des pilules avec `rounded.pill`.

Les bordures sont fines, généralement de 1 px, parfois de 1,5 px pour une séparation ou un contrôle qui doit mieux résister sur un fond pâle. Les points de maturité sont circulaires. Les contenus illustrés et les en-têtes colorés sont découpés par le contour de leur carte, sans silhouette décorative supplémentaire.

**The Soft Precision Rule.** Arrondir pour regrouper et rendre les commandes tactiles, sans transformer les surfaces en bulles ni multiplier les rayons arbitraires.

## Components

Les composants sont précis et sobres. Leur état courant reste lumineux; la couleur forte apparaît surtout dans l'action, la sélection et les repères sémantiques.

### Buttons

- **Shape:** l'appel principal utilise la pilule `rounded.pill`; les boutons compacts reprennent la même silhouette ou `rounded.sm` lorsqu'ils appartiennent à une carte.
- **Primary:** `components.button-primary`, avec bleu lac, texte blanc et libellé Public Sans semi-gras.
- **Hover / Focus:** le survol réduit légèrement l'opacité sans décaler la mise en page. Le focus reprend le traitement global décrit dans Elevation & Depth.
- **Ghost:** `components.button-ghost`, transparent et bleu lac, pour les retours et actions discrètes.

### Chips

- **Style:** `components.chip-filter` combine fond blanc, texte ardoise et bordure bleu-gris. Les badges informatifs utilisent un fond pâle lié à leur catégorie.
- **State:** `components.chip-filter-active` emploie le bleu lac ou la couleur sémantique de la catégorie. L'état actif est porté par `aria-pressed` et reste lisible sans interpréter la couleur seule.

### Cards / Containers

- **Corner Style:** les cartes de contenu utilisent `rounded.md`; les fiches indicateurs segmentées utilisent `rounded.panel` et masquent proprement leurs fonds internes.
- **Background:** blanc pour le corps; fond pâle sémantique pour l'en-tête d'une fiche ou d'une catégorie.
- **Shadow Strategy:** ombre basse au repos, ombre moyenne et élévation légère uniquement pour une carte interactive.
- **Border:** contour bleu-gris fin et séparateurs internes translucides.
- **Internal Padding:** 16 px pour les fiches compactes et 20 px pour les cartes de contenu, avec un rythme plus large dans les panneaux de synthèse.

### Inputs / Fields

- **Style:** `components.input-search`, fond blanc, contour bleu-gris de 1,5 px, forme en pilule et pictogramme SVG placé à gauche.
- **Focus:** contour, décalage et halo bleu lac communs aux contrôles.
- **Disabled:** les cellules de matrice sans contenu utilisent le fond et la bordure `colors.border-faint`, affichent un tiret et n'annoncent pas d'action. Aucun style d'erreur générique n'est défini dans les sources actuelles.

### Navigation

- **Style:** `components.navigation-bar` reste sur fond ivoire avec une séparation inférieure. Le nom POPGG utilise Newsreader en bleu lac profond; les liens sont en Public Sans.
- **States:** le lien actif et l'accès au catalogue utilisent le bleu lac. Le survol colore ou atténue sans mouvement. Sur petit écran, le libellé long de la marque disparaît mais les commandes principales restent présentes.

### Indicator Cards

La synthèse d’accueil sépare les nombres par thème et la préparation des 30 indicateurs. Les cartes de thème affichent uniquement le nom et un effectif avec son unité. La maturité est une liste globale : libellé complet, explication concrète, puis nombre d’indicateurs. Éviter les notations « niveau · effectif » qui demandent de décoder une légende. Les listes L1/L2 et la source sont expliquées dans un détail repliable. La grille des thèmes passe à deux colonnes sous 640 px ; les définitions de maturité passent sous leur libellé sous 900 px.

Les variantes mini et étendue partagent le même en-tête sémantique, l'identifiant, les badges de liste et de typologie, puis un pied regroupant maturité et mode d’action VTT principal proposé. La variante étendue ajoute les métadonnées de mesure dans un corps blanc. La carte entière est le contrôle d'ouverture du panneau latéral.

Le bandeau de synthèse du catalogue aligne les six statistiques dans une grille régulière. Chaque cellule conserve le nombre et son libellé sur une même ligne de base. La grille passe à trois colonnes sous 900 px puis à deux colonnes sous 640 px.

### Side Panel

`components.side-panel` se superpose à un voile ardoise translucide et conserve un fond clair. Sa largeur est bornée par le viewport; son en-tête reprend la couleur du pôle, son corps défile et ses blocs de métadonnées restent sur fond blanc. Le rattachement VTT y distingue le mode d’action principal, sa question évaluative et tous les modes d’action secondaires proposés ; toute valeur hors des six modes d’action est signalée comme à confirmer.

### Matrice indicateurs × maturité

La matrice du catalogue conserve les modes d’action en lignes et les quatre niveaux de maturité en colonnes. Chaque indicateur est représenté par une ligne compacte avec son identifiant, son intitulé tronqué visuellement et un filet portant la couleur de son pôle. Le nom complet reste disponible au survol et dans les fiches affichées après sélection d’une cellule. Les cellules vides restent discrètes, les totaux sont alignés dans le pied du tableau et le conteneur défile horizontalement sur les petits écrans. Les indicateurs sans niveau de maturité ou sans mode d’action VTT principal ne sont pas forcés dans une cellule : ils apparaissent dans une section repliable sous la matrice. La vue Par VTT inclut les rattachements principaux et secondaires ; un indicateur peut apparaître dans plusieurs modes mais le total reste un effectif d’identifiants uniques. Sa section « Autres indicateurs » conserve les fiches sans maturité ou sans rattachement à l’un des six modes.

### Vue en colonnes

La vue en colonnes organise les indicateurs selon les quatre niveaux de maturité et ajoute une colonne « Non renseignée » lorsque la sélection contient des fiches à qualifier. Les colonnes défilent horizontalement et leurs listes verticalement afin de conserver une hauteur maîtrisée, y compris lorsque les listes L3 et L4 sont actives. Les cartes compactes affichent l’identifiant, le pôle, la liste, le mode d’action VTT principal et la typologie. Elles ouvrent la même fiche détaillée que les autres vues.

### Lecture des modes d’action VTT

La section est intitulée « Un territoire commun, six modes d’action ». Le module adopte une composition éditoriale plutôt qu’un diagramme technique. La question commune « Quels impacts sur le territoire ? » forme le centre symbolique de la lecture dans un grand cercle terre cuite à double anneau, inscrit dans un bandeau bleu brume. Les six modes sont ensuite répartis en deux ensembles structurés. Préservation, Reconnexion et Revitalisation appartiennent à « Primauté du socle du vivant » ; Régénération, Mise en réseau et Circularité à « Rééquilibrage multipolaire de l’agglomération ». Chaque contrôle associe un pictogramme Lucide, un libellé et la couleur sémantique du mode dans une même ligne de sélection. La zone « Du territoire aux indicateurs » prolonge cette lecture par l’illustration du moniteur et du smartphone POPGG, reliée au territoire par un filet directionnel court.

Le choix d’un mode, signalé par `aria-pressed`, un fond teinté et un filet inférieur renforcé, affiche immédiatement un second niveau de lecture sous la sélection. Ce panneau donne le contexte du mode selon trois contributions compactes : ENV, URB et MOB, chacune accompagnée de son libellé accessible et de son texte explicatif. Le même choix met à jour l’introduction, l’axe VTT, les deux ou trois leviers territoriaux issus des planches de référence et jusqu’à six exemples d’indicateurs associés plus bas. Cette liste forme une grille compacte de quatre colonnes, visuellement distincte de la grille des leviers. Les indicateurs indiquent leur pôle, la nature principale ou secondaire du rattachement et leur maturité provisoire avec chiffre et libellé. L’accès au catalogue reste une action séparée sous la carte de détail.

Sous 900 px, le noyau de lecture commune est placé en tête et les deux classes deviennent deux grilles successives de trois modes. Les liaisons orbitales sont masquées; un libellé et une flèche verticale indiquent que les modes d’action alimentent l’observation avant la sortie POPGG. Sous 640 px, les pictogrammes sont réduits et les trois contributions du mode actif deviennent une liste verticale séparée par des filets. Cette composition conserve la séquence question commune, classes, modes, flux, sortie et contexte sans imposer de défilement horizontal.

### Matrice de mise en œuvre

`components.implementation-matrix` croise les six modes, les quatre pôles d’observation et les horizons L1 et L2. Un point coloré signale qu’au moins un rattachement principal ou secondaire existe dans le préclassement ; un point vide signale son absence. La couleur reste un repère secondaire. Les horizons sont toujours écrits avec leur phase, « Démarrage L1 », « Consolidation L2 » ou « À cadrer », afin que la couleur ne porte jamais seule l’information. La première colonne reste visible pendant le défilement horizontal sur petit écran. La matrice est qualifiée de lecture provisoire et ne doit pas être présentée comme une programmation opérationnelle validée. Les pictogrammes proviennent tous de la famille Lucide, dans un même style à trait fin : feuille, maillon, pousse, bâtiment, réseau et recyclage.

### Maturity Dots

Les quatre points matérialisent une échelle ordonnée. Les points atteints prennent la couleur du niveau courant, les autres utilisent le bleu-gris de bordure. Le chiffre et le libellé de maturité accompagnent cette forme dans les vues où une interprétation autonome est nécessaire.

## Do's and Don'ts

### Do:

- **Do** utiliser les variables sémantiques existantes pour toute couleur, plutôt que des valeurs dispersées dans un composant.
- **Do** réserver le bleu lac aux actions, états actifs et repères fonctionnels.
- **Do** associer les couleurs de pôle, de mode d’action VTT et de maturité à un libellé, un identifiant ou une forme.
- **Do** présenter les six modes d'action par leur nom : Préservation, Reconnexion, Revitalisation, Régénération, Mise en réseau et Circularité.
- **Do** conserver des surfaces claires, des bordures fines et des ombres ambiantes.
- **Do** préserver les cibles tactiles de 44 px, le focus visible et la réduction des mouvements.

### Don't:

- **Don't** introduire de grand aplat noir, anthracite ou vert forêt.
- **Don't** utiliser le vert sauge comme couleur générique de validation, d'action ou de navigation.
- **Don't** remplacer la hiérarchie éditoriale par une esthétique de tableau de bord technique dense et fermé.
- **Don't** ajouter d'ombres lourdes, de bordures épaisses, de déplacement de mise en page au survol ou d'animation décorative.
- **Don't** employer des icônes Unicode lorsqu'un pictogramme SVG est disponible.
- **Don't** afficher les numéros 1.1 à 2.3 devant les modes d'action ; ces codes restent réservés aux clés internes et à la traçabilité du corpus.

## Ajustements du catalogue · 28 septembre 2026

Le bandeau du catalogue est compact ; la synthèse du portefeuille de référence est repliable et distincte du compteur de résultats filtrés. Les commandes séparent vue et densité. La réinitialisation restaure les filtres L1/L2 par défaut. Les trois onglets passent sur deux lignes sur petit écran ; les commandes cessent d’être collantes pour préserver la place de lecture.

Les relations entre registres sont des boutons textuels identifiés par code et intitulé. Un retour contextuel restaure la sélection et les filtres précédents. Les liens reflètent les identifiants explicites du classeur, sans inférence sémantique.
