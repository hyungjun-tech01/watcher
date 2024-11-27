 import {apiGetAuditJobLog} from "../api/auditjoblog";
 import React, {useEffect} from "react";
 ///// api 호출 sample code 
function SampleTest(){
    const getData = async()=>{
        const reqData = {userName:'test', detectPrivacy:true, sendTimeFrom:'20231120000000', sendTimeTo:'20231121000000', privacyText:'', currentUserName:''}
        const response = await apiGetAuditJobLog(reqData);
    
       }
    useEffect(()=>{
        getData();
    },[]);
       
    return(
        <div>
        </div>
    );
}
export default SampleTest;