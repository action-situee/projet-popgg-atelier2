# atelier2

Application autonome React + Vite + Tailwind CSS pour le prototype POPGG.

## Développement

- `pnpm dev` lance le serveur local Vite.
- `pnpm build` vérifie TypeScript et produit la version de production.
- `pnpm preview` sert localement la version produite.

## Structure

- `src/main.tsx` monte l'application React.
- `src/App.tsx` contient la page d'accueil.
- `src/IndicateursPage.tsx` contient le catalogue d'indicateurs.
- `src/data/indicators.ts` contient les données et types des indicateurs.
- `src/index.css` contient les styles globaux et le thème Tailwind.

## Conventions

- Préserver l'alias `@` vers `src`.
- Ne pas introduire de chemins absolus.
- Vérifier les changements avec `pnpm build`.
- Conserver les formulations, données et sources métier sans les modifier implicitement.
