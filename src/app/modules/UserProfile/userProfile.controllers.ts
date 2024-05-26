import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserProfileServices } from "./userProfile.services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await UserProfileServices.getUserProfileFromDB(token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await UserProfileServices.updateUserProfileIntoDB(
    req.body,
    token
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

export const UserProfileControllers = {
  getUserProfile,
  updateUserProfile,
};
