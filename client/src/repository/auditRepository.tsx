import { selector } from 'recoil';
import { atomsAuditJobLogData, IAuditJobLogQueryCondi, atomsAuditPdfContent, atomsAuditTextContent } from "../atoms/atomsAuditJobLog";
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

        const queryPdfJobLog = getCallback(({set}) => async (jobLogId:number) => {
            const data = {jobLogId:jobLogId};
            try{
                const response = await fetch(`${BASE_PATH}/getPdf`,{
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

        const queryPdfContent  = getCallback(({set}) => async (filepath:string) => {
            const data = {filepath:filepath};
            try{
                const response = await fetch(`${BASE_PATH}/decryptoFile`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });
                  
                  if (!response.ok) {
                    throw new Error('PDF 파일을 가져오는 데 실패했습니다.');
                  }
                  
                  const blob = await response.blob();
                  set(atomsAuditPdfContent, blob); // Blob을 직접 상태에 저장
                  console.log("ok");
            }catch(err){
                console.error(err);
            }

        });

        const queryTextContent  = getCallback(({set}) => async (filepath:string) => {
            const data = {filepath:filepath};
            //const data = {filepath:"ImageLog\\2023\\09\\C2K0910023024050914190.etxt"};
            try{
                const response = await fetch(`${BASE_PATH}/decryptoFile`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });
                  
                  if (!response.ok) {
                    throw new Error('Text 파일을 가져오는 데 실패했습니다.');
                  }
                  
                  const contentText = await response.text();
                  set(atomsAuditTextContent, contentText); // Text 직접 상태에 저장
                  console.log("ok");
            }catch(err){
                console.error(err);
            }

        });        
        
        
        return {
            loadAllAuditJobLog,
            queryAuditJobLog,
            queryPdfJobLog,
            queryPdfContent,
            queryTextContent
        };
    },
});