# Security Compliance System

A React front end for the Security Compliance System (SCS): scan applications for security gaps, track findings through to a fix, and stay audit-ready.

The same responsive build serves as both the desktop web app and a mobile "app" experience — the layout switches from a sidebar to a bottom tab bar under 1024px, and the app is installable to a phone's home screen (PWA manifest + icons) for an app-like feel with no native build required.

## Stack

- [React 18](https://react.dev/) + [React Router](https://reactrouter.com/) (hash-based routing, so it deploys as static files with no server config)
- [Vite](https://vitejs.dev/) for dev server and bundling
- Plain CSS (`src/styles.css`), no CSS framework

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/   Reusable UI: icons, form fields, dialogs, chips, org switcher
  context/      App state (org/apps/findings/members) and toast notifications
  data/         Sample data + icon/nav definitions
  pages/        Route-level views (Landing, Signin, Signup, and the app shell's pages)
  App.jsx       Route table
  main.jsx      Entry point
```

## Backend integration

This is currently a front-end prototype: all data lives in React state (see `src/context/AppContext.jsx` and `src/data/sampleData.js`) and the session is mocked via `sessionStorage`. Every place that needs a real API call is marked with a `TODO(backend)` comment — search for that string to find every integration point (auth, organizations, applications, findings, members).
