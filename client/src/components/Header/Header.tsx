import {useCookies} from "react-cookie";
// import {useNavigate} from "react-router-dom";
// import Path from "../constants/Paths";
import ButtonAppBar from "./ButtonAppBar";

interface IHeader{
    path:string;
}
function Header({path}:IHeader){
    //const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
    // const navigate = useNavigate();

    // if(cookies.AuthToken === undefined || cookies.AuthToken === "" || cookies.AuthToken === null){
    //     removeCookie('UserId');
    //     removeCookie('UserName');
    //     removeCookie('AuthToken');
    //     navigate(Path.LOGIN);
    // }
    
    return (
        <>
            <ButtonAppBar path={path}/>
        </>
    );
}
export default Header;