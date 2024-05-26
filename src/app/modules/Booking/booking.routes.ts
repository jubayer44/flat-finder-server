import express from "express";
import { BookingControllers } from "./booking.controllers";
import validationRequest from "../../middlewares/validationRequest";
import { BookingValidations } from "./booking.validations";

const router = express.Router();

router.post(
  "/booking-applications",
  validationRequest(BookingValidations.createBooking),
  BookingControllers.flatBookingRequest
);

router.get("/booking-requests", BookingControllers.getAllBookings);

router.put(
  "/booking-requests/:bookingId",
  BookingControllers.updateBookingStatus
);

export const BookingRoutes = router;
