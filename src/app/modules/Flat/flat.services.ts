import { Flat, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import { flatSearchAbleFields } from "../../constant";
import AppError from "../../errors/AppError";
import { TPagination } from "../../interfaces/TPagination";
import { TFlatFilterableFields } from "../../interfaces/common";

const addFlatIntoDB = async (payload: Flat, token: string) => {
  await isUserAuthorized(token);

  const result = await prisma.flat.create({
    data: payload,
  });

  return result;
};

const getAllFlatsFromDB = async (
  filters: TFlatFilterableFields,
  options: TPagination
) => {
  const { searchTerm, bedrooms, minPrice, maxPrice } = filters;

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

  if (bedrooms) {
    andConditions.push({
      OR: [
        {
          bedrooms: {
            lte: Number(bedrooms),
          },
        },
      ],
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      OR: [
        {
          rentAmount: {
            gte: Number(minPrice) || 0,
            lte: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
          },
        },
      ],
    });
  }

  const condition: Prisma.FlatWhereInput = { AND: andConditions };

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

const getMyAllFlatsFromDB = async (
  filters: TFlatFilterableFields,
  options: TPagination,
  token: string
) => {
  const { searchTerm, bedrooms, minPrice, maxPrice } = filters;

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

  if (bedrooms) {
    andConditions.push({
      OR: [
        {
          bedrooms: {
            lte: Number(bedrooms),
          },
        },
      ],
    });
  }

  if (minPrice || maxPrice) {
    andConditions.push({
      OR: [
        {
          rentAmount: {
            gte: Number(minPrice) || 0,
            lte: Number(maxPrice) || Number.MAX_SAFE_INTEGER,
          },
        },
      ],
    });
  }

  const validateUser = await isUserAuthorized(token);

  andConditions.push({
    postedBy: validateUser.id,
  });

  const condition: Prisma.FlatWhereInput = { AND: andConditions };

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
  getMyAllFlatsFromDB,
};
