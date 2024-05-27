import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import { UserControllers } from "./user.controllers";
import { UserValidationsSchema } from "./user.validations";

const router = express.Router();

router.post(
  "/register",
  validationRequest(UserValidationsSchema.CreateUser),
  UserControllers.createUser
);

router.get("/users", auth(UserRole.ADMIN), UserControllers.getAllUsers);

router.put(
  "/update-user",
  auth(UserRole.ADMIN, UserRole.USER),
  UserControllers.updateUser
);

export const UserRoutes = router;
