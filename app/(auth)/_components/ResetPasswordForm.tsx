"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { passwordStrength } from "check-password-strength";
import { error } from "console";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import PasswordStrength from "./password-strength";
import { resetpassword } from "@/lib/actions/auth";
import { toast } from "react-toastify";

interface Props {
  jwtUserId: string;
}

type InputType = z.infer<typeof FormSchema>;

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(52, "Password must be less than 52 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
  });

function ResetPasswordForm({ jwtUserId }: Props) {
  const router = useRouter();
  const [passStrength, setPassStrength] = useState<number>(0);
  const [isVisiblePass, setVisiblePass] = useState<boolean>(false);
  const toggleVisiblePass = () => setVisiblePass((prev) => !prev);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    setPassStrength(passwordStrength(watch().password).id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch().password]);

  const resetPass: SubmitHandler<InputType> = async (data) => {
    try {
        const result = await resetpassword(jwtUserId, data.password);
        if(result === "success") toast.success("Your password has been reset successfully") 
    } catch (error) {
        toast.error("Something went wrong!")
        console.error(error)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(resetPass)}
      className="flex flex-col gap-2 p-2 m-2 border rounded-md shadow"
    >
      <div className="text-center p-2">Reset Your Password</div>
      <Input
        label="Password"
        {...register("password")}
        type={isVisiblePass ? "text" : "password"}
        errorMessage={errors.password?.message}
        endContent={
          <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
            {isVisiblePass ? (
              <EyeSlashIcon className="w-4" />
            ) : (
              <EyeIcon className="w-4" />
            )}
          </button>
        }
      />
      <PasswordStrength passStrength={passStrength} />
      <Input
        label="Confirm Password"
        type={isVisiblePass ? "text" : "password"}
        {...register("confirmPassword")}
        errorMessage={errors.confirmPassword?.message}
      />
      <div className="flex justify-center">
        <Button
          color="primary"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? "Please Wait..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
