import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { atomsAuditJobLogData, IAuditJobLog } from '../../atoms/atomsAuditJobLog';
import { AuditRepository } from '../../repository/auditRepository';
import { useRecoilValue } from 'recoil';
import { convertToDataString } from '../../constants/DateFns';
import Paper from '@mui/material/Paper';

interface IAuditLogRowData {
  jobLogId: number,
  imageArchivePath: string,
  sendTime: string,
  userName: string,
  destination: string,
  printerSerialNumber: string,
  copies: number,
  originalPages: number,
  detectPrivacy: boolean,
  privacyText: string,
}

const AuditLogTable = () => {
  const [t] = useTranslation();
  const { loadAllAuditJobLog } = useRecoilValue(AuditRepository);
  const auditLogData = useRecoilValue(atomsAuditJobLogData);
  const [ rowData, setRowData ] = useState<IAuditLogRowData[]>([]);

  const columns: GridColDef[] = [
    { field: 'imageArchivePath', headerName: t('common.image'), width: 125 },
    { field: 'sendTime', headerName: t('common.workTime'), width: 150 },
    { field: 'userName',
      headerName: t('common.users'),
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 75,
    },
    { field: 'destination', headerName: t('common.destination'), width: 150 },
    { field: 'printerSerialNumber', headerName: t('common.printingDevice'), width: 100 },
    { field: 'copies', headerName: t('common.copies'), type: 'number', width: 50 },
    { field: 'originalPages', headerName: t('common.pages'), type: 'number', width: 50 },
    { field: 'detectPrivacy', headerName: t('common.detected'), type: 'boolean', width: 75 },
    { field: 'privacyText', headerName: t('common.detect_result'), width: 250 },
  ];

  useEffect(() =>{
    loadAllAuditJobLog();
    const updatedRowData: IAuditLogRowData[] = auditLogData.map((data:IAuditJobLog) => (
      {
        jobLogId: data.jobLogId,
        imageArchivePath: data.imageArchivePath,
        sendTime: convertToDataString(data.sendTime),
        userName: data.userName,
        destination: data.destination,
        printerSerialNumber: data.printerSerialNumber,
        copies: data.copies,
        originalPages: data.originalPages,
        detectPrivacy: data.detectPrivacy,
        privacyText: data.privacyText,
      }
    ));
    setRowData(updatedRowData);
  }, [auditLogData, loadAllAuditJobLog, setRowData]);

  return (
    <Paper elevation={3} sx={{ m : 2, minHeight: 400 }}>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rowData}
            columns={columns}
            initialState={{
              pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            getRowId={(row) => row?.jobLogId}
            sx={{ fontSize: 10 }}
        />
      </div>
    </Paper>
  );
}

export default AuditLogTable;