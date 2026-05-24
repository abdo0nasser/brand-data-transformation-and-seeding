import { Brand, brandSchema } from "./brands-schema";
import { MAX_YEAR, MIN_NUM_OF_LOCATIONS, MIN_YEAR } from "./constants";

// ------ Transorm Helpers --------
function resolveBrandName(doc: any): string {
    if (typeof doc.brandName == "string" && doc.brandName.trim() !== "")
        return doc.brandName;

    if (
        doc.brand &&
        typeof doc.brand.name === "string" &&
        doc.brand.name.trim() !== ""
    )
        return doc.brand.name;
    return "";
}

function resolveHeadquarter(doc: any): string {
    if (typeof doc.headquarters === "string" && doc.headquarters.trim() !== "")
        return doc.headquarters;

    if (typeof doc.hqAddress === "string" && doc.hqAddress.trim() !== "")
        return doc.hqAddress;
    return "";
}

function resolveYearFounded(doc: any): number {
    const yearFields: unknown[] = [
        doc.yearFounded,
        doc.yearCreated,
        doc.yearsFounded,
    ];

    for (let field of yearFields) {
        field = Number(field);

        if (typeof field === "number" && field >= MIN_YEAR && field <= MAX_YEAR)
            return field;
    }
    return MIN_YEAR;
}

function resolveNumberOfLocations(doc: any): number {
    const numOfLoc = Number(doc.numberOfLocations);

    if (numOfLoc && numOfLoc >= MIN_NUM_OF_LOCATIONS) return numOfLoc;
    return MIN_YEAR;
}

export async function transformData() {
    const rawBrands = await Brand.find().lean();
    const updates = [];

    let docsHavingProblems = 0;
    for (const rawBrand of rawBrands) {
        const correctedBrand = {
            brandName: resolveBrandName(rawBrand),
            yearFounded: resolveYearFounded(rawBrand),
            headquarters: resolveHeadquarter(rawBrand),
            numberOfLocations: resolveNumberOfLocations(rawBrand),
        };

        const tempDoc = new Brand(correctedBrand);

        // here we use the sync because our schema doesn't make any calls for the validations
        const err = tempDoc.validateSync();
        if (err) {
            docsHavingProblems++;
            continue;
        }

        updates.push({
            updateOne: {
                filter: { _id: rawBrand._id },
                update: {
                    $set: correctedBrand,
                    $unset: {
                        yearCreated: true,
                        yearsFounded: true,
                        hqAddress: true,
                        brand: true,
                    } as Record<string, true>,
                },
            },
        });
    }

    if (updates.length > 0) {
        console.log(`- Sending filtered bulk batch payload to the database`);
        await Brand.bulkWrite(updates, { strict: false });
        console.log(`- ${updates.length} doc/s updated successully`);
    } else {
        console.log("- No valid documents found to update.");
    }
}
