import { selector } from 'recoil';
import { atomsRegExData, } from "../atoms/atomsRegEx";
import Paths from "../constants/Paths";
const BASE_PATH = Paths.BASE_PATH;


export const RegexRepository = selector({
    key: 'RegexRepository',
    get: ({getCallback}) => {
        const loadAllRegex = getCallback(({set}) => async () => {
            try{
                const response = await fetch(`${BASE_PATH}/getAllRegex`);
                const json = await response.json();
                if(json.message) {
                    console.log('loadAllRegex: ', json.message);
                } else {
                    set(atomsRegExData, json);
                }
            }catch(err){
                console.error(err);
                set(atomsRegExData, []);
            }
        });

        const modifyRegex = getCallback(({set, snapshot}) => async (newRegex) => {
            const input_json = JSON.stringify(newRegex);
            try{
                const response = await fetch(`${BASE_PATH}/modifyRegex`, {
                    method: "POST",
                    headers:{'Content-Type':'application/json'},
                    body: input_json,
                });
                const data = await response.json();
                loadAllRegex();

            }catch(err){
                console.error(err);
                set(atomsRegExData, []);
            }
        });

        return {
            loadAllRegex,
            modifyRegex
        };
    },
});