import logo from "@/assets/finance_helper_logo.png";

export const Logo = () => {
  return (
    <img
      src={logo}
      width={250}
      height={250}
      alt="Finance Helper logo"
      loading="lazy"
      className="object-contain"
    />
  );
};
