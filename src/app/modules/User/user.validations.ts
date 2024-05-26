import { z } from "zod";

const CreateUser = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name field is required",
      invalid_type_error: "Name must be a string",
    }),
    email: z
      .string({
        required_error: "Email field is required",
      })
      .email("Email must be a valid email address"),
    password: z
      .string({
        required_error: "Password field is required",
      })
      .min(5, "Password too short - should be 5 chars minimum"),
    bio: z
      .string({
        required_error: "Bio field is required",
        invalid_type_error: "Bio must be a string",
      })
      .optional(),
    profession: z.string({
      required_error: "Profession field is required",
      invalid_type_error: "Profession must be a string",
    }),
    address: z
      .string({
        required_error: "Address field is required",
        invalid_type_error: "Address must be a string",
      })
      .optional(),
  }),
});

const loginData = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email field is required",
      })
      .email("Email must be a valid email address"),
    password: z.string({
      required_error: "Password field is required",
    }),
  }),
});

export const UserValidationsSchema = {
  CreateUser,
  loginData,
};
