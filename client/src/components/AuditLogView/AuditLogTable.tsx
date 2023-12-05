import * as React from 'react';
import i18n from "../../i18n";
import { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Modal } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { atomsAuditJobLogData, IAuditJobLog, IAuditJobLogQueryCondi } from '../../atoms/atomsAuditJobLog';
import { AuditRepository } from '../../repository/auditRepository';
import { useRecoilValue } from 'recoil';

interface IAuditLogTable {
  userName: string | null,
  detectValue: boolean,
  fromTime: number,
  toTime: number,
};
interface IAuditLogRowData {
  jobLogId: number,
  imageArchivePath: string,
  textArchivePath: string,
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
  const [itemPath, setItemPath] = useState<string>("");
  const [isImage, setIsImage] = useState(false);
  const [textContent, setTextContent] = useState<string>("");

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
        textArchivePath: data.textArchivePath,
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

  const getTextInTextPath = useCallback(async (path:string) => {
    try{
      const replace_path = path.replace(/\\/g,'/');
      const response =  await fetch(`${replace_path}`);
      const text = response.text();
      text.then((data)=> {
        setTextContent(data);
        handleOpen();
      })
    }
    catch(error) {
      console.log('Fail to get Text from file in server');
      setTextContent("");
    }
  }, [handleOpen]);

  const renderImageCell =  useCallback((props: GridRenderCellParams<any, string>) => {
    const { value } = props;
    
    if(value && value !=="") {
      const found_idx = value.lastIndexOf('.');
      if(found_idx !== -1){
        const thumbnail_src = value?.slice(0, found_idx) + '_thumbnail.png';
        const replace_thumbnail_src = thumbnail_src.replace(/\\/g,'/');
        const fileExt = value.slice(found_idx + 1).toLowerCase();
        const isThisPdf = fileExt === 'pdf';
        return (
          <div style={{alignItems:'center', textAlign: 'center', cursor:'pointer'}} onClick={()=>{
            if(isThisPdf) {
              console.log('Open pdf !!!');
              window.open(value);
            } else {
              console.log('Show image !!!');
              setIsImage(true);
              setItemPath(value);
              handleOpen();
            }}}
          >
            <img width="94px" height="94px" src={replace_thumbnail_src} alt='' />
          </div>
        );
      };
    };
    return "";
  }, [handleOpen]);

  const renderSendTimeCell =  useCallback((props: GridRenderCellParams<any, {sendTime:string, textPath:string}>) => {
    const { value } = props;
    if(value && value.sendTime && value.sendTime !=="") {
      const year = Number('20' + value.sendTime.slice(0, 2));
      const month = Number(value.sendTime.slice(2, 4));
      const day = Number(value.sendTime.slice(4, 6));
      const hour = Number(value.sendTime.slice(6, 8));
      const minute = Number(value.sendTime.slice(8, 10));
      const second = Number(value.sendTime.slice(10));
  
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
        <div style={{display:'block', cursor:'pointer'}} onClick={()=>{
            if(value.textPath && value.textPath !== "") {
              console.log('Open text !!!');
              setIsImage(false);
              getTextInTextPath(value.textPath);
            }
          }}>
          <div>{dateString}</div>
          <div>{timeString}</div>
        </div>
      );
    };
    return "";
  }, [getTextInTextPath]);

  const columns: GridColDef[] = [
    { field: 'imageArchivePath',
      headerName: t('common.image'),
      width: 120,
      headerClassName: 'data-table-hearder',
      renderCell: renderImageCell,
    },
    { field: 'sendTime',
      headerName: t('common.workTime'),
      width: 120,
      headerClassName: 'data-table-hearder',
      valueGetter: (params: GridValueGetterParams) =>({
        sendTime: params.row.sendTime,
        textPath: params.row.textArchivePath,
      }),
      renderCell: renderSendTimeCell,
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
      <Box sx={{ width: '100%', '& .data-table-hearder': {
        backgroundColor: '#283f4f', color: '#fff',
      }}}>
        <DataGrid
            rows={rowData}
            columns={columns}
            autoHeight
            rowHeight={ 120 }
            initialState={{
              pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
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
        {isImage ? (<Box sx={{ position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4, }}>
              <img src={itemPath} alt=''/>
          </Box>
          ) : (
          <Box sx={{ position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            width: '75%',
            p: 4, }}>
              <h2>Document Processing</h2>
            {textContent&&(
              <pre>
                {
                  // 개행문자를 기준으로 문자를 잘라(split) 배열로 만들고 
                  //배열 사이사이 <br />태그를 넣어 뿌려줘서 개행을 넣은 효과를 내준다.
                  textContent.split("\\n").map((line) => {
                  return (
                      <span>
                          {line}
                          <br />
                      </span>
                  );
                  })
                }
              </pre>
            )}
          </Box>)
        }
      </Modal>
  </>
  );
};

export default AuditLogTable;