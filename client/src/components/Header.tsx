import {useCookies} from "react-cookie";
// import {useNavigate} from "react-router-dom";
// import Path from "../constants/Paths";
import ButtonAppBar from "./ButtonAppBar";

function Header(){
    const [cookies, setCookie, removeCookie] = useCookies(['UserId','UserName', 'AuthToken']);
    // const navigate = useNavigate();

    // if(cookies.AuthToken === undefined || cookies.AuthToken === "" || cookies.AuthToken === null){
    //     removeCookie('UserId');
    //     removeCookie('UserName');
    //     removeCookie('AuthToken');
    //     navigate(Path.LOGIN);
    // }
    
    return (
        <>
            <ButtonAppBar/>
        </>
    );
}
export default Header;