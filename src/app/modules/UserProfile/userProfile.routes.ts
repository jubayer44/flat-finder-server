import express from "express";
import { UserProfileControllers } from "./userProfile.controllers";
import validationRequest from "../../middlewares/validationRequest";
import { UserProfileValidations } from "./userProfile.validations";

const router = express.Router();

router.get("/", UserProfileControllers.getUserProfile);

router.put(
  "/",
  validationRequest(UserProfileValidations.updateUserProfile),
  UserProfileControllers.updateUserProfile
);

export const UserProfileRoutes = router;
