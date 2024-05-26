import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helper/jwtHelpers";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";

type TData = User & {
  bio?: string;
  profession: string;
  address?: string;
};

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
    name: data.name,
    email: data.email,
    password: hashedPassword,
  };

  const userProfileData = {
    bio: data?.bio,
    profession: data?.profession,
    address: data?.address,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    const userCreatedData = await transactionClient.user.create({
      data: userData,
    });

    await transactionClient.userProfile.create({
      data: {
        ...userProfileData,
        userId: userCreatedData.id,
      },
    });

    return userCreatedData;
  });
  return {
    id: result.id,
    name: result.name,
    email: result.email,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your password is invalid");
  }

  const token = jwtHelpers.createToken(
    { email: userData.email, id: userData.id },
    config.jwt.JWT_SECRET as Secret,
    config.jwt.JWT_EXPIRES_IN as string
  );

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    token,
  };
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
};
