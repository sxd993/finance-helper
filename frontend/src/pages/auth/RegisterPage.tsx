import { AuthForm } from "@/widgets";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

export const RegisterPage = () => {
  useScrollToTop();

  return <AuthForm mode="register" />;
};
