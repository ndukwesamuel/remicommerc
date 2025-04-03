import asyncWrapper from "../../middlewares/asyncWrapper.js";
import authService from "../../v1/services/auth.service.js";
import userModel from "../models/user.model.js";

export const register = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  const result = await authService.register(userData);
  res.status(201).json(result);
});

export const login = asyncWrapper(async (req, res, next) => {
  const userData = req.body;
  const result = await authService.login(userData);
  res.status(200).json(result);
});

export const getUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const result = await authService.getUser(userId);
  res.status(200).json(result);
});

export const sendOTP = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.sendOTP({ email });
  res.status(200).json(result);
});

export const verifyOTP = asyncWrapper(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP({ email, otp });
  res.status(200).json(result);
});

export const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.forgotPassword({ email });
  res.status(200).json(result);
});

export const resetPassword = asyncWrapper(async (req, res, next) => {
  const { email, otp, password } = req.body;
  const result = await authService.resetPassword({ email, otp, password });
  res.status(200).json(result);
});

export const updateUser = asyncWrapper(async (req, res, next) => {
  const { userId } = req.user;
  const { firstName, lastName, phoneNumber } = req.body;

  const updateData = {
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(phoneNumber && { phoneNumber }),
  };
  // const result = await authService.resetPassword({ email, otp, password });
  let data_id = userId?.user;
  const updatedUser = await userModel
    .findByIdAndUpdate(data_id, updateData, { new: true, runValidators: true })
    .select("-password -roles");
  res.status(200).json({
    result: updatedUser,

    // {
    //   userId,
    //   firstName,
    //   lastName,
    //   phoneNumber,
    // },
  });
});

// export default { register, login, getUser };
