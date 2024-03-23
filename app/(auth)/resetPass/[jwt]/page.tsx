import { verifyJwt } from "@/lib/jwt";
import ResetPasswordForm from "../../_components/ResetPasswordForm";

interface ResetPasswordPageProps {
  params: {
    jwt: string;
  };
}

const ResetPasswordPage = ({ params }: ResetPasswordPageProps) => {
    const payload = verifyJwt(params.jwt);

    if(!payload) {
        return <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
            The URL is Invalid.
        </div>
    }
  return (
    <div className="flex justify-center">
      <ResetPasswordForm jwtUserId={params.jwt} />
    </div>
  );
};

export default ResetPasswordPage;
