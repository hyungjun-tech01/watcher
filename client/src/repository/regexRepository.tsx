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
       

        return {
            loadAllRegex
        };
    },
});