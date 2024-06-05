import { selector } from 'recoil';
import { atomsAuditJobLogData, IAuditJobLogQueryCondi } from "../atoms/atomsAuditJobLog";
import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;

export const AuditRepository = selector({
    key: 'AuditRepository',
    get: ({getCallback}) => {
        const loadAllAuditJobLog = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/getAllAuditJob`);
                const json = await response.json();
                if(json.message) {
                    console.log('loadAuditJobLog: ', json.message);
                } else {
                    set(atomsAuditJobLogData, json);
                }
            }catch(err){
                console.error(err);
                set(atomsAuditJobLogData, []);
            }
        });
        const queryAuditJobLog = getCallback(({set}) => async (data:IAuditJobLogQueryCondi) => {
            try{
                const response = await fetch(`${BASE_PATH}/getauditjob`,{
                    method: "POST", 
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(data)
                   }); 
                const json = await response.json();
                if(json.message) {
                    console.log('loadAuditJobLog: ', json.message);
                } else {
                    set(atomsAuditJobLogData, json);
                }
            }catch(err){
                console.error(err);
            }
        });

        
        return {
            loadAllAuditJobLog,
            queryAuditJobLog
        };
    },
});