# Système de design POPGG

Direction : observatoire territorial clair, éditorial et analytique. L’interface doit rester lisible, calme et crédible, sans grands aplats noirs ni dominante verte.

## Principes

- Mode clair uniquement pour cette version.
- Fond général ivoire, sections de respiration bleu brume, cartes blanches.
- Bleu lac pour les actions, la navigation active et les repères fonctionnels.
- Terre cuite et ocre pour les accents éditoriaux et les appels secondaires.
- Vert sauge réservé aux contenus liés à l’environnement et à la préservation.
- La couleur ne porte jamais seule une information : elle est accompagnée d’un libellé, d’un niveau ou d’une forme.

## Palette sémantique

| Usage | Variable | Valeur |
| --- | --- | --- |
| Fond principal | `--color-canvas` | `#f6f3ed` |
| Fond secondaire | `--color-canvas-cool` | `#edf3f6` |
| Surface | `--color-surface` | `#ffffff` |
| Texte courant | `--color-text` | `#2e3e4b` |
| Texte fort | `--color-text-strong` | `#213544` |
| Texte secondaire | `--color-text-muted` | `#62717c` |
| Action principale | `--color-primary` | `#315f7b` |
| Action principale forte | `--color-primary-strong` | `#24495f` |
| Accent éditorial | `--color-accent` | `#c86849` |
| Environnement | `--color-sage` | `#557569` |
| Transformation | `--color-violet` | `#6c5e8e` |
| Circularité | `--color-ochre` | `#a8792a` |

Les fonds de catégories utilisent les déclinaisons `*-soft`. Les niveaux de maturité utilisent `--color-status-1` à `--color-status-4`, dans l’ordre terre cuite, ocre, bleu et violet. Cette échelle 1–4 est provisoire et doit être présentée comme telle jusqu’à l’arbitrage avec les statuts du compte rendu du 31 août 2026.

## Typographie

- Titres : Newsreader, pour l’identité éditoriale et territoriale.
- Interface et texte courant : Public Sans, pour la lisibilité des données et des commandes.
- Les titres restent en casse naturelle. Les capitales sont réservées aux micro-libellés et aux niveaux.
- Les textes courants restent à 14 px ou plus. Les métadonnées compactes peuvent descendre à 11–12 px si elles utilisent une couleur de texte pleinement contrastée, sans opacité d’atténuation.

## Surfaces et composants

- Cartes : fond blanc, bordure sémantique de 1 px, rayon `--radius-md`, ombre `--shadow-sm` ou `--shadow-md`.
- Bouton principal : fond bleu lac, texte blanc, rayon `--radius-sm`.
- Bouton secondaire : fond blanc, texte ardoise, bordure bleu-gris.
- Filtres actifs : couleur de la catégorie ou bleu lac, avec texte blanc lorsque le contraste le permet.
- Panneaux latéraux : surface blanche, séparation discrète, pas de fond sombre.
- Illustration : palette ardoise, sauge, argile et tons chair atténués.

## États et accessibilité

- Contraste minimal visé : 4,5:1 pour le texte courant.
- Tous les contrôles ont un état `:focus-visible` avec `--focus-ring`.
- Les états actifs utilisent `aria-pressed` lorsque le composant fonctionne comme un choix.
- Les cibles tactiles principales font au moins 44 × 44 px.
- Les transitions restent entre 150 et 220 ms et sont supprimées avec `prefers-reduced-motion: reduce`.
- Aucun effet de survol ne doit provoquer de déplacement de mise en page.

## Mise en page

- Grille fluide avec contenu centré et respirations généreuses sur grand écran.
- À 768 px et moins, les groupes de filtres peuvent se replier ou défiler sans créer de débordement global.
- À 390 px, les colonnes deviennent séquentielles et les commandes restent utilisables sans zoom.

## À éviter

- Grands aplats noirs, anthracite ou vert forêt.
- Vert utilisé comme couleur générique de validation, d’action ou de navigation.
- Couleurs hexadécimales dispersées dans les composants.
- Ombres lourdes, bordures épaisses et animations décoratives.
- Icônes Unicode lorsque des pictogrammes SVG sont disponibles.
