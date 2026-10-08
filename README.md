# Expense Tracker

Manage expenses, monthly budgets, and saving habits with charts and local spending insights. Built during a 3-hour hackathon.

**Live app:** [3hr-expense-tracker.netlify.app](https://3hr-expense-tracker.netlify.app)

## Features

- Create, read, edit, and delete expenses across five categories
- Search transactions and filter by date range
- View spending totals, category charts, and budget insights
- Save expenses, budget, and theme in browser `localStorage`
- Responsive layout with light and dark themes

## Data storage

Expenses and the monthly budget are saved in the browser that you use to access the site. They remain after refreshes and redeploys at the same site URL, but are not uploaded to Netlify or shared across browsers/devices. Clearing browser site data removes them. Netlify's static hosting does not provide a database; shared cloud storage would require adding a backend.

## Run locally

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Deploy to Netlify

For Git-based deploys, connect the repository and use:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |

For manual drag-and-drop deploys, run `npm install` and `npm run build`, then drop the generated `dist` folder into Netlify. Do not upload the project root or `node_modules`. The `public/_redirects` file is copied into the build to support direct page loads.

The deployed site URL is the browser-storage boundary. Netlify preview URLs and the final production URL have separate local data.

## GitHub repository

This project is hosted at [Ppoloju/Expense-Tracker](https://github.com/Ppoloju/Expense-Tracker).

**Repository description:** Manage expenses, monthly budgets, and saving habits. Built during a 3-hour hackathon.
