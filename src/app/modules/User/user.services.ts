import { User, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helper/jwtHelpers";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";

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

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVATE,
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

  const accessToken = jwtHelpers.createToken(
    {
      email: userData.email,
      id: userData.id,
      role: userData.role,
    },
    config.jwt.JWT_SECRET as Secret,
    config.jwt.JWT_EXPIRES_IN as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      email: userData.email,
      id: userData.id,
      role: userData.role,
    },
    config.jwt.REFRESH_SECRET as Secret,
    config.jwt.REFRESH_EXPIRES_IN as string
  );

  return {
    user: {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      accessToken,
    },
    refreshToken,
  };
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
};
