# DVD Sleep Site

A Next.js static site that recreates the classic bouncing DVD sleep screen.

## Setup

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
```

This project uses static export (`output: "export"`), so build output is generated in `out/`.

## Base path behavior

- For project pages (`https://<user>.github.io/<repo>/`), `next.config.mjs` auto-resolves `basePath` from `GITHUB_REPOSITORY` in production builds.
- You can override it explicitly with `NEXT_PUBLIC_BASE_PATH`.

Example:

```bash
NEXT_PUBLIC_BASE_PATH=/my-repo npm run build
```

## Custom logo

The UI provides a `Custom logo URL` field. Leave it empty to use the built-in DVD text logo.
