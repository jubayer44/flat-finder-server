import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import isUserAuthorized from "../../../shared/isUserAuthorized";
import prisma from "../../../shared/prisma";
import { userSearchAbleFields } from "../../constant";
import AppError from "../../errors/AppError";
import { TPagination } from "../../interfaces/TPagination";
import { TUserFilterableFields } from "../../interfaces/common";

type TData = User;

const createUserIntoDB = async (data: TData) => {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${data.email} is already exists`
    );
  }

  const userData = {
    username: data.username,
    email: data.email,
    password: hashedPassword,
    role: UserRole.USER,
    status: UserStatus.ACTIVATE,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  return {
    id: result.id,
    username: result.username,
    email: result.email,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
};

const getAllUsersFromDB = async (
  filters: TUserFilterableFields,
  options: TPagination,
  token: string
) => {
  const { searchTerm } = filters;

  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 5;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields?.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  await isUserAuthorized(token);

  const condition: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: condition,
    select: {
      id: true,
      username: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
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

  const total = await prisma.user.count({
    where: condition,
  });
  return {
    data: result,
    total,
    page,
    limit,
  };
};

const updateUserIntoDB = async (
  token: string,
  payload: { username?: string; email?: string }
) => {
  const validUser = await isUserAuthorized(token);

  const result = await prisma.user.update({
    where: {
      id: validUser.id,
    },
    data: payload,
  });

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  updateUserIntoDB,
};
