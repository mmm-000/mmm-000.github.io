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

## GitHub Pages URL

| Repository name | Published URL |
|---|---|
| `mmm-000.github.io` | `https://mmm-000.github.io/` (root) |
| `dvd` (or other project repo) | `https://mmm-000.github.io/<repo>/` |

`next.config.mjs` sets `basePath` automatically from `GITHUB_REPOSITORY` in CI builds.

## Custom logo

Use **画像を選択** in the control panel, or leave it empty to use the default `public/dvd-logo.png`.
