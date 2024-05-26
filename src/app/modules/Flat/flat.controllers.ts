import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { FlatServices } from "./flat.services";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import pickFunction from "../../../shared/pickFunction";
import { filterOptions, flatFilterAbleFields } from "./flat.constant";

const addFlat = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  const result = await FlatServices.addFlatIntoDB(req.body, token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Flat added successfully",
    data: result,
  });
});

const getAllFlats = catchAsync(async (req: Request, res: Response) => {
  const filtersField = pickFunction(req?.query, flatFilterAbleFields);
  const options = pickFunction(req?.query, filterOptions);

  const result = await FlatServices.getAllFlatsFromDB(filtersField, options);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flats retrieved successfully",
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
    data: result.data,
  });
});

const updateFlat = catchAsync(async (req: Request, res: Response) => {
  const { flatId } = req.params;
  const token = req.headers.authorization || "";

  const result = await FlatServices.updateFlatIntoDB(req.body, flatId, token);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Flat information updated successfully",
    data: result,
  });
});

export const FlatControllers = {
  addFlat,
  getAllFlats,
  updateFlat,
};
