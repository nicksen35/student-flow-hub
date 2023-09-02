import { FC } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type headerprop = {
  headerTitle: string;
  onClick: () => void;
};

type searchbarprop = {
  placeholder: string;
};
type onclickprop = {
  onClick: () => void;
}
const Title: FC<headerprop> = (props) => {
  return (
    <>
      <h1 className="headertitle" onClick={props.onClick}> {props.headerTitle} </h1>
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
const HomeIcon: FC<onclickprop> = (prop) => {
  return <img className="homeicon" src="src\assets\HomeIcon.png" alt="hello" onClick={prop.onClick}/>;
};

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="headercontainer">
      <li className="headerelementscontainer">
        <HamburgerMenu />
        <HomeIcon onClick={() => navigate('/dashboard')}/>
        <Title onClick={ () => navigate('/dashboard')} headerTitle="StudentFlow Hub" />
        <SearchBar placeholder="Search Here" />
      </li>
    </div>
  );
};
export default Header;
