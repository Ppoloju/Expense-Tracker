# Expense Tracker

Manage expenses, monthly budgets, and saving habits with charts and local spending insights. Built during a 3-hour hackathon.

**Live app:** [3hr-expense-tracker.netlify.app](https://3hr-expense-tracker.netlify.app)

## Tech Stack

**Core Framework:**
- **React 19.2.4** - JavaScript library for building interactive user interfaces with component-based architecture
- **Vite 8.0.4** - Modern build tool that provides fast development server with hot module replacement and optimized production builds

**Styling:**
- **Tailwind CSS 4.2.2** - Utility-first CSS framework for rapid UI development with responsive design and consistent styling

**Data Visualization:**
- **Recharts 3.8.1** - Composable charting library built on D3.js for creating responsive and interactive data visualizations

**Development Tools:**
- **ESLint** - Automated code linting tool to identify and fix code quality issues, enforce coding standards, and catch potential bugs
- **@vitejs/plugin-react** - Vite plugin that enables React Fast Refresh for instant component updates during development

This is a single-page React application that uses Vite for fast development and building, with local storage for data persistence (no backend database).

## Features

- Create, read, edit, and delete expenses across five categories
- Search transactions and filter by date range
- View spending totals, category charts, and budget insights
- Save expenses, budget, and theme in browser `localStorage`
- Responsive layout with light and dark themes

## Data Storage

Expenses and the monthly budget are saved in the browser that you use to access the site. They remain after refreshes and redeploys at the same site URL, but are not uploaded to Netlify or shared across browsers/devices. Clearing browser site data removes them. Netlify's static hosting does not provide a database; shared cloud storage would require adding a backend.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

### Build

Build for production:

```bash
npm run build
```

### Lint

Run ESLint:

```bash
npm run lint
```

### Preview

Preview the production build locally:

```bash
npm run preview
```


