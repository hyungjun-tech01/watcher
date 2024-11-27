import Paths from "../constants/Paths";
import {IValidateUser} from "../atoms/atomsUser";

const BASE_PATH = Paths.BASE_PATH;
 
export async function  apiLoginValidate(data:IValidateUser) {
    try{
        const response = await fetch(`${BASE_PATH}/login`,{
            method: "POST", 
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
           }); 
        const responseMessage = await response.json();
           return(responseMessage);
    }catch(err){
        console.error(err);
        return(err);
    }
 }

 export async function  apiPasswordChange(data:IValidateUser) {
    try{
        const response = await fetch(`${BASE_PATH}/passwordChange`,{
            method: "POST", 
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
           }); 
        const responseMessage = await response.json();
        console.log(responseMessage);
           return(responseMessage);
    }catch(err){
        console.error(err);
        return(err);
    }
 }