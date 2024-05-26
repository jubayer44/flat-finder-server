import { z } from "zod";

const createFlat = z.object({
  body: z.object({
    squareFeet: z.number({
      required_error: "Square feet field is required",
      invalid_type_error: "Square feet must be a number",
    }),
    totalBedrooms: z.number({
      required_error: "Total bedrooms field is required",
      invalid_type_error: "Total bedrooms must be a number",
    }),
    totalRooms: z.number({
      required_error: "Total rooms field is required",
      invalid_type_error: "Total rooms must be a number",
    }),
    utilitiesDescription: z.string({
      required_error: "Utilities description field is required",
      invalid_type_error: "Utilities description must be a string",
    }),
    location: z.string({
      required_error: "Location field is required",
      invalid_type_error: "Location must be a string",
    }),
    description: z.string({
      required_error: "Description field is required",
      invalid_type_error: "Description must be a string",
    }),
    rent: z.number({
      required_error: "Rent field is required",
      invalid_type_error: "Rent must be a number",
    }),
    availability: z
      .boolean({
        invalid_type_error: "Availability must be true or false",
      })
      .optional(),
    advanceAmount: z.number({
      required_error: "Advance amount field is required",
      invalid_type_error: "Advance amount must be a number",
    }),
  }),
});

const updateFlat = z.object({
  body: z.object({
    squareFeet: z
      .number({
        invalid_type_error: "Square feet must be a number",
      })
      .optional(),
    totalBedrooms: z
      .number({
        invalid_type_error: "Total bedrooms must be a number",
      })
      .optional(),
    totalRooms: z
      .number({
        invalid_type_error: "Total rooms must be a number",
      })
      .optional(),
    utilitiesDescription: z
      .string({
        invalid_type_error: "Utilities description must be a string",
      })
      .optional(),
    location: z
      .string({
        invalid_type_error: "Location must be a string",
      })
      .optional(),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .optional(),
    rent: z
      .number({
        invalid_type_error: "Rent must be a number",
      })
      .optional(),
    availability: z
      .boolean({
        invalid_type_error: "Availability must be true or false",
      })
      .optional(),
    advanceAmount: z
      .number({
        invalid_type_error: "Advance amount must be a number",
      })
      .optional(),
  }),
});

export const FlatValidationsSchema = {
  createFlat,
  updateFlat,
};
