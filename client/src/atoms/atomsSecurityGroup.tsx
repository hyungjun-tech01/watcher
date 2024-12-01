import React from 'react';
import { atom } from 'recoil';

export interface ISecurityGroup{
    security_group_id : string; 
    security_group_name : string;
    security_group_memo : string;  
}

export interface ISecurityGroupAdmin{
    security_group_admin_id : string; 
    security_group_admin_name : string;
    security_group_admin_start_date : string;  
    security_group_admin_end_date : string;  
    security_group_name : string;
    user_name : string;
    full_name : string;
    department : string;
}

export interface ISecuQueryCondi{
    username : string|null; 
    security_group_name : string|null;
}

export const atomsSecurityGroupData = atom<ISecurityGroup[]>({
  key: 'regSecurityGroupData',
  default: []
});

export const atomsSecurityGroupAdminData = atom<ISecurityGroupAdmin[]>({
    key: 'regSecurityGroupAdminData',
    default: []
});

