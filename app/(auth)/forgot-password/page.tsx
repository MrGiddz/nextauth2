"use client";

import { forgotPassword } from "@/lib/actions/auth";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FromSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type InputType = z.infer<typeof FromSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FromSchema),
  });

  const submitRequest: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await forgotPassword(data.email);
      if (result) toast.success("Reset Password link was sent to your mail");
      reset();
    } catch (error) {
      
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center">
      <form
        className="flex flex-col gap-2 p-2 col-span-2 border m-2 rounded-md shadow"
        onSubmit={handleSubmit(submitRequest)}
      >
        <div className="p-2 text-center">Enter your email</div>
        <Input
          label="Email"
          {...register("email")}
          startContent={<EnvelopeIcon className="w-4" />}
          errorMessage={errors.email?.message}
        />
        <Button isLoading={isSubmitting} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please Wait..." : "Submit"}
        </Button>
      </form>

      <Image
        src="/forgotPass.jpg"
        alt="forgot password"
        width={500}
        height={500}
        className="place-self-center"
      />
    </div>
  );
};

export default ForgotPasswordPage;
