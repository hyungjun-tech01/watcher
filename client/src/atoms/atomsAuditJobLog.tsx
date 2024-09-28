import React from 'react';
import { atom } from 'recoil';

export interface IAuditJobLog{
  jobLogId : number; 
  jobType : string;
  printerSerialNumber : string;  
  jobId : string; 
  userName : string; 
  destination : string; 
  sendTime : string; 
  fileName : string ; 
  finishTime : string ;
  copies : number; 
  originalPages : number; 
  detectPrivacy : boolean; 
  privacyText :string ; 
  imageArchivePath : string;
  textArchivePath : string; 
  originaJobId : string; 
}
export interface IAuditJobLogQueryCondi{
    userName : string; 
    detectPrivacy : boolean; 
    sendTimeFrom : string;
    sendTimeTo : string;
    privacyText : string; 
}



export const atomsAuditJobLogData = atom<IAuditJobLog[]>({
  key: 'auditJobLogData',
  default: []
})


export const atomsAuditPdfContent = atom<Blob | null>({
  key: 'auditJobPdfContent',
  default: null
})

export const atomsAuditTextContent = atom<string | null>({
  key: 'auditJobTextContent',
  default: null
})
