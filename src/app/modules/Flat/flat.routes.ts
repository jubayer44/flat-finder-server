import express from "express";
import { FlatControllers } from "./flat.controllers";
import validationRequest from "../../middlewares/validationRequest";
import { FlatValidationsSchema } from "./flat.validations";

const router = express.Router();

router.post(
  "/",
  validationRequest(FlatValidationsSchema.createFlat),
  FlatControllers.addFlat
);

router.get("/", FlatControllers.getAllFlats);

router.put(
  "/:flatId",
  validationRequest(FlatValidationsSchema.updateFlat),
  FlatControllers.updateFlat
);

export const FlatRoutes = router;
