import { selector } from 'recoil';
import { atomsSecurityGroupData, atomsSecurityGroupAdminData,
        atomsSecurityGroupDeptData, ISecuQueryCondi , atomsUserData, atomsDeptData} from "../atoms/atomsSecurityGroup";
import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const SecurityGroupRepository = selector({
    key: 'SecurityGroupRepository',
    get: ({getCallback}) => {
        const loadSecurityGroup = getCallback(({set}) => async (data:ISecuQueryCondi) => {
            try{
                const response = await fetch(`${BASE_PATH}/getSecurityGroup`,{
                    method: "POST", 
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(data)
                   }); 
                const json = await response.json();
                if(json.message) {
                    console.log('loadSecurityGroup: ', json.message);
                } else {
                    set(atomsSecurityGroupData, json);
                }
            }catch(err){
                console.error(err);
                set(atomsSecurityGroupData, []);
            }
        });

        const modifySecurityGroup = getCallback(({set, snapshot}) => async (newSecurityGroup) => {
            const input_json = JSON.stringify(newSecurityGroup);
            try{
                const response = await fetch(`${BASE_PATH}/modifySecurityGroup`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                //loadAllRegex();  =>  로직 바깥에서 불러 줘야 함.
                return(data);
            }catch(err){
                console.error(err);
                return(err);
               // set(atomsRegExData, []);
            }
        });

        const loadSecurityGroupAdmin = getCallback(({set}) => async (data:ISecuQueryCondi) => {
            try{
                const response = await fetch(`${BASE_PATH}/getSecurityGroupAdmin`,{
                    method: "POST", 
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(data)
                   }); 
                const json = await response.json();
                if(json.message) {
                    console.log('loadSecurityGroupAdmin: ', json.message);
                } else {
                    set(atomsSecurityGroupAdminData, json);
                }
            }catch(err){
                console.error(err);
                set(atomsSecurityGroupAdminData, []);
            }
        });

        const loadSecurityGroupDept = getCallback(({set}) => async (data:ISecuQueryCondi) => {
            try{
                const response = await fetch(`${BASE_PATH}/getSecurityGroupDept`,{
                    method: "POST", 
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify(data)
                   }); 
                const json = await response.json();
                if(json.message) {
                    console.log('loadSecurityGroupDept: ', json.message);
                } else {
                    set(atomsSecurityGroupDeptData, json);
                }
            }catch(err){
                console.error(err);
                set(atomsSecurityGroupDeptData, []);
            }
        });

        const modifySecurityGroupDept = getCallback(({set, snapshot}) => async (newSecurityGroup) => {
            const input_json = JSON.stringify(newSecurityGroup);
            try{
                const response = await fetch(`${BASE_PATH}/modifySecurityGroupDept`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                //loadAllRegex();  =>  로직 바깥에서 불러 줘야 함.
                return(data);
            }catch(err){
                console.error(err);
                return(err);
               // set(atomsRegExData, []);
            }
        });   
        
        const loadAllUser4Security = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/getUsers`,{
                    method: "POST", 
                    headers:{'Content-Type':'application/json'},
                   }); 
                const json = await response.json();
                if(json.message) {
                    console.log('loadAllUser4Security: ', json.message);
                } else {
                    set(atomsUserData, json);
                }
            }catch(err){
                console.error(err);
                set(atomsUserData, []);
            }
        });     
        
        const loadAllDept4Security = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/getDepts`,{
                    method: "POST", 
                    headers:{'Content-Type':'application/json'},
                   }); 
                const json = await response.json();
                if(json.message) {
                    console.log('loadAllDept4Security: ', json.message);
                } else {
                    set(atomsDeptData, json);
                }
            }catch(err){
                console.error(err);
                set(atomsDeptData, []);
            }
        });   

        const modifySecurityGroupAdmin = getCallback(({set, snapshot}) => async (newSecurityGroup) => {
            const input_json = JSON.stringify(newSecurityGroup);
            try{
                const response = await fetch(`${BASE_PATH}/modifySecurityGroupAdmin`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                return(data);
            }catch(err){
                console.error(err);
                return(err);
               // set(atomsRegExData, []);
            }
        });   

        return {
            loadSecurityGroup,
            loadSecurityGroupAdmin,
            loadSecurityGroupDept,
            modifySecurityGroup,
            modifySecurityGroupDept,
            loadAllUser4Security,
            modifySecurityGroupAdmin,
            loadAllDept4Security,
        };
    },
});