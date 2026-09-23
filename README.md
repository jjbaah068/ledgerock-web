# Ledgerock

Ledgerock is a React and TypeScript property showcase for lakefront and lakeview lots. It is built with Vite and uses React Router for client-side navigation.

The project currently contains the public-facing pages, reusable marketing components, animation dependencies, and placeholder lot data. It does not include a backend, database, authentication system, or server-side rendering layer.

## Tech stack

- React 19
- TypeScript
- Vite 8
- React Router 7
- Tailwind CSS 4
- Motion and GSAP for animation
- Lenis for smooth scrolling
- Lucide React for icons
- ESLint and TypeScript for code quality

## Requirements

- Node.js 20 or newer is recommended.
- npm 10 or newer is recommended.

Check your installed versions:

```bash
node --version
npm --version
```

## Getting started

Install dependencies, start the development server, and open the URL shown in the terminal (usually `http://localhost:5173`):

```bash
npm install
npm run dev
```

The Vite dev server provides fast hot module replacement. Most edits appear in the browser without a full page reload.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run lint` | Run ESLint across the repository. |
| `npm run preview` | Serve the existing `dist/` build locally. Run `npm run build` first. |

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## Project structure

```text
ledgerock/
├── public/                 # Files copied directly to the build output
│   └── _redirects          # Netlify SPA fallback configuration
├── src/
│   ├── assets/             # Images and other files imported by components
│   ├── components/         # Reusable UI sections and site-wide components
│   ├── data/               # Local application data and data helpers
│   │   └── lots.ts         # Lot types, placeholder records, and lookup helper
│   ├── pages/               # Route-level page components
│   ├── App.tsx              # Router definition and root layout
│   ├── index.css            # Global styles and Tailwind entry point
│   └── main.tsx             # Browser entry point; mounts React into #root
├── index.html               # Vite's HTML entry document
├── vite.config.ts           # Vite configuration
├── tsconfig*.json           # TypeScript configuration
└── package.json              # Scripts and dependencies
```

### Where to make common changes

- Add or change a URL in `src/App.tsx`.
- Add a new route page in `src/pages/`.
- Add a reusable section, navigation element, or footer in `src/components/`.
- Update lot records or lot types in `src/data/lots.ts`.
- Add global styling in `src/index.css`; keep component-specific styling close to the component.
- Add images used by React to `src/assets/` and import them from TypeScript.
- Put files that must keep a public URL, such as a favicon or a robots file, in `public/`.

## Routing

Routes are configured explicitly in `src/App.tsx` with `createBrowserRouter`. The current routes are:

| URL | Page |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/contact` | Contact |
| `/properties` | Properties listing |
| `/properties/:lotId` | Property detail |
| `/tablerockliving` | Table Rock Living |

The `RootLayout` renders shared behavior such as `ScrollToTop` and an `Outlet`. Child route components render inside that outlet.

### Adding a route

Create the page component, import it into `src/App.tsx`, and add a child route:

```tsx
import NewPage from "./pages/newpage.tsx";

// inside the children array
{ path: "/new-page", element: <NewPage /> },
```

Use React Router links for internal navigation so the browser does not perform a full document request:

```tsx
import { Link } from "react-router-dom";

<Link to="/properties">View properties</Link>
```

For a dynamic page such as `/properties/:lotId`, read the route parameter with `useParams` and use the existing `getLotById` helper. Add a not-found state when the ID does not match a lot.

## Next.js to Vite: important differences

Vite is a frontend build tool, not a full-stack framework. React still provides the component model, but Vite does not automatically provide file-based routing, server components, API routes, server actions, or server-side rendering.

### Routing: file names do not create URLs

In Next.js, `app/about/page.tsx` or `pages/about.tsx` can create `/about`. In this project, a file in `src/pages/` is only a component until it is registered in the router.

```text
src/pages/about.tsx       # Component only
src/App.tsx               # { path: "/about", element: <About /> }
```

A route change normally means three steps: create the page component, import it into `App.tsx`, and register its `path`. Dynamic segments use the router syntax, for example `/properties/:lotId`, rather than Next.js's `[lotId]` folder convention.

