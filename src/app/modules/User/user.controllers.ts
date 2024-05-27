import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pickFunction from "../../../shared/pickFunction";
import sendResponse from "../../../shared/sendResponse";
import { filterOptions, userFilterAbleFields } from "../../constant";
import { UserServices } from "./user.services";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filtersField = pickFunction(req?.query, userFilterAbleFields);
  const options = pickFunction(req?.query, filterOptions);
  const token = req.headers.authorization || "";

  const result = await UserServices.getAllUsersFromDB(
    filtersField,
    options,
    token
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await UserServices.updateUserIntoDB(token, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
};
