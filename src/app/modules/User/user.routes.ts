import express from "express";
import { UserControllers } from "./user.controllers";
import validationRequest from "../../middlewares/validationRequest";
import { UserValidationsSchema } from "./user.validations";

const router = express.Router();

router.post(
  "/register",
  validationRequest(UserValidationsSchema.CreateUser),
  UserControllers.createUser
);

router.post(
  "/login",
  validationRequest(UserValidationsSchema.loginData),
  UserControllers.loginUser
);

export const UserRoutes = router;
