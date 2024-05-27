import { z } from "zod";

const createFlatShareRequest = z.object({
  body: z.object({
    flatId: z.string({
      required_error: "FlatId field is required",
      invalid_type_error: "FlatId must be a string",
    }),
  }),
});

const updateFlatShareRequest = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    space: z.number().optional(),
  }),
});

export const FlatShareRequestValidations = {
  createFlatShareRequest,
  updateFlatShareRequest,
};
