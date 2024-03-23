import Link from "next/link";
import SignInForm from "../_components/signin-form";

interface SignInProps {
  searchParams: {
    callbackUrl?: string;
  };
}

const SignIn = ({ searchParams }: SignInProps) => {
  console.log({ searchParams });
  return (
    <div className="flex items-center justify-center flex-col max-w-[900px] m-auto">
      <SignInForm callbackUrl={searchParams.callbackUrl} />
      <Link href={"/forgot-password"}>Forgot your password</Link>
    </div>
  );
};

export default SignIn;
