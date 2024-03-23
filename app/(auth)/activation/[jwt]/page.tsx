import { activateUser } from "@/lib/actions/auth";

interface ActivationProps {
  params: {
    jwt: string;
  };
}
const ActivationPage = async ({ params }: ActivationProps) => {
  const result = await activateUser(params.jwt);
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {result === "userNotExist" && (
        <p className="text-red-500 text-2xl">The user does not exist</p>
      )}
      {result === "alreadyActivated" && (
        <p className="text-red-500 text-2xl">The user is already activated</p>
      )}
      {result === "success" && (
        <p className="text-green-500 text-2xl">The user is activated</p>
      )}
      {(result !== "success" && result !== "alreadyActivated" && result !== "userNotExist") && (
        <p className="text-yellow-500 text-2xl">Oops!! Something went wrong</p>
      )}
    </div>
  );
};

export default ActivationPage;
