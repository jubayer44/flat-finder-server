import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import AppError from "../app/errors/AppError";
import config from "../config";
import { jwtHelpers } from "../helper/jwtHelpers";

const isUserAuthorized = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  const validUser = jwtHelpers.verifyToken(
    token,
    config.jwt.JWT_SECRET as Secret
  );

  if (!validUser) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }
  return validUser;
};

export default isUserAuthorized;
