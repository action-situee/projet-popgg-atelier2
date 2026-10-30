# POPGG atelier2

## Produit

POPGG est une interface d’observation et de prospective territoriale du Grand Genève. Cette version présente le portefeuille de travail L1 + L2, soit 30 indicateurs, leurs niveaux de maturité provisoires et tous leurs rattachements proposés aux six modes de la Vision Territoriale Transfrontalière 2050, en distinguant principal et secondaires.

La VTT constitue l’ossature narrative : « primauté du socle du vivant » et « rééquilibrage multipolaire de l’agglomération », déclinés en Préservation, Reconnexion, Revitalisation, Régénération, Mise en réseau et Circularité. L’interface rend aussi visible la chaîne de responsabilité allant de la source à la maintenance. L’attribution nominative de ces responsabilités et les conditions de publication restent [À COMPLÉTER].

Le contenu est synchronisé avec le classeur consolidé du 9 septembre 2026. Le catalogue regroupe 30 indicateurs prioritaires L1 et L2, 68 indicateurs complémentaires L3 et L4, 44 entrées de données et 152 politiques publiques. Les rattachements VTT, niveaux de maturité et champs de responsabilité reprennent le classeur source ; les valeurs non renseignées restent explicitement signalées.

Les trois registres sont reliés par les identifiants explicites de la source. Les effectifs par niveau remplacent les moyennes de maturité ; le nombre d’indicateurs uniques reste distinct du nombre de rattachements. Les commandes séparent organisation de la vue et densité d’affichage, avec une réinitialisation des filtres.

## Contrat de direction

- THESIS : rendre une matière territoriale complexe consultable sans donner à l’outil l’apparence d’un tableau de bord technique fermé.
- OWN WORLD : un observatoire territorial clair, éditorial et analytique, ancré dans une palette lémanique et minérale.
- STORY : découvrir le tableau de bord territorial du Grand Genève, comprendre comment ses indicateurs traduisent les principes « ménager, hybrider et renouveler le territoire », identifier la chaîne de responsabilité, parcourir les deux axes et six modes VTT, puis explorer les fiches indicateurs.
- FIRST VIEWPORT : la proposition POPGG, le Grand Genève et l’accès au catalogue doivent être identifiables sans ambiguïté.
- FORM : surfaces claires, hiérarchie typographique éditoriale, données structurées en cartes, interactions sobres et réversibles.
- Seed key : `popgg-observatoire-clair-20260904`.

## Carte QUALITY BAR

- Fidélité : aucun grand aplat noir ou vert forêt ; vert sauge réservé aux contenus environnementaux.
- Cohérence : couleurs, rayons, ombres et états proviennent des jetons sémantiques définis dans `src/index.css`.
- Lisibilité : texte courant avec un contraste cible d’au moins 4,5:1 ; microtextes non essentiels limités et jamais atténués au point de devenir illisibles.
- Responsive : absence de débordement horizontal à 375, 390, 768, 1024, 1138 et 1440 px.
- Interaction : focus visible, état actif explicite et cible tactile de 44 px sur les périphériques tactiles.
- Mouvement : transitions brèves, non structurelles et désactivées lorsque `prefers-reduced-motion` est actif.
