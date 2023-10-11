import { NavLink } from "react-router-dom";
import LogoIgnite from "../../assets/logo.ignite.svg";
import { Timer, Scroll } from "phosphor-react";
import { HeaderContainer } from "./style";

export default function Header() {
  return (
    <HeaderContainer>
      <img src={LogoIgnite} alt="" />
      <nav>
        <NavLink to={"/"} title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to={"/history"} title="History">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
