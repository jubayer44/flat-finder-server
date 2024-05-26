import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Token generated successfully",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const result = await AuthServices.changePassword(req?.user, req?.body);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Password changed successfully",
      data: result,
    });
  }
);

export const AuthControllers = {
  refreshToken,
  changePassword,
};
