import { BookingStatus } from "@prisma/client";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helper/jwtHelpers";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";

const flatBookingRequest = async (
  flatId: { flatId: string },
  token: string
) => {
  const validUser = await isUserAuthorized(token);

  const flat = await prisma.flat.findUnique({
    where: {
      id: flatId.flatId,
    },
  });
  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  const bookingData = {
    userId: validUser.id,
    flatId: flatId.flatId,
  };

  const result = await prisma.booking.create({
    data: bookingData,
  });

  return result;
};

const getAllBookingsFromDB = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const isTokenValid = jwtHelpers.verifyToken(
    token,
    config.jwt.JWT_SECRET as Secret
  );
  if (!isTokenValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const result = await prisma.booking.findMany();
  return result;
};

const updateBookingStatusIntoDB = async (
  status: { status: BookingStatus },
  bookingId: string,
  token: string
) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const isTokenValid = jwtHelpers.verifyToken(
    token,
    config.jwt.JWT_SECRET as Secret
  );
  if (!isTokenValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: status.status as BookingStatus,
    },
  });
  return result;
};

export const BookingServices = {
  flatBookingRequest,
  getAllBookingsFromDB,
  updateBookingStatusIntoDB,
};
