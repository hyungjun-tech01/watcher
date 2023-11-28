import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { atomsAuditJobLogData, IAuditJobLog, IAuditJobLogQueryCondi } from '../../atoms/atomsAuditJobLog';
import { AuditRepository } from '../../repository/auditRepository';
import { useRecoilValue } from 'recoil';
import { convertToDataString } from '../../constants/DateFns';

interface IAuditLogTable {
  userName: string | null,
  detectValue: boolean,
  fromTime: number,
  toTime: number,
}
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

const AuditLogTable = ({userName, detectValue, fromTime, toTime}: IAuditLogTable) => {
  const [t] = useTranslation();
  const { queryAuditJobLog } = useRecoilValue(AuditRepository);
  const auditLogData = useRecoilValue(atomsAuditJobLogData);
  const [ rowData, setRowData ] = useState<IAuditLogRowData[]>([]);

  const queryLogData = useCallback(()=>{
    if(fromTime >= toTime) return;
    
    const queryInput : IAuditJobLogQueryCondi = {
      userName : userName ? userName : '',
      detectPrivacy : detectValue,
      sendTimeFrom : fromTime.toString(),
      sendTimeTo : toTime.toString(),
    };
    queryAuditJobLog(queryInput);
  }, [detectValue, fromTime, queryAuditJobLog, toTime, userName]);

  const setTableWithLogData = useCallback((logData:IAuditJobLog[])=> {
    const updatedRowData: IAuditLogRowData[] = logData.map((data:IAuditJobLog) => (
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
  }, [])

  const columns: GridColDef[] = [
    { field: 'imageArchivePath', headerName: t('common.image'), flex: 0.5, headerClassName: 'data-table-hearder' },
    { field: 'sendTime', headerName: t('common.workTime'), width: 150, headerClassName: 'data-table-hearder' },
    { field: 'userName',
      headerName: t('common.users'),
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 100,
      headerClassName: 'data-table-hearder'
    },
    { field: 'destination', headerName: t('common.destination'), width: 150, headerClassName: 'data-table-hearder' },
    { field: 'printerSerialNumber', headerName: t('common.printingDevice'), width: 100, headerClassName: 'data-table-hearder' },
    { field: 'copies', headerName: t('common.copies'), type: 'number', width: 50, headerClassName: 'data-table-hearder' },
    { field: 'originalPages', headerName: t('common.pages'), type: 'number', width: 50, headerClassName: 'data-table-hearder' },
    { field: 'detectPrivacy', headerName: t('common.detected'), type: 'boolean', width: 75, headerClassName: 'data-table-hearder' },
    { field: 'privacyText', headerName: t('common.detect_result'), flex: 1, headerClassName: 'data-table-hearder' },
  ];

  useEffect(() =>{
    // loadAllAuditJobLog();
    queryLogData();
  }, [userName, detectValue, toTime, fromTime, queryLogData]);

  useEffect(()=> {
    setTableWithLogData(auditLogData);
  }, [auditLogData, setTableWithLogData]);

  return (
    <Box sx={{ height: 400, width: '100%', '& .data-table-hearder': {
      backgroundColor: '#283f4f', color: '#fff',
    }, }}>
      <DataGrid
          rows={rowData}
          columns={columns}
          initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row?.jobLogId}
          sx={{ fontSize: 12 }}
      />
    </Box>
  );
}

export default AuditLogTable;