# Metrico

A modern React + TypeScript web application built with Vite.

---

## Tech Stack

- **Vite** — fast dev server and build tool
- **React 19** — UI framework
- **TypeScript** — type safety
- **Tailwind CSS v4** — utility-first styling
- **ESLint** — linting with auto-fix
- **Prettier** — code formatting

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/your-username/metrico.git
cd metrico
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

---

## Project Structure

```
src/
├── assets/             # images, fonts, icons
├── components/
│   ├── ui/             # generic UI (Button, Input, Modal…)
│   └── common/         # shared app-level components (Navbar, Sidebar…)
├── features/           # feature-sliced modules
├── hooks/              # global custom hooks
├── layouts/            # page layout wrappers
├── lib/                # third-party config (axios, queryClient…)
├── pages/              # route-level page components
├── services/           # API call functions
├── store/              # global state (Zustand / Redux slices)
├── types/              # shared TypeScript types/interfaces
└── utils/              # pure helper functions
```

---

## Path Aliases

Use `@/` to import from `src/` anywhere:

```ts
import { hello } from '@/utils/hello'
import { Button } from '@/components/ui/Button'
```

Configured in both `vite.config.ts` and `tsconfig.app.json`.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint (strict, 0 warnings) |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Auto-format with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## ESLint

Config file: `eslint.config.js`

Rules enabled:
- `@typescript-eslint` recommended rules
- `react-hooks` recommended rules
- `react-refresh` component export check
- `unused-imports` — auto-removes unused imports on `lint:fix`
- Unused variables flagged as warnings (prefix with `_` to silence)

```bash
npm run lint        # check
npm run lint:fix    # auto-fix
```

---

## Prettier

Config file: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

```bash
npm run format          # auto-fix all files
npm run format:check    # check without writing
```

---

## Tailwind CSS

Using Tailwind v4 via the `@tailwindcss/vite` plugin — no `tailwind.config.js` needed.

Entry point in `src/index.css`:

```css
@import "tailwindcss";
```

---

## TypeScript

Config file: `tsconfig.app.json`

Strict mode enabled with:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

---

## Setup Notes

- `baseUrl` is deprecated in TypeScript 7.0 — use `"ignoreDeprecations": "6.0"` to suppress the warning while keeping `@/` path aliases working
- Tailwind v4 uses `@import "tailwindcss"` instead of the old `@tailwind base/components/utilities` directives
- PowerShell doesn't support bash brace expansion — use `New-Item` or `ForEach-Object` for creating folder structures