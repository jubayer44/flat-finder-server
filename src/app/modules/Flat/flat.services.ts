import { Flat, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { TPagination } from "../../interfaces/TPagination";
import { flatSearchAbleFields } from "./flat.constant";
import { TFilterableFields } from "./flat.interface";

const addFlatIntoDB = async (payload: Flat, token: string) => {
  await isUserAuthorized(token);

  const result = await prisma.flat.create({
    data: payload,
  });

  return result;
};

const getAllFlatsFromDB = async (
  filters: TFilterableFields,
  options: TPagination
) => {
  const { searchTerm, ...restData } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;

  const andConditions: Prisma.FlatWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: flatSearchAbleFields?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(restData)?.length > 0) {
    andConditions.push({
      AND: Object.keys(restData).map((key) => ({
        [key]: Boolean(JSON.parse((restData as any)[key])),
      })),
    });
  }

  const condition: Prisma.FlatWhereInput = { AND: andConditions };
  // console.dir(condition, { depth: Infinity });

  const result = await prisma.flat.findMany({
    where: condition,
    skip: (page - 1) * limit,
    take: limit,
    orderBy:
      options?.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.flat.count({
    where: condition,
  });
  return {
    data: result,
    total,
    page,
    limit,
  };
};

const updateFlatIntoDB = async (
  payload: Partial<Flat>,
  id: string,
  token: string
) => {
  await isUserAuthorized(token);

  const flat = await prisma.flat.findUnique({
    where: {
      id,
    },
  });
  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  const result = await prisma.flat.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

export const FlatServices = {
  addFlatIntoDB,
  getAllFlatsFromDB,
  updateFlatIntoDB,
};
