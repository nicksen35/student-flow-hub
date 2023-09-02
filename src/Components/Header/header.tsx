import { FC } from "react";
import { useState } from "react";

type headerprop = {
  headerTitle: string;
};

type searchbarprop = {
  placeholder: string;
};
const Title: FC<headerprop> = (props) => {
  return (
    <>
      <h1 className="headertitle"> {props.headerTitle} </h1>
    </>
  );
};

const HamburgerMenu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div
      className={`hamburgermenucontainer ${isOpen ? "open" : ""}`}
      onClick={toggleMenu}
    >
      <div className="hamburgermenu1"> </div>
      <div className="hamburgermenu2"> </div>
      <div className="hamburgermenu3"> </div>
    </div>
  );
};

const SearchBar: FC<searchbarprop> = (prop) => {
  return <input className="searchbar" placeholder={prop.placeholder} />;
};
const HomeIcon: FC = () => {
  return <img className="homeicon" src="src\assets\HomeIcon.png" alt="hello" />;
};

const Header = () => {
  return (
    <div className="headercontainer">
      <li className="headerelementscontainer">
        <HamburgerMenu />
        <HomeIcon />
        <Title headerTitle="StudentFlow Hub" />
        <SearchBar placeholder="Search Here" />
      </li>
    </div>
  );
};
export default Header;
