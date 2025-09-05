import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Header = () => {
  return (
    <header className="flex justify-between p-3 items-center">
      <Logo />
      <Link to={'/settings'}>
        <Settings width={30} height={30} />
      </Link>
    </header>
  )
}