import { brandSchema } from "./brands-schema";

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = brandSchema.path("yearFounded").options.min[0];
export const MAX_YEAR = brandSchema.path("yearFounded").options.max[0];
export const MIN_NUM_OF_LOCATIONS =
    brandSchema.path("numberOfLocations").options.min[0];
