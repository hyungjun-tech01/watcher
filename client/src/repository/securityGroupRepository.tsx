import { selector } from 'recoil';
import { atomsSecurityGroupData, atomsSecurityGroupAdminData,atomsSecurityGroupDeptData, ISecuQueryCondi } from "../atoms/atomsSecurityGroup";
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
                console.log('loadSecurityGroupDept', data);
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

        return {
            loadSecurityGroup,
            loadSecurityGroupAdmin,
            loadSecurityGroupDept,
        };
    },
});