import express from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { FlatRoutes } from "../modules/Flat/flat.routes";
import { BookingRoutes } from "../modules/Booking/booking.routes";
import { UserProfileRoutes } from "../modules/UserProfile/userProfile.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: UserRoutes,
  },
  {
    path: "/flats",
    route: FlatRoutes,
  },
  {
    path: "/",
    route: BookingRoutes,
  },
  {
    path: "/profile",
    route: UserProfileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
