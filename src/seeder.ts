import { faker } from "@faker-js/faker";
import { Brand, brandSchema } from "./brands-schema";
import { CURRENT_YEAR, MIN_NUM_OF_LOCATIONS, MIN_YEAR } from "./constants";

function generateSeedData() {


    const seeds = [
        // Case 1: modern brand, founded recently, single location
        {
            brandName: faker.company.name(),
            yearFounded: faker.number.int({ min: 2010, max: CURRENT_YEAR }),
            headquarters: `${faker.location.city()}, ${faker.location.country()}`,
            numberOfLocations: MIN_NUM_OF_LOCATIONS,
        },

        // Case 2: Historic brand, founded in the 1600s (minimum boundary)
        {
            brandName: faker.company.name(),
            yearFounded: MIN_YEAR,
            headquarters: faker.location.city(),
            numberOfLocations: faker.number.int({ min: 1, max: 50 }),
        },

        // Case 3: Large multinational, many locations, mid-20th century founding
        {
            brandName: faker.company.name(),
            yearFounded: faker.number.int({ min: 1940, max: 1960 }),
            headquarters: `${faker.location.city()}, ${faker.location.country()}`,
            numberOfLocations: faker.number.int({ min: 5000, max: 20000 }),
        },

        // Case 4: Brand founded exactly at current year (max boundary)
        {
            brandName: faker.company.name(),
            yearFounded: CURRENT_YEAR,
            headquarters: faker.location.city(),
            numberOfLocations: faker.number.int({ min: 1, max: 5 }),
        },

        // Case 5: Brand with exactly 1 location (minimum boundary for numberOfLocations)
        {
            brandName: faker.company.name(),
            yearFounded: faker.number.int({ min: 1800, max: 2000 }),
            headquarters: faker.location.city(),
            numberOfLocations: MIN_NUM_OF_LOCATIONS,
        },

        // Case 6: Brand name with special characters (e.g. ampersand, comma)
        {
            brandName: `${faker.word.adjective()}, ${faker.word.noun()} & Co.`,
            yearFounded: faker.number.int({ min: 1700, max: 1900 }),
            headquarters: faker.location.city(),
            numberOfLocations: faker.number.int({ min: 10, max: 200 }),
        },

        // Case 7: Headquarters with full address (city + country)
        {
            brandName: faker.company.name(),
            yearFounded: faker.number.int({ min: 1950, max: 2005 }),
            headquarters: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
            numberOfLocations: faker.number.int({ min: 50, max: 500 }),
        },

        // Case 8: Mid-19th century founding with very large number of locations
        {
            brandName: faker.company.name(),
            yearFounded: faker.number.int({ min: 1850, max: 1899 }),
            headquarters: faker.location.city(),
            numberOfLocations: faker.number.int({ min: 10000, max: 50000 }),
        },

        // Case 9: Brand name that includes numbers (e.g. "7-Eleven style")
        {
            brandName: `${faker.number.int({ min: 1, max: 99 })}-${faker.word.noun()}`,
            yearFounded: faker.number.int({ min: 1960, max: 2000 }),
            headquarters: `${faker.location.city()}, ${faker.location.state()}`,
            numberOfLocations: faker.number.int({ min: 100, max: 3000 }),
        },

        // Case 10: Very recent brand (last 3 years) with modest footprint
        {
            brandName: faker.company.name(),
            yearFounded: faker.number.int({
                min: CURRENT_YEAR - 3,
                max: CURRENT_YEAR,
            }),
            headquarters: faker.location.city(),
            numberOfLocations: faker.number.int({ min: 2, max: 20 }),
        },
    ];

    return seeds;
}

export async function seedBrands() {
    const seedData = generateSeedData();

    console.log("- inserting 10 seed data into the db");
    const insertedData = await Brand.insertMany(seedData);

    console.log("- successfully inserted the seed data");
}
