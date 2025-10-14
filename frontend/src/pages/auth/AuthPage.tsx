import { AuthForm } from "@/widgets";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

export const AuthPage = () => {
  useScrollToTop();
  return (
    <>
      <AuthForm />
    </>
  );
};
