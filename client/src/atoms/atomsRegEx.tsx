import React from 'react';
import { atom } from 'recoil';

export interface IRegEx{
    regex_name : string; 
    regex_value : string;
    modify_user : string;  
}


export const atomsRegExData = atom<IRegEx[]>({
  key: 'regExData',
  default: []
})

