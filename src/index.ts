import dotenv from "dotenv";
import mongoose from "mongoose";
import { transformData } from "./transform";
import { seedBrands } from "./seeder";
import { Brand } from "./brands-schema";
import fs from "fs/promises";
import path from "path";

dotenv.config();

async function importRawData() {
    const rawDataPath = path.resolve(__dirname, "./brands.json");
    const rawData: Array<Record<string, unknown>> = JSON.parse(
        await fs.readFile(rawDataPath, "utf-8"),
    );

    // Drop the collection first to ensure a clean import
    const db = mongoose.connection.db;
    if (!db) throw new Error("- Database connection not established");

    const collections = await db.listCollections({ name: "brands" }).toArray();
    if (collections.length > 0) {
        await db.collection("brands").drop();
        console.log("- Dropped existing brands collection");
    }

    // Insert raw documents as-is (preserving original _id and schema issues)
    const rawDocs = rawData.map((doc) => {
        const { _id, ...rest } = doc;
        return {
            _id: new mongoose.Types.ObjectId((_id as { $oid: string }).$oid),
            ...rest,
        };
    });

    await db
        .collection("brands")
        .insertMany(
            rawDocs as mongoose.mongo.OptionalId<mongoose.mongo.Document>[],
        );
    console.log(
        `- Inserted ${rawDocs.length} raw documents into brands collection`,
    );
}

async function exportData() {
    const EXPORT_PATH = path.resolve(__dirname, "../brands.json");

    const data = await Brand.find({});
    try {
        await fs.writeFile(EXPORT_PATH, JSON.stringify(data, null, 2), "utf-8");
        console.log("- File written successfully");
    } catch (err) {
        console.error("Failed to write file:", err);
    }
}

async function main() {
    console.log("connecting to mongodb");
    await mongoose.connect(
        process.env.MONGODB_URI ?? "mongodb://localhost:27017/brands_db",
    );
    console.log("successfully connected to mongodb");

    console.log("Step 1: Importing raw brands data");
    await importRawData();

    console.log("Step 2: transforming imported raw data");
    await transformData();

    console.log("Step 3: seeding brand new data");
    await seedBrands();

    console.log("Step 4: exporting data");
    await exportData();
}

main();
