import { selector } from 'recoil';
import { IValidateUser } from '../atoms/atomsUser';
// import Paths from "../constants/Paths";
// const BASE_PATH = Paths.BASE_PATH;

export const UserRepository = selector({
    key: 'AuditRepo',
    get: ({getCallback}) => {
        const validateUser = getCallback(({set}) => async (data:IValidateUser) => {
            console.log("Test");
        });
        return {
            validateUser
        };
    },
});