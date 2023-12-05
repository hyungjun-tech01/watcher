import * as React from 'react';
import i18n from "../../i18n";
import { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { atomsAuditJobLogData, IAuditJobLog, IAuditJobLogQueryCondi } from '../../atoms/atomsAuditJobLog';
import { AuditRepository } from '../../repository/auditRepository';
import { useRecoilValue } from 'recoil';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { ReactComponent as NoImage } from '../../image/noun-no-image.svg';

interface IAuditLogTable {
  userName: string | null,
  detectValue: boolean,
  fromTime: number,
  toTime: number,
};
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
};

const AuditLogTable = ({userName, detectValue, fromTime, toTime}: IAuditLogTable) => {
  const [t] = useTranslation();
  const { queryAuditJobLog } = useRecoilValue(AuditRepository);
  const auditLogData = useRecoilValue(atomsAuditJobLogData);
  const [rowData, setRowData] = useState<IAuditLogRowData[]>([]);
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const [imagePath, setImagePath] = useState<string>("");

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
        sendTime:data.sendTime,
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
  }, []);

  const convToDate = useCallback((props: GridRenderCellParams<any, string>) => {
    const { value } = props;
    if(value) {
      const year = Number('20' + value.slice(0, 2));
      const month = Number(value.slice(2, 4));
      const day = Number(value.slice(4, 6));
      const hour = Number(value.slice(6, 8));
      const minute = Number(value.slice(8, 10));
      const second = Number(value.slice(10));
  
      // Create a Date object using the extracted values
      const date = new Date(year, month - 1, day, hour, minute, second);
  
      // Format the date as 'MMM DD, YYYY, h:mm:ss A'
      const localeString = i18n.resolvedLanguage === 'ko' ? 'ko-KR' : 'en-US';
      const dateString = date.toLocaleString(localeString, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
      });
      const timeString = date.toLocaleString(localeString, {
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
      });
      return (
        <div style={{display:'block'}}>
          <div>{dateString}</div>
          <div>{timeString}</div>
        </div>
      );
    }
    return "";
  }, []);

  const linkImage =  useCallback((props: GridRenderCellParams<any, string>) => {
    const { value } = props;

    console.log('linkImage', value);
    
    if(value) {
      const found_idx = value.lastIndexOf('.');
      if(found_idx !== -1){
        const thumbnail_src = value?.slice(0, found_idx) + '_thumbnail.png';
        const replace_thumbnail_src = thumbnail_src.replace(/\\/g,'/');
        const fileExt = value.slice(found_idx + 1).toLowerCase();
        const isThisPdf = fileExt === 'pdf';
        return (
          <div style={{alignItems:'center', textAlign: 'center'}} onClick={()=>{
            if(isThisPdf) {
              console.log('Open pdf !!!');
              window.open(value);
            } else {
              console.log('Show image !!!');
              setImagePath(value);
              handleOpen();
            }}}
          >
            <img width="94px" height="94px" src={replace_thumbnail_src} alt='' />
          </div>
        );
      };
    }else{
      <div>
        <NoImage />
      </div>
    };
    return "";
  }, [handleOpen]);

  const columns: GridColDef[] = [
    { field: 'imageArchivePath',
      headerName: t('common.image'),
      width: 120,
      headerClassName: 'data-table-hearder',
      renderCell: linkImage,
    },
    { field: 'sendTime',
      headerName: t('common.workTime'),
      width: 120,
      headerClassName: 'data-table-hearder',
      renderCell: convToDate,
    },
    { field: 'userName',
      headerName: t('common.users'),
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 100,
      headerClassName: 'data-table-hearder'
    },
    { field: 'destination', headerName: t('common.destination'), width: 150, headerClassName: 'data-table-hearder' },
    { field: 'printerSerialNumber', headerName: t('common.printingDevice'), width: 120, headerClassName: 'data-table-hearder' },
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
    <>
      <Box sx={{ height: 600, width: '100%', '& .data-table-hearder': {
        backgroundColor: '#283f4f', color: '#fff',
      }}}>
        <DataGrid
            rows={rowData}
            columns={columns}
            rowHeight={ 100 }
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        {/* <Box sx={{ position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4, }}>
          {imagePath}
        </Box> */}
        <img src={imagePath} alt=''/>
      </Modal>
  </>
  );
};

export default AuditLogTable;