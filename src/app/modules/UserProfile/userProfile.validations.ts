import { z } from "zod";

const updateUserProfile = z.object({
  body: z.object({
    bio: z
      .string({
        invalid_type_error: "Bio must be a string",
      })
      .optional(),
    profession: z
      .string({
        invalid_type_error: "Profession must be a string",
      })
      .optional(),
    address: z
      .string({
        invalid_type_error: "Address must be a string",
      })
      .optional(),
  }),
});

export const UserProfileValidations = {
  updateUserProfile,
};