### There is one browser entry point

Next.js can render a different document on the server for each route. This app starts at `index.html`, then `src/main.tsx` mounts `<App />` into the element with `id="root"`. React Router changes the rendered page in the browser after that.

Do not create a separate HTML file for each page. Add a route and a page component instead.

### Rendering and data loading

Components in this app run in the browser. There is no `getServerSideProps`, `getStaticProps`, `generateStaticParams`, Server Component, or server action equivalent built into Vite.

For local data, import a typed module such as `src/data/lots.ts`. For remote data, fetch it from a client component or a client-side data library, then handle loading, error, and empty states. A secure secret must never be placed in browser code; use a backend or serverless function for operations that require private credentials.

### Assets

Files imported from `src/assets/` are processed and fingerprinted by Vite:

```tsx
import heroImage from "./assets/hero.jpg";

<img src={heroImage} alt="Lakefront property" />
```

Files in `public/` are copied as-is and referenced from the site root:

```tsx
<img src="/logo.svg" alt="Ledgerock" />
```

Prefer `src/assets/` for images imported by components. Use `public/` when a stable, direct URL is required.

### Environment variables

Vite exposes browser-safe variables through `import.meta.env`, and client-exposed variables must start with `VITE_`:

```text
VITE_CONTACT_ENDPOINT=https://example.com/contact
```

Read one in code with `import.meta.env.VITE_CONTACT_ENDPOINT`. Unlike a Next.js server environment variable, a `VITE_` variable is included in the client bundle and is not secret. Do not put API keys, database credentials, or other private values in it.

### Metadata and document behavior

There is no automatic Next.js `Metadata` export. Page titles, descriptions, and other document-level behavior must be handled explicitly, either in `index.html` for site-wide defaults or with a client-side head management approach when route-specific metadata is needed.

### Deployment and refreshes

Run `npm run build` and deploy the generated `dist/` directory. Because this is a browser-routed SPA, the hosting provider must serve `index.html` as a fallback for unknown paths. The included `public/_redirects` file supports this on Netlify.

Without a fallback, opening `/properties/lot-1` directly or refreshing that page may produce a 404 even though navigation from `/` works.

## Working with the lot data

`src/data/lots.ts` defines the `Lot` TypeScript interface, the `LOTS` collection, status styling values, and `getLotById`. The current records contain placeholder values and placeholder images. Replace them with confirmed property information before treating the site as production-ready.

When adding a lot:

1. Keep its `id` stable because it is used by the dynamic URL.
2. Use one of the allowed `LotStatus` values: `Available`, `Reserved`, or `Sold`.
3. Provide gallery images and the fields required by the `Lot` interface.
4. Check both the listing page and `/properties/:lotId` detail page.

## Styling and component conventions

Global styles live in `src/index.css`. The project uses Tailwind CSS utilities alongside regular CSS. Keep route-level composition in `src/pages/` and move repeated visual patterns into `src/components/` rather than duplicating them across pages.

When creating a new interactive section, make sure it works with keyboard navigation, has meaningful image `alt` text, and remains usable on narrow screens. Run the app with `npm run dev` and check both a desktop and mobile viewport before considering a page complete.

## Troubleshooting

### A route works through a link but fails after refresh

Configure the hosting provider's SPA fallback to `index.html`. Netlify uses the included `public/_redirects` file; other hosts have equivalent rewrite rules.

### An image is missing in production

Confirm whether it is a `src/assets/` import or a `public/` URL. Do not use a filesystem path such as `src/assets/image.png` directly in an `<img>` tag.

### A new dependency is not recognized

Stop and restart the Vite server after changing dependencies, then run `npm install` if needed. Check that the package is in the correct `dependencies` or `devDependencies` section of `package.json`.

### TypeScript or lint errors appear only during build

The build runs `tsc -b` before Vite bundles the app. Run `npm run build` locally instead of relying only on the dev server, because Vite's dev transform does not replace a full TypeScript validation step.

## License and content status

No license has been specified for this repository. Property details and imagery currently include placeholder content and should be reviewed before public launch.
