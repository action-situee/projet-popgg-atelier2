# POPGG atelier 2

Prototype de consultation du portefeuille d’indicateurs POPGG, de leurs rattachements VTT et de leur chaîne de responsabilité. Il présente des fiches documentaires, pas des résultats calculés.

## Parcours disponibles

Le catalogue contient trois registres liés : Indicateurs, Données et Politiques publiques. Les liens entre fiches reprennent les identifiants explicites du classeur ; le retour conserve le contexte de consultation. Les vues VTT exploitent tous les rattachements disponibles. La matrice reste fondée sur le rattachement principal pour éviter les doubles comptes ; cette règle est affichée.

## Développement

```bash
pnpm install
pnpm dev
```

## Construction

```bash
pnpm exec tsc --noEmit
pnpm build
```

## Vérifications ciblées

Avec Node.js prenant en charge `--experimental-strip-types`, puis Python avec pandas et openpyxl :

```bash
node --experimental-strip-types --test tests/catalogue.test.ts
python3 tests/test_import_catalogue.py
```

Ces tests portent sur les relations explicites, la conservation des rattachements VTT et les effectifs de maturité. Ils ne constituent pas un audit complet de sécurité ou d’accessibilité.

## Actualisation du catalogue

Le contenu de l’application est généré depuis le classeur consolidé. Avec Python, pandas et openpyxl disponibles :

```bash
python3 scripts/sync_catalogue.py <chemin-du-classeur.xlsx>
pnpm build
```

Le script régénère `src/data/catalogue.generated.json` et conserve les adaptations TypeScript utilisées par l’interface. Il exclut les notes d’atelier nominatives, les commentaires internes et les coordonnées de production du fichier public.

## Déploiement Cloudflare Pages

Le dépôt est prévu pour une intégration Git à Cloudflare Pages :

- branche de production : `main` ;
- commande de construction : `pnpm build` ;
- répertoire de sortie : `dist` ;
- répertoire racine : `/` ;
- version Node.js : 22, définie dans `.nvmrc`.

Le fichier `public/_headers` ajoute les en-têtes de sécurité et la mise en cache longue des fichiers Vite versionnés. L’application utilise des routes par ancre, aucune règle de réécriture n’est nécessaire.

Dans Cloudflare : Workers & Pages · Create application · Pages · Import an existing Git repository. Sélectionner `action-situee/projet-popgg-atelier2`, vérifier les paramètres ci-dessus, puis lancer le premier déploiement. Les poussées suivantes sur `main` redéploieront automatiquement le site.

R2 n’est pas nécessaire : l’application et son catalogue sont statiques et les ressources sont intégrées au build.

Les hypothèses éditoriales, les sources de travail et les éléments restant à confirmer sont documentés dans `CONTENT_NOTES.md`.
