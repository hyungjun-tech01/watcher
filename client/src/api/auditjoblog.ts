import Paths from "../constants/Paths";
import {IAuditJobLogQueryCondi} from "../atoms/atomsAuditJobLog";
const BASE_PATH = Paths.BASE_PATH;

export async function  apiGetAuditJobLog(data:IAuditJobLogQueryCondi) {
    try{
        const response = await fetch(`${BASE_PATH}/getauditjob`,{
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
 };