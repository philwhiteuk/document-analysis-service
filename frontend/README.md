# Document Analysis Frontend

## Features
- Upload documents for analysis
- View metrics (total words, unique words, average sentence length, Flesch–Kincaid grade)
- **NEW:** View Top 10 words as a table or interactive bar chart

## Top 10 Words Chart
- The Top 10 words section now supports toggling between a table and a bar chart view.
- The chart is implemented using [`recharts`](https://recharts.org/), a popular React charting library with TypeScript support.

## Setup

```sh
npm install
```

## Adding Dependencies

This project uses:
- `recharts` for charts (`npm install recharts`)

## Development

```sh
npm run dev
```

## Testing

```sh
npm run test
```

## Usage

- Upload a document on the main page.
- Scroll to the "Top 10 words" section.
- Use the Table/Chart buttons to toggle the view.

---

### Architecture
- React + TypeScript
- Vite for build tooling
- See [`src/Metrics.tsx`](src/Metrics.tsx) for the chart implementation.

---

For more details, see the [backend README](../backend/README.md) or reach out to the maintainers.
