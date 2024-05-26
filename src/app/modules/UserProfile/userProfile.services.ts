import { UserProfile } from "@prisma/client";
import httpStatus from "http-status";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";

const getUserProfileFromDB = async (token: string) => {
  const isTokenValid = await isUserAuthorized(token);

  const result = await prisma.userProfile.findUniqueOrThrow({
    where: {
      userId: isTokenValid.id,
    },
  });
  return result;
};

const updateUserProfileIntoDB = async (
  payload: Partial<UserProfile>,
  token: string
) => {
  const isTokenValid = await isUserAuthorized(token);

  const user = await prisma.userProfile.findUnique({
    where: {
      userId: isTokenValid.id,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.userProfile.update({
    where: {
      userId: isTokenValid.id,
    },
    data: payload,
  });
  return result;
};

export const UserProfileServices = {
  getUserProfileFromDB,
  updateUserProfileIntoDB,
};
