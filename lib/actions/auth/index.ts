"use server";

import { signJwt, verifyJwt } from "@/lib/jwt";
import {
  compileActivationTemplate,
  compileForgotPasswordTemplate,
  sendMail,
} from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { Auth2User } from "@prisma/client";
import * as bcrypt from "bcrypt";

export async function registerUser(
  user: Omit<Auth2User, "id" | "emailVerified" | "image">
) {
  const result = await prisma.auth2User.create({
    data: { ...user, password: await bcrypt.hash(user.password, 10) },
  });

  const jwtUserId = signJwt({
    id: result.id,
  });
  const activationUrl = `${process.env.NEXTAUTH_URL}/activation/${jwtUserId}`;
  const body = compileActivationTemplate(user.firstName, activationUrl);
  await sendMail({
    to: user.email,
    subject: "Activate your account",
    body,
  });
}

type ActivateUserProp = (
  jwtUserId: string
) => Promise<"userNotExist" | "alreadyActivated" | "success">;

export const activateUser: ActivateUserProp = async (jwtUserId) => {
  const payload = verifyJwt(jwtUserId);
  const userId = payload?.id;
  const user = await prisma.auth2User.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExist";
  if (user.emailVerified) return "alreadyActivated";

  const result = await prisma.auth2User.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });
  return "success";
};

export async function forgotPassword(email: string) {
  const user = await prisma.auth2User.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new Error("The User does not exist");

  const jwtUserId = signJwt({
    id: user.id,
  });

  const resetPassUrl = `${process.env.NEXTAUTH_URL}/resetPass/${jwtUserId}`;
  const body = compileForgotPasswordTemplate(user.firstName, resetPassUrl);
  const sendResult = await sendMail({
    to: user.email,
    subject: "Reset Password",
    body,
  });
  return sendResult;
}

type ResetPasswordFunc = (
  jwtUserId: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const resetpassword: ResetPasswordFunc = async (jwtuserId, password) => {
  const payload = verifyJwt(jwtuserId);
  if (!payload) return "userNotExist";
  const userId = payload.id;
  const user = await prisma.auth2User.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return "userNotExist";
  const result = await prisma.auth2User.update({
    where: {
      id: userId,
    },
    data: {
      password: await bcrypt.hash(password, 10),
    },
  });

  if (result) return "success";
  else throw new Error("Something went wrong");
};
