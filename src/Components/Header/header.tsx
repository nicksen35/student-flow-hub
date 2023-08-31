import { FC } from "react"

type headerprop = {
    headerTitle: string
}

type searchbarprop = {
    placeholder: string
}


const Title:FC<headerprop> = (props) => {
    return <h1 className="headertitle"> {props.headerTitle} </h1>
}

const HamburgerMenu:FC = () => {
    return(
        <div className="hamburgermenucontainer"> 
        <div className="hamburgermenu"> </div>
        <div className="hamburgermenu"> </div>
        <div className="hamburgermenu"> </div>
        </div>
    )
}


const SearchBar:FC<searchbarprop> = (prop) => {

    return <input className="searchbar" placeholder={prop.placeholder} />
}
const HomeIcon:FC = () => {

    return (
        <img className="homeicon" src="src\assets\HomeIcon.png" alt="hello" />
    )
}


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
    )
    
    
}
export default Header