import { z } from "zod";

const createBooking = z.object({
  body: z.object({
    flatId: z.string({
      required_error: "FlatId field is required",
      invalid_type_error: "FlatId must be a string",
    }),
  }),
});

export const BookingValidations = {
  createBooking,
};
