import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { BookingServices } from "./booking.services";

const flatBookingRequest = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await BookingServices.flatBookingRequest(req.body, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking requests submitted successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await BookingServices.getAllBookingsFromDB(token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking requests retrieved successfully",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";
  const { bookingId } = req.params;

  const result = await BookingServices.updateBookingStatusIntoDB(
    req.body,
    bookingId,
    token
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking request updated successfully",
    data: result,
  });
});

export const BookingControllers = {
  flatBookingRequest,
  getAllBookings,
  updateBookingStatus,
};
