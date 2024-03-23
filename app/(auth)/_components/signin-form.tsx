"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface SignInProps {
  callbackUrl?: string;
}

const FormSchema = z.object({
  email: z.string().email("Please enter your email address"),
  password: z.string({
    required_error: "Please enter your password",
  }),
});

type InputType = z.infer<typeof FormSchema>;

const SignInForm = ({ callbackUrl }: SignInProps) => {
  const router = useRouter();
  const [showPass, setShowPass] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      username: data.email,
      password: data.password,
    });

    if (!res?.ok) {
      toast.error(res?.error);
      return;
    }
    toast.success("Welcome");

    router.push(callbackUrl ? callbackUrl : "/");
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 border w-full rounded"
    >
      <div className="text-center bg-gradient-to-b from-white to-slate-200  dark:from-slate-700 dar:to-slate-900 p-2">
        Sign In Form
      </div>
      <div className="p-2 flex flex-col gap-4">
        <Input
          label="Email"
          {...register("email")}
          errorMessage={errors.email?.message}
        />
        <Input
          label="Password"
          {...register("password")}
          type={showPass ? "text" : "password"}
          errorMessage={errors.password?.message}
          endContent={
            <button type="button" onClick={() => setShowPass((prev) => !prev)}>
              {showPass ? (
                <EyeSlashIcon className="w-4" />
              ) : (
                <EyeIcon className="w-4" />
              )}
            </button>
          }
        />
        <div className="flex items-center justify-center gap-4">
          <Button
            color="primary"
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Signing In" : "Sign In"}
          </Button>
          <Button as={Link} href="/signup">
            Sign Up
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
