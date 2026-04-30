import { AuthForm } from "@/widgets";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

export const LoginPage = () => {
  useScrollToTop();

  return <AuthForm mode="login" />;
};
