import * as React from 'react';
import i18n from "../../i18n";
import { useCallback, useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { Box, Modal, TextField , Typography , Stack} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { atomsRegExData, IRegEx } from '../../atoms/atomsRegEx';
import { RegexRepository } from '../../repository/regexRepository';
import { useRecoilValue } from 'recoil';
import Button from '@mui/material/Button';
import {useCookies} from "react-cookie";



interface IRegExTable {
    executeQuery : boolean,
    setExecuteQuery : (a:boolean)=>void;
  };

const RegExTable = ({executeQuery, setExecuteQuery}: IRegExTable) => {
    const [t] = useTranslation();
    const [cookies, setCookie, removeCookie] = useCookies(['WatcherWebUserId','WatcherWebUserName', 'WatcherWebAuthToken']);
    const { loadAllRegex, modifyRegex } = useRecoilValue(RegexRepository);
    const regExData = useRecoilValue(atomsRegExData);
    const [rowData, setRowData] = useState<IRegEx[]>([]);

    const [selectedRow, setSelectedRow] = useState<IRegEx | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [value, setValue] = useState<string|undefined>(selectedRow?.regex_value);

    const handleModalClose = useCallback(()=>{
        setModalOpen(false);
    }, []);    

    const handleModalDelete = useCallback((name:string)=>{
        //delete (selectedRow)
        if (name !== undefined) {
            const newRegex = {
                action_type: 'DELETE',
                regex_name : name,
                regex_value : '' ,
                modify_user : cookies.WatcherWebUserId
            };
            const result = modifyRegex(newRegex);
        }

        setModalOpen(false);
    }, []);    

    const handleModalModify = useCallback((name:string, value:any)=>{
        //modify (selectedRow)
        if (value !== undefined) {
            const newRegex = {
                action_type: 'UPDATE',
                regex_name : name,
                regex_value : value ,
                modify_user : cookies.WatcherWebUserId
            };
            const result = modifyRegex(newRegex);
        }
        setModalOpen(false);
    }, []);    

    const queryRegexData = useCallback(()=>{
        loadAllRegex();
    }, [executeQuery]);    

    const setTableWithData = useCallback((Data:IRegEx[])=> {
        const updatedRowData: IRegEx[] = Data.map((data:IRegEx) => (
          {
            regex_name: data.regex_name,
            regex_value: data.regex_value,
            modify_user: data.modify_user
          }
        ));
        setRowData(updatedRowData);
      }, []);  

    useEffect(() =>{
        queryRegexData();
    }, [executeQuery, queryRegexData]);
    
    useEffect(()=> {
        setTableWithData(regExData);
      }, [regExData, setTableWithData]);

    const columns: GridColDef[] = [
        { field: 'regex_name', headerName: t('common.regex_name'), flex:0.5, headerClassName: 'data-table-hearder' },
        { field: 'regex_value', headerName: t('common.regex_value'), flex:1, headerClassName: 'data-table-hearder' },
        { field: 'modify_user', headerName: t('common.modify_user'),  flex:0.5, headerClassName: 'data-table-hearder' },
      ];      

      const handleModalOpen = useCallback((params: GridRowParams)=>{
        setSelectedRow(params.row as IRegEx);
        setModalOpen(true);
    }, []);    

    return(
        <>
            <Box sx={{ width: '100%', '& .data-table-hearder': {
            backgroundColor: '#283f4f', color: '#fff',
            }}}>
            <DataGrid
                rows={rowData}
                columns={columns}
                autoHeight
                rowHeight={ 80 }
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                onRowClick={handleModalOpen}
                pageSizeOptions={[5, 10, 20]}
                getRowId={(row) => row?.regex_name}
                sx={{ fontSize: 12 }}
            />
            </Box>
            {/* Modal */}
            <Modal open={modalOpen} onClose={handleModalClose}>
                <Box sx={{ 
                    position: 'absolute' as 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    width: '75%',
                    p: 4, }}>
                <h2>{t('common.regex_modify')}</h2>
                {selectedRow && (
                    <>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                            {selectedRow.regex_name}
                        </Typography>
                        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', mt: 2 , mb: 2}}>
                            <TextField defaultValue={selectedRow.regex_value} variant="outlined" sx={{ width: '60%' }}
                                value={value}
                                onChange = {(e)=>setValue(e.target.value)}
                            />
                        </Typography>
                        <Stack spacing={3} direction="row" justifyContent='flex-end'>
                            <Button variant="contained" onClick={handleModalClose}>취소</Button> 
                            <Button variant="contained" onClick={()=>handleModalDelete(selectedRow.regex_name)}>삭제</Button>
                            <Button variant="contained" onClick={()=>handleModalModify(selectedRow.regex_name, value)}>수정</Button>
                        </Stack>
                    </>
                )}
                </Box>
            </Modal>
        </>
    );
}


export default RegExTable;