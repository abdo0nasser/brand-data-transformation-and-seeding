# Brands Data Transformation

This repository is a Node.js + TypeScript + Mongoose project that imports raw brand documents, normalizes them in-place, seeds additional fake brands, and exports the final collection.

## Setup

```bash
npm install
```

## Run

```bash
# Run the project with ts-node
npx ts-node .
```

You can also provide a custom MongoDB URI via `.env` or environment variable:

```bash
MONGODB_URI=mongodb://localhost:27017/brands_db npx ts-node .
```

## What this project does

The main script in `src/index.ts` executes the following steps:

1. Connect to MongoDB.
2. Import raw brand documents from `src/brands.json` into the `brands` collection.
    - Existing `brands` collection is dropped first.
    - Raw documents preserve original `_id` values.
3. Transform the imported documents in-place using the schema rules.
4. Seed 10 additional fake brand documents using `@faker-js/faker`.
5. Export the full `Brand` collection to `brands_export.json` at the repository root.

## Project structure

- `src/index.ts`: orchestrates DB connection, import, transform, seed, and export.
- `src/brands-schema.ts`: Mongoose schema and `Brand` model.
- `src/transform.ts`: normalizes raw brand documents and applies schema-based updates.
- `src/seeder.ts`: generates and inserts 10 fake brand documents.
- `src/brands.json`: raw input dataset containing intentional brand documents with some mistakes.
- `brands_export.json`: output file produced after running the script.

## Transformation rules

The transformation logic in `src/transform.ts` includes the following fallback rules:

- `brandName`
    - Prefer `brandName` if present and non-empty.
    - Otherwise use nested `brand.name`.
    - If neither exists, defaults to an empty string.

- `headquarters`
    - Prefer `headquarters` if present and non-empty.
    - Otherwise use `hqAddress`.

- `yearFounded`
    - Prefer `yearFounded` if it is a valid number in the schema range.
    - Otherwise fall back to `yearCreated` or `yearsFounded`.
    - If none are valid, use the schema minimum (`1600`).

- `numberOfLocations`
    - Parse the field as a number and require at least `1`.
    - Otherwise default to the schema minimum of `1`.

- Stale fields dropped after transformation:
    - `yearCreated`
    - `yearsFounded`
    - `hqAddress`
    - `brand`

## Notes

- The repository currently does not define a `start` script in `package.json`.
- Use `npx ts-node .` to run the script directly.
- The `.env` file is optional and can contain `MONGODB_URI` for your database connection.
