import logo from "@/assets/finance_helper_logo.png";

export const Logo = () => {
  return (
    <img
      src={logo}
      alt="Finance Helper logo"
      loading="lazy"
      className="w-auto h-auto max-w-full max-h-full object-contain"
    />
  );
};
